"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabase } from "@/lib/supabase-browser";

type Operator = {
  business_name: string | null;
  business_phone: string | null;
  status: string | null;
  stripe_customer_id: string | null;
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
      <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-full">
        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block" />
        Sent
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-full">
      <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
      Reply
    </span>
  );
}

// ── Setup progress bar ────────────────────────────────────────────────────────

type StepState = "complete" | "current" | "upcoming";

function StepIcon({ state }: { state: StepState }) {
  if (state === "complete") {
    return (
      <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
      </div>
    );
  }
  if (state === "current") {
    return (
      <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center flex-shrink-0">
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
    <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-5">Setup Progress</h2>
      <div className="flex items-start gap-0">
        {steps.map((step, i) => (
          <div key={step.label} className="flex-1 flex flex-col items-center relative">
            {/* Connector line left */}
            {i > 0 && (
              <div
                className={`absolute top-4 right-1/2 w-full h-0.5 -translate-y-1/2 ${
                  steps[i - 1].state === "complete" ? "bg-green-300" : "bg-gray-200"
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

function SmsPreview({ businessName }: { businessName: string }) {
  const displayName = businessName.trim() || "Your Business";
  const message = `Hi, this is ${displayName}. Sorry we missed your call — how can we help? Reply here and we'll get right back to you. Reply STOP to opt out.`;

  return (
    <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-1">What your customers receive</h2>
      <p className="text-sm text-gray-500 mb-5">
        This message is sent automatically the moment you miss a call.
      </p>

      {/* Phone mockup */}
      <div className="bg-gray-50 rounded-xl px-4 py-5">
        <div className="flex justify-start">
          <div className="max-w-[80%] bg-gray-200 text-gray-900 text-sm leading-relaxed px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm">
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
    <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-1">How to activate on your phone</h2>
      <p className="text-sm text-gray-500 mb-2">
        Insta Intake works when your business calls forward to your Insta Intake number on no-answer.
        Here&apos;s how to set it up:
      </p>

      {/* Number callout */}
      <div className="flex items-center gap-3 bg-blue-50 rounded-xl px-4 py-3 mb-5">
        <svg className="w-5 h-5 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
        <div>
          <p className="text-xs text-blue-600 font-medium uppercase tracking-wide">Your Insta Intake number</p>
          <p className="text-blue-900 font-bold text-lg tracking-wide">{INSTA_INTAKE_NUMBER}</p>
        </div>
      </div>

      {/* Accordion */}
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
                    <span className="text-blue-500 font-bold text-xs mt-0.5 flex-shrink-0">{i + 1}.</span>
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

  const [portalLoading, setPortalLoading] = useState(false);
  const [portalError, setPortalError] = useState<string | null>(null);

  const isActive = operator?.status === "active" || operator?.status === "live";

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
    <div className="min-h-screen bg-gray-50">
      {/* Nav */}
      <nav className="border-b border-gray-100 bg-white px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <span className="text-xl font-bold text-blue-600 tracking-tight">Insta Intake</span>
          <button
            onClick={handleSignOut}
            className="text-sm text-gray-500 hover:text-gray-700 transition"
          >
            Sign Out
          </button>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-10 space-y-8">

        {/* Header */}
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
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isActive ? "bg-green-500" : "bg-yellow-500"}`} />
            {isActive ? "Active" : "Pending Setup"}
          </span>
        </div>

        {/* 1 — Setup progress */}
        <SetupProgress status={operator?.status ?? null} />

        {/* 2 — Business profile */}
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-5">Business Profile</h2>
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Business Phone</label>
              <input
                type="tel"
                value={businessPhone}
                onChange={(e) => setBusinessPhone(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            <div className="flex items-center gap-4">
              <button
                type="submit"
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold px-5 py-2.5 rounded-lg transition text-sm shadow-sm"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
              {saveStatus === "saved" && (
                <span className="text-sm text-green-600 font-medium">Saved!</span>
              )}
              {saveStatus === "error" && (
                <span className="text-sm text-red-600">{saveError}</span>
              )}
            </div>
          </form>
        </section>

        {/* 3 — SMS preview */}
        <SmsPreview businessName={businessName} />

        {/* 4 — Call forwarding instructions */}
        <ForwardingInstructions />

        {/* 5 — Subscription */}
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-1">Subscription</h2>
          <p className="text-sm text-gray-500 mb-4">
            Manage billing, update your payment method, or cancel.
          </p>
          {operator?.stripe_customer_id ? (
            <>
              <button
                onClick={handleManageSubscription}
                disabled={portalLoading}
                className="bg-gray-900 hover:bg-gray-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold px-5 py-2.5 rounded-lg transition text-sm shadow-sm"
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

        {/* 6 — Activity log */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-1">Recent Activity</h2>
          <p className="text-sm text-gray-500 mb-5">Missed calls and customer replies</p>

          {messages.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-8 py-12 text-center">
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
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-4">
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
