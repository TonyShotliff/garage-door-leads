import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const CALL_FORWARDING_DISABLE_HTML = `
  <table cellpadding="0" cellspacing="0" style="margin:16px 0;">
    <tr><td style="padding:4px 0;font-size:14px;color:#374151;"><strong>Verizon:</strong> dial *73 and press Call</td></tr>
    <tr><td style="padding:4px 0;font-size:14px;color:#374151;"><strong>AT&amp;T / T-Mobile:</strong> dial ##21# and press Call</td></tr>
    <tr><td style="padding:4px 0;font-size:14px;color:#374151;"><strong>Other carriers:</strong> call your carrier's support line and ask them to disable conditional call forwarding</td></tr>
  </table>
`;

async function sendCancellationEmail(email: string, businessName: string | null) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const name = businessName || "there";
  try {
    await resend.emails.send({
      from: "tony@instaintake.com",
      to: email,
      subject: "Before you go — one quick thing to undo",
      html: `
        <div style="font-family:-apple-system,sans-serif;max-width:520px;margin:0 auto;padding:24px;">
          <p style="font-size:16px;color:#111827;">Hi ${name},</p>
          <p style="font-size:15px;color:#374151;line-height:1.6;">
            Your Insta Intake subscription has been cancelled. One last step: if you set up
            call forwarding on your phone to route missed calls to Insta Intake, you'll want
            to turn that off — otherwise your missed calls will keep forwarding to a number
            that's no longer answering them.
          </p>
          <p style="font-size:15px;color:#111827;font-weight:600;margin-top:20px;">To turn off call forwarding:</p>
          ${CALL_FORWARDING_DISABLE_HTML}
          <p style="font-size:14px;color:#6b7280;margin-top:24px;">
            Thanks for trying Insta Intake. If you ever want to come back, your account is
            still here.
          </p>
        </div>
      `,
    });
  } catch (err) {
    console.error("Cancellation email failed:", err instanceof Error ? err.message : err);
  }
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      httpClient: Stripe.createNodeHttpClient(),
    });
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Webhook signature verification failed";
    console.error("Stripe webhook signature error:", message);
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const stripeCustomerId =
      typeof session.customer === "string" ? session.customer : null;
    const stripeSubscriptionId =
      typeof session.subscription === "string" ? session.subscription : null;
    const email =
      session.customer_details?.email ?? session.customer_email ?? null;

    const { error } = await supabase.from("operators").upsert(
      {
        stripe_customer_id: stripeCustomerId,
        stripe_subscription_id: stripeSubscriptionId,
        email,
        status: "active",
      },
      { onConflict: "email" }
    );

    if (error) {
      console.error("Supabase operator upsert error:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  if (event.type === "customer.subscription.updated") {
    const subscription = event.data.object as Stripe.Subscription;

    if (subscription.cancel_at_period_end) {
      const stripeSubscriptionId = subscription.id;

      const { data: operator, error: lookupError } = await supabase
        .from("operators")
        .select("email, business_name")
        .eq("stripe_subscription_id", stripeSubscriptionId)
        .maybeSingle();

      if (lookupError) {
        console.error("Operator lookup error on cancel:", lookupError.message);
      } else if (operator?.email) {
        await sendCancellationEmail(operator.email, operator.business_name);
      }
    }
  }

  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as Stripe.Subscription;
    const stripeSubscriptionId = subscription.id;

    const { error } = await supabase
      .from("operators")
      .update({ status: "cancelled" })
      .eq("stripe_subscription_id", stripeSubscriptionId);

    if (error) {
      console.error("Supabase cancellation update error:", error.message);
    }
  }

  return NextResponse.json({ received: true });
}
