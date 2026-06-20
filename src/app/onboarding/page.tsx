import Stripe from "stripe";
import OnboardingForm from "./OnboardingForm";

export default async function OnboardingPage({
  searchParams,
}: {
  searchParams: { session_id?: string };
}) {
  let prefillEmail = "";
  let stripeCustomerId = "";

  if (searchParams.session_id) {
    try {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
        httpClient: Stripe.createNodeHttpClient(),
      });
      const session = await stripe.checkout.sessions.retrieve(
        searchParams.session_id
      );
      prefillEmail =
        session.customer_details?.email ?? session.customer_email ?? "";
      stripeCustomerId =
        typeof session.customer === "string" ? session.customer : "";
    } catch {
      // Session retrieval failed — fields left blank for manual entry
    }
  }

  return (
    <main className="min-h-screen bg-[#F4F1E8] py-16 px-4">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center bg-[#D85A30] text-white rounded-full w-14 h-14 mb-4">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">One last step</h1>
          <p className="text-gray-900 opacity-65 mt-2">
            Tell us about your business so we can activate your missed-call SMS.
          </p>
        </div>
        <OnboardingForm prefillEmail={prefillEmail} stripeCustomerId={stripeCustomerId} />
      </div>
    </main>
  );
}
