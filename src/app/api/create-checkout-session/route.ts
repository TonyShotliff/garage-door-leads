import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST() {
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [
      {
        price: "price_1TTT8KJDihhuWfiFrODF9dkc",
        quantity: 1,
      },
    ],
    success_url: "https://instaintake.com/success",
    cancel_url: "https://instaintake.com/pricing",
  });

  return NextResponse.json({ url: session.url });
}

