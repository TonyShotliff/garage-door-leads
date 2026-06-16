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

  const isActive = operator?.status === "active";

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

        {/* Edit profile */}
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

        {/* Subscription */}
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

        {/* Activity log */}
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
