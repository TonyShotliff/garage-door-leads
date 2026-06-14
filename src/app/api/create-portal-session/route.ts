import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const { stripeCustomerId } = await req.json();

  if (!stripeCustomerId) {
    return NextResponse.json(
      { error: "Missing Stripe customer ID" },
      { status: 400 }
    );
  }

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      httpClient: Stripe.createNodeHttpClient(),
    });

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: "https://instaintake.com/onboarding",
    });

    return NextResponse.json({ url: portalSession.url });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to create portal session";
    console.error("Stripe portal session error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
