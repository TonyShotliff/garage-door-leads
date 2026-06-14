import Stripe from "stripe";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    // Explicitly use Node's HTTP client — Next.js 14 patches the global fetch
    // in a way that breaks the Stripe SDK's retry/connection logic.
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      httpClient: Stripe.createNodeHttpClient(),
    });

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: "price_1TTT8KJDihhuWfiFrODF9dkc",
          quantity: 1,
        },
      ],
      // {CHECKOUT_SESSION_ID} is a Stripe macro — replaced with the real ID on redirect
      subscription_data: {
        trial_period_days: 30,
      },
      success_url: "https://instaintake.com/success?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "https://instaintake.com/pricing",
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to create checkout session";
    console.error("Stripe checkout error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
