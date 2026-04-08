"use client";

import { useState } from "react";

export default function PricingPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubscribe() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/create-checkout-session", { method: "POST" });
      const { url, error: apiError } = await res.json();
      if (apiError) throw new Error(apiError);
      window.location.href = url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900">Simple Pricing</h1>
          <p className="text-gray-500 mt-3">One plan. Everything you need to grow your garage door business.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
          {/* Plan header */}
          <div className="bg-blue-600 px-8 py-8 text-center">
            <p className="text-blue-100 text-sm font-medium uppercase tracking-widest mb-2">Monthly Plan</p>
            <div className="flex items-end justify-center gap-1">
              <span className="text-white text-5xl font-bold">$49</span>
              <span className="text-blue-200 text-lg mb-1">/month</span>
            </div>
            <p className="text-blue-100 text-sm mt-2">Cancel anytime</p>
          </div>

          {/* Features */}
          <div className="px-8 py-6 space-y-4">
            {[
              "Exclusive local leads delivered to you",
              "Real-time SMS & email notifications",
              "Full lead details: name, phone, service type",
              "Photo attachments from customers",
              "Priority emergency lead alerts",
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-3">
                <div className="flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-gray-700 text-sm">{feature}</span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="px-8 pb-8">
            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
                {error}
              </div>
            )}
            <button
              onClick={handleSubscribe}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition text-base shadow-sm"
            >
              {loading ? "Redirecting to checkout..." : "Subscribe Now — $49/month"}
            </button>
            <p className="text-xs text-center text-gray-400 mt-3">
              Secure payment powered by Stripe. Cancel anytime from your account.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
