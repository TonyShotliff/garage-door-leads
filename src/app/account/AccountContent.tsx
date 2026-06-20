"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabase } from "@/lib/supabase-browser";

type Operator = {
  business_name: string | null;
  business_phone: string | null;
  status: string | null;
  stripe_customer_id: string | null;
  custom_sms_message: string | null;
};

type MessageRow = {
  id: string;
  created_at: string;
  caller_phone: string;
  direction: "inbound" | "outbound";
  message_body: string;
};

const INSTA_INTAKE_NUMBER = "+1 (844) 252-4470";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
}

function DirectionBadge({ direction }: { direction: "inbound" | "outbound" }) {
  if (direction === "outbound") {
    return (
      <span className="inline-flex items-center gap-1 bg-orange-100 text-[#993C1D] text-xs font-semibold px-2.5 py-1 rounded-full">
        <span className="w-1.5 h-1.5 rounded-full bg-[#D85A30] inline-block" />
        Sent
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 text-xs font-semibold px-2.5 py-1 rounded-full">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 inline-block" />
      Reply
    </span>
  );
}

// ── Setup progress bar ────────────────────────────────────────────────────────

type StepState = "complete" | "current" | "upcoming";

function StepIcon({ state }: { state: StepState }) {
  if (state === "complete") {
    return (
      <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center flex-shrink-0">
        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
      </div>
    );
  }
  if (state === "current") {
    return (
      <div className="w-8 h-8 rounded-full bg-[#D85A30] flex items-center justify-center flex-shrink-0">
        <div className="w-2.5 h-2.5 rounded-full bg-white" />
      </div>
    );
  }
  return (
    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
      <div className="w-2.5 h-2.5 rounded-full bg-gray-400" />
    </div>
  );
}

function SetupProgress({ status }: { status: string | null }) {
  const isLive = status === "live";

  const steps: { label: string; sublabel: string; state: StepState }[] = [
    {
      label: "Account Created",
      sublabel: "You're signed up and ready.",
      state: "complete",
    },
    {
      label: "SMS Activation",
      sublabel: isLive
        ? "Your SMS line is active."
        : "We're setting up your SMS line — usually 1–3 days.",
      state: isLive ? "complete" : "current",
    },
    {
      label: "You're Live",
      sublabel: "Missed calls trigger instant auto-texts.",
      state: isLive ? "complete" : "upcoming",
    },
  ];

  return (
    <section className="bg-white rounded-2xl p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-5">Setup Progress</h2>
      <div className="flex items-start gap-0">
        {steps.map((step, i) => (
          <div key={step.label} className="flex-1 flex flex-col items-center relative">
            {i > 0 && (
              <div
                className={`absolute top-4 right-1/2 w-full h-0.5 -translate-y-1/2 ${
                  steps[i - 1].state === "complete" ? "bg-emerald-300" : "bg-gray-200"
                }`}
                style={{ left: "-50%", width: "100%" }}
              />
            )}
            <div className="relative z-10">
              <StepIcon state={step.state} />
            </div>
            <p
              className={`text-xs font-semibold mt-2 text-center ${
                step.state === "upcoming" ? "text-gray-400" : "text-gray-800"
              }`}
            >
              {step.label}
            </p>
            <p className="text-xs text-gray-400 mt-0.5 text-center leading-tight px-1">
              {step.sublabel}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── SMS preview card ──────────────────────────────────────────────────────────

function SmsPreview({ message }: { message: string }) {
  return (
    <section className="bg-white rounded-2xl p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-1">What your customers receive</h2>
      <p className="text-sm text-gray-500 mb-5">
        This message is sent automatically the moment you miss a call.
      </p>

      <div className="bg-[#F4F1E8] rounded-xl px-4 py-5">
        <div className="flex justify-start">
          <div className="max-w-[80%] bg-gray-200 text-gray-900 text-sm leading-relaxed px-4 py-3 rounded-2xl rounded-tl-sm">
            {message}
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-2 ml-1">
          From: {INSTA_INTAKE_NUMBER}
        </p>
      </div>
    </section>
  );
}

// ── Call forwarding instructions ──────────────────────────────────────────────

type PhoneType = "iphone" | "android" | "landline";

const FORWARDING_INSTRUCTIONS: { id: PhoneType; label: string; steps: string[] }[] = [
  {
    id: "iphone",
    label: "iPhone",
    steps: [
      `Option A — Dial code (easiest): Open your Phone app, dial *61*+18442524470# and press Call. You'll hear a confirmation tone.`,
      `Option B — Contact your carrier: Call your carrier's support line and ask them to set up "conditional call forwarding on no-answer" to ${INSTA_INTAKE_NUMBER}.`,
    ],
  },
  {
    id: "android",
    label: "Android",
    steps: [
      `Open the Phone app → tap the three-dot menu → Settings → Supplemental services (or Calls).`,
      `Tap "Forward when unanswered" → enter ${INSTA_INTAKE_NUMBER} → Save.`,
      `(Menu labels vary by manufacturer — look for "Call Forwarding" if you don't see Supplemental services.)`,
    ],
  },
  {
    id: "landline",
    label: "Landline / Carrier",
    steps: [
      `Call your phone carrier's support line and ask to set up conditional call forwarding on no-answer to ${INSTA_INTAKE_NUMBER}.`,
      `Most carriers can do this in a few minutes over the phone.`,
    ],
  },
];

function ForwardingInstructions() {
  const [open, setOpen] = useState<PhoneType | null>(null);

  function toggle(id: PhoneType) {
    setOpen((prev) => (prev === id ? null : id));
  }

  return (
    <section className="bg-white rounded-2xl p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-1">How to activate on your phone</h2>
      <p className="text-sm text-gray-500 mb-2">
        Insta Intake works when your business calls forward to your Insta Intake number on no-answer.
        Here&apos;s how to set it up:
      </p>

      <div className="flex items-center gap-3 bg-orange-50 rounded-xl px-4 py-3 mb-5">
        <svg className="w-5 h-5 text-[#993C1D] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
        <div>
          <p className="text-xs text-[#993C1D] font-medium uppercase tracking-wide">Your Insta Intake number</p>
          <p className="text-[#4A1B0C] font-bold text-lg tracking-wide">{INSTA_INTAKE_NUMBER}</p>
        </div>
      </div>

      <div className="space-y-2">
        {FORWARDING_INSTRUCTIONS.map(({ id, label, steps }) => (
          <div key={id} className="border border-gray-100 rounded-xl overflow-hidden">
            <button
              onClick={() => toggle(id)}
              className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition"
            >
              <span className="text-sm font-semibold text-gray-800">{label}</span>
              <svg
                className={`w-4 h-4 text-gray-400 transition-transform ${open === id ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {open === id && (
              <div className="px-4 pb-4 space-y-2">
                {steps.map((step, i) => (
                  <div key={i} className="flex gap-2.5">
                    <span className="text-[#993C1D] font-bold text-xs mt-0.5 flex-shrink-0">{i + 1}.</span>
                    <p className="text-sm text-gray-600 leading-relaxed">{step}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-400 mt-4 leading-relaxed">
        Only forwards when you don&apos;t answer — your phone still rings normally first.
      </p>
    </section>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function AccountContent({
  userEmail,
  operator,
  messages,
}: {
  userEmail: string;
  operator: Operator | null;
  messages: MessageRow[];
}) {
  const router = useRouter();

  const [businessName, setBusinessName] = useState(operator?.business_name ?? "");
  const [businessPhone, setBusinessPhone] = useState(operator?.business_phone ?? "");
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saved" | "error">("idle");
  const [saveError, setSaveError] = useState<string | null>(null);

  const [customSmsMessage, setCustomSmsMessage] = useState(operator?.custom_sms_message ?? "");
  const [savingMessage, setSavingMessage] = useState(false);
  const [messageSaveStatus, setMessageSaveStatus] = useState<"idle" | "saved" | "error">("idle");
  const [messageSaveError, setMessageSaveError] = useState<string | null>(null);

  const [portalLoading, setPortalLoading] = useState(false);
  const [portalError, setPortalError] = useState<string | null>(null);

  const isActive = operator?.status === "active" || operator?.status === "live";

  const displayName = businessName.trim() || "Your Business";
  const defaultSmsText = `Hi, this is ${displayName}. Sorry we missed your call — how can we help? Reply here and we'll get right back to you. Reply STOP to opt out.`;
  const previewMessage = customSmsMessage.trim() ? customSmsMessage.trim() : defaultSmsText;

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaveStatus("idle");
    setSaveError(null);
    try {
      const res = await fetch("/api/account/update-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessName, businessPhone }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setSaveStatus("saved");
    } catch (err) {
      setSaveStatus("error");
      setSaveError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  async function handleSaveMessage(e: React.FormEvent) {
    e.preventDefault();
    setSavingMessage(true);
    setMessageSaveStatus("idle");
    setMessageSaveError(null);
    try {
      const res = await fetch("/api/account/update-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customSmsMessage }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setMessageSaveStatus("saved");
    } catch (err) {
      setMessageSaveStatus("error");
      setMessageSaveError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSavingMessage(false);
    }
  }

  async function handleManageSubscription() {
    if (!operator?.stripe_customer_id) return;
    setPortalLoading(true);
    setPortalError(null);
    try {
      const res = await fetch("/api/create-portal-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stripeCustomerId: operator.stripe_customer_id }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      window.location.href = data.url;
    } catch (err) {
      setPortalError(err instanceof Error ? err.message : "Something went wrong.");
      setPortalLoading(false);
    }
  }

  async function handleSignOut() {
    const supabase = createBrowserSupabase();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-[#F4F1E8]">
      <nav className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <span className="text-xl font-bold text-gray-900 tracking-tight">Insta Intake</span>
          <button
            onClick={handleSignOut}
            className="text-sm text-gray-500 hover:text-gray-700 transition"
          >
            Sign Out
          </button>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-10 space-y-8">

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {operator?.business_name ?? "My Account"}
            </h1>
            <p className="text-gray-500 text-sm mt-1">{userEmail}</p>
          </div>
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold ${
              isActive
                ? "bg-emerald-100 text-emerald-700"
                : "bg-amber-100 text-amber-700"
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isActive ? "bg-emerald-600" : "bg-amber-500"}`} />
            {isActive ? "Active" : "Pending Setup"}
          </span>
        </div>

        <SetupProgress status={operator?.status ?? null} />

        <section className="bg-white rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-5">Business Profile</h2>
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#D85A30] focus:border-transparent transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Business Phone</label>
              <input
                type="tel"
                value={businessPhone}
                onChange={(e) => setBusinessPhone(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#D85A30] focus:border-transparent transition"
              />
            </div>

            <div className="flex items-center gap-4">
              <button
                type="submit"
                disabled={saving}
                className="bg-[#D85A30] hover:bg-[#c14d26] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold px-5 py-2.5 rounded-lg transition text-sm"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
              {saveStatus === "saved" && (
                <span className="text-sm text-emerald-700 font-medium">Saved!</span>
              )}
              {saveStatus === "error" && (
                <span className="text-sm text-red-600">{saveError}</span>
              )}
            </div>
          </form>
        </section>

        <section className="bg-white rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-1">Customize Your Message</h2>
          <p className="text-sm text-gray-500 mb-4">
            Personalize the text your customers receive when you miss their call.
            Leave blank to use the default message with your business name.
          </p>
          <form onSubmit={handleSaveMessage} className="space-y-3">
            <div>
              <textarea
                value={customSmsMessage}
                onChange={(e) => {
                  setCustomSmsMessage(e.target.value);
                  setMessageSaveStatus("idle");
                }}
                placeholder={defaultSmsText}
                rows={3}
                maxLength={320}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D85A30] focus:border-transparent transition resize-none text-sm"
              />
              <p
                className={`text-xs mt-1 text-right ${
                  customSmsMessage.length > 160 ? "text-amber-600 font-medium" : "text-gray-400"
                }`}
              >
                {customSmsMessage.length} / 160
                {customSmsMessage.length > 160 ? " — may send as 2 messages" : ""}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                type="submit"
                disabled={savingMessage}
                className="bg-[#D85A30] hover:bg-[#c14d26] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold px-5 py-2.5 rounded-lg transition text-sm"
              >
                {savingMessage ? "Saving..." : "Save Message"}
              </button>
              {messageSaveStatus === "saved" && (
                <span className="text-sm text-emerald-700 font-medium">Saved!</span>
              )}
              {messageSaveStatus === "error" && (
                <span className="text-sm text-red-600">{messageSaveError}</span>
              )}
            </div>
          </form>
        </section>

        <SmsPreview message={previewMessage} />

        <ForwardingInstructions />

        <section className="bg-white rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-1">Subscription</h2>
          <p className="text-sm text-gray-500 mb-4">
            Manage billing, update your payment method, or cancel.
          </p>
          {operator?.stripe_customer_id ? (
            <>
              <button
                onClick={handleManageSubscription}
                disabled={portalLoading}
                className="bg-gray-900 hover:bg-gray-800 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold px-5 py-2.5 rounded-lg transition text-sm"
              >
                {portalLoading ? "Loading..." : "Manage Subscription"}
              </button>
              {portalError && (
                <p className="text-sm text-red-600 mt-2">{portalError}</p>
              )}
            </>
          ) : (
            <p className="text-sm text-gray-400">No subscription found for this account.</p>
          )}
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-1">Recent Activity</h2>
          <p className="text-sm text-gray-500 mb-5">Missed calls and customer replies</p>

          {messages.length === 0 ? (
            <div className="bg-white rounded-2xl px-8 py-12 text-center">
              <p className="text-gray-500 font-medium">No activity yet</p>
              <p className="text-gray-400 text-sm mt-1">
                Messages will appear here once the missed-call flow is active.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {messages.map((row, i) => {
                const date = formatDate(row.created_at);
                const prevDate = i > 0 ? formatDate(messages[i - 1].created_at) : null;
                const showDivider = i === 0 || date !== prevDate;
                return (
                  <div key={row.id}>
                    {showDivider && (
                      <div className="flex items-center gap-3 py-2">
                        <div className="h-px flex-1 bg-gray-200" />
                        <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">{date}</span>
                        <div className="h-px flex-1 bg-gray-200" />
                      </div>
                    )}
                    <div className="bg-white rounded-xl px-5 py-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1.5">
                            <DirectionBadge direction={row.direction} />
                            <span className="text-sm font-semibold text-gray-800">{row.caller_phone}</span>
                          </div>
                          <p className="text-gray-600 text-sm leading-relaxed break-words">{row.message_body}</p>
                        </div>
                        <span className="text-xs text-gray-400 whitespace-nowrap pt-0.5 flex-shrink-0">
                          {formatTime(row.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
              <p className="text-center text-xs text-gray-400 pt-2">
                {messages.length} {messages.length === 1 ? "message" : "messages"}
              </p>
            </div>
          )}
        </section>

      </main>
    </div>
  );
}
