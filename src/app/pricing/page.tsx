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
    <main className="min-h-screen bg-[#F4F1E8] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Simple pricing</h1>
          <p className="text-gray-900 opacity-65 mt-2.5">One plan. Stop losing jobs to voicemail.</p>
        </div>

        <div className="bg-white rounded-2xl overflow-hidden">
          {/* Plan header */}
          <div className="bg-gray-900 px-8 py-8 text-center">
            <p className="text-gray-400 text-xs font-medium uppercase tracking-widest mb-2.5">Monthly plan</p>
            <div className="flex items-end justify-center gap-1">
              <span className="text-white text-5xl font-bold">$49</span>
              <span className="text-gray-400 text-base mb-1">/month</span>
            </div>
            <p className="text-gray-500 text-sm mt-2">Cancel anytime</p>
          </div>

          {/* Features */}
          <div className="px-7 py-6 space-y-3">
            {[
              "Instant auto-text the moment you miss a call",
              "Works with your existing phone number",
              "No new app to install or number to hand out",
              "Simple setup — running in minutes",
              "Cancel anytime, no contracts",
            ].map((feature) => (
              <div key={feature} className="flex items-start gap-2.5">
                <svg className="w-4 h-4 text-emerald-700 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-900 text-sm">{feature}</span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="px-7 pb-7">
            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
                {error}
              </div>
            )}
            <button
              onClick={handleSubscribe}
              disabled={loading}
              className="w-full bg-[#D85A30] hover:bg-[#c14d26] active:bg-[#a8421f] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-lg transition text-base"
            >
              {loading ? "Redirecting to checkout..." : "Start my free trial"}
            </button>
            <p className="text-xs text-center text-gray-400 mt-2.5">
              Card required. $49/month after your 30-day free trial.
            </p>
          </div>
        </div>

        {/* Trust signals */}
        <div className="mt-7 space-y-3">
          <div className="flex items-center gap-3 bg-white rounded-lg px-4 py-3.5">
            <svg className="w-[18px] h-[18px] text-[#993C1D] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <rect x="2" y="5" width="20" height="14" rx="2" strokeWidth="2" />
              <path strokeWidth="2" d="M2 10h20" />
            </svg>
            <span className="text-sm text-gray-600">Secure checkout through Stripe — we never see your card details</span>
          </div>
          <div className="flex items-center gap-3 bg-white rounded-lg px-4 py-3.5">
            <svg className="w-[18px] h-[18px] text-[#993C1D] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
            </svg>
            <span className="text-sm text-gray-600">No charge for 30 days. Cancel before then and pay nothing.</span>
          </div>
          <div className="flex items-center gap-3 bg-white rounded-lg px-4 py-3.5">
            <svg className="w-[18px] h-[18px] text-[#993C1D] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="8" r="4" strokeWidth="2" />
              <path strokeWidth="2" strokeLinecap="round" d="M4 21c0-4.5 3.5-7 8-7s8 2.5 8 7" />
            </svg>
            <span className="text-sm text-gray-600">Built and operated by Anthony Shotliff — a real person, not a call center</span>
          </div>
        </div>
      </div>
    </main>
  );
}
