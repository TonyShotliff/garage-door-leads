"use client";

import { useState } from "react";

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
          Thanks! We&apos;ll be in touch shortly with next steps.
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
