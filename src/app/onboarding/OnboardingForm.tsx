"use client";

import { useState } from "react";

const INSTA_INTAKE_NUMBER = "+1 (844) 252-4470";

export default function OnboardingForm({
  prefillEmail,
  stripeCustomerId,
}: {
  prefillEmail: string;
  stripeCustomerId: string;
}) {
  const [form, setForm] = useState({
    businessName: "",
    businessPhone: "",
    email: prefillEmail,
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [portalLoading, setPortalLoading] = useState(false);
  const [portalError, setPortalError] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName: form.businessName,
          businessPhone: form.businessPhone,
          email: form.email,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleManageSubscription() {
    setPortalLoading(true);
    setPortalError(null);
    try {
      const res = await fetch("/api/create-portal-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stripeCustomerId }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      window.location.href = data.url;
    } catch (err) {
      setPortalError(err instanceof Error ? err.message : "Something went wrong.");
      setPortalLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="space-y-4">
        <div className="bg-white rounded-2xl p-10 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-emerald-50 rounded-full p-4">
              <svg
                className="w-10 h-10 text-emerald-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">You&apos;re all set!</h2>
          <p className="text-gray-500 leading-relaxed mb-8">
            One more step below to start catching missed calls. We also emailed you these
            instructions so you can come back to them anytime.
          </p>
          <div className="space-y-3">
            <a
              href="/account"
              className="block w-full bg-[#D85A30] hover:bg-[#c14d26] text-white font-semibold py-3 rounded-lg transition text-sm text-center"
            >
              Go to My Account
            </a>
            {stripeCustomerId && (
              <div>
                <button
                  onClick={handleManageSubscription}
                  disabled={portalLoading}
                  className="text-sm text-gray-600 hover:text-gray-900 disabled:opacity-60 disabled:cursor-not-allowed underline transition"
                >
                  {portalLoading ? "Loading..." : "Manage Subscription"}
                </button>
                {portalError && (
                  <p className="text-xs text-red-600 mt-2">{portalError}</p>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            Next: forward your missed calls
          </h3>
          <p className="text-sm text-gray-500 mb-5">
            This only forwards calls you don&apos;t answer — your phone still rings normally
            first.
          </p>

          <div className="flex items-center gap-3 bg-orange-50 rounded-xl px-4 py-3 mb-5">
            <svg className="w-5 h-5 text-[#993C1D] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <div>
              <p className="text-xs text-[#993C1D] font-medium uppercase tracking-wide">Forward to this number</p>
              <p className="text-[#4A1B0C] font-bold text-lg tracking-wide">{INSTA_INTAKE_NUMBER}</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="border border-gray-100 rounded-xl px-4 py-3">
              <p className="text-sm font-semibold text-gray-800 mb-1">Verizon</p>
              <p className="text-sm text-gray-600">
                Dial <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">*7118442524470</code> and press Call (no # at the end)
              </p>
            </div>
            <div className="border border-gray-100 rounded-xl px-4 py-3">
              <p className="text-sm font-semibold text-gray-800 mb-1">AT&amp;T / T-Mobile</p>
              <p className="text-sm text-gray-600">
                Dial <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">*61*18442524470#</code> and press Call
              </p>
            </div>
            <div className="border border-gray-100 rounded-xl px-4 py-3">
              <p className="text-sm font-semibold text-gray-800 mb-1">Other carriers</p>
              <p className="text-sm text-gray-600">
                Call your carrier&apos;s support line and ask them to set up &quot;conditional call
                forwarding on no-answer&quot; to {INSTA_INTAKE_NUMBER}
              </p>
            </div>
          </div>

          <p className="text-xs text-gray-400 mt-4 leading-relaxed">
            You should hear a confirmation tone after dialing. Full instructions and an
            option to disable forwarding are always available on your{" "}
            <a href="/account" className="text-[#993C1D] underline">account page</a>.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-8">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Business Name <span className="text-[#993C1D]">*</span>
          </label>
          <input
            type="text"
            name="businessName"
            value={form.businessName}
            onChange={handleChange}
            required
            placeholder="Ace Garage Door Co."
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D85A30] focus:border-transparent transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Business Phone Number <span className="text-[#993C1D]">*</span>
          </label>
          <input
            type="tel"
            name="businessPhone"
            value={form.businessPhone}
            onChange={handleChange}
            required
            placeholder="(555) 000-0000"
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D85A30] focus:border-transparent transition"
          />
          <p className="text-xs text-gray-400 mt-1">
            The number your customers already call — we&apos;ll connect this to
            your missed-call SMS.
          </p>
          <p className="text-xs text-gray-500 mt-2 leading-relaxed">
            When a customer calls your business number and you miss it, they will receive one automated SMS from your business via Insta Intake. Message and data rates may apply. Customers can reply <strong>STOP</strong> to opt out at any time.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address <span className="text-[#993C1D]">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            placeholder="you@example.com"
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D85A30] focus:border-transparent transition"
          />
          {prefillEmail && (
            <p className="text-xs text-gray-400 mt-1">
              Pre-filled from your checkout — update if needed.
            </p>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-[#D85A30] hover:bg-[#c14d26] active:bg-[#a8421f] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition text-base"
        >
          {submitting ? "Saving..." : "Complete Setup"}
        </button>
      </form>
    </div>
  );
}
