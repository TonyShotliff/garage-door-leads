"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Operator = {
  id: string;
  business_name: string | null;
  email: string | null;
  business_phone: string | null;
  status: string | null;
  stripe_customer_id: string | null;
  created_at: string;
  custom_sms_message: string | null;
};

const VALID_STATUSES = ["active", "live", "cancelled"] as const;
type Status = (typeof VALID_STATUSES)[number];

function StatusDot({ status }: { status: string | null }) {
  if (status === "live") {
    return <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block flex-shrink-0" />;
  }
  if (status === "cancelled") {
    return <span className="w-2.5 h-2.5 rounded-full bg-red-400 inline-block flex-shrink-0" />;
  }
  return <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 inline-block flex-shrink-0" />;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function truncate(s: string | null, max: number): string {
  if (!s) return "—";
  return s.length > max ? s.slice(0, max) + "…" : s;
}

export default function AdminContent() {
  const [operators, setOperators] = useState<Operator[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [updating, setUpdating] = useState<Set<string>>(new Set());
  const [updateErrors, setUpdateErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch("/api/admin/operators")
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setOperators(data.operators);
      })
      .catch((e: unknown) =>
        setFetchError(e instanceof Error ? e.message : "Unknown error")
      )
      .finally(() => setLoading(false));
  }, []);

  async function handleStatusChange(
    id: string,
    newStatus: Status,
    prevStatus: string | null
  ) {
    // Optimistic update
    setOperators((prev) =>
      prev.map((op) => (op.id === id ? { ...op, status: newStatus } : op))
    );
    setUpdating((prev) => new Set(prev).add(id));
    setUpdateErrors((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });

    try {
      const res = await fetch("/api/admin/operators", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
    } catch (e: unknown) {
      // Revert on failure
      setOperators((prev) =>
        prev.map((op) => (op.id === id ? { ...op, status: prevStatus } : op))
      );
      setUpdateErrors((prev) => ({
        ...prev,
        [id]: e instanceof Error ? e.message : "Save failed",
      }));
    } finally {
      setUpdating((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  }

  const liveCount = operators.filter((o) => o.status === "live").length;
  const activeCount = operators.filter((o) => o.status === "active").length;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="border-b border-gray-100 bg-white px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-blue-600 tracking-tight">
            Insta Intake
          </Link>
          <Link
            href="/account"
            className="text-sm text-gray-500 hover:text-gray-700 transition"
          >
            My Account
          </Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Insta Intake Admin</h1>
          <p className="text-sm text-gray-500 mt-1">Operator management</p>
        </div>

        {/* Stats */}
        {!loading && !fetchError && (
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <p className="text-3xl font-bold text-gray-900">{operators.length}</p>
              <p className="text-sm text-gray-500 mt-1">Total operators</p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <p className="text-3xl font-bold text-green-600">{liveCount}</p>
              <p className="text-sm text-gray-500 mt-1">Live</p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <p className="text-3xl font-bold text-yellow-500">{activeCount}</p>
              <p className="text-sm text-gray-500 mt-1">Active / trial</p>
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center text-gray-400">
            Loading operators...
          </div>
        )}

        {/* Fetch error */}
        {fetchError && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-red-700 text-sm">
            Failed to load operators: {fetchError}
          </div>
        )}

        {/* Table */}
        {!loading && !fetchError && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-left">
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      SMS
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Business
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Email
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Phone
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Status
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Stripe ID
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Signed Up
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Custom Message
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {operators.length === 0 ? (
                    <tr>
                      <td
                        colSpan={8}
                        className="text-center py-12 text-gray-400"
                      >
                        No operators yet.
                      </td>
                    </tr>
                  ) : (
                    operators.map((op) => (
                      <tr key={op.id} className="hover:bg-gray-50 transition">
                        <td className="px-4 py-3">
                          <StatusDot status={op.status} />
                        </td>
                        <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">
                          {op.business_name ?? "—"}
                        </td>
                        <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                          {op.email ?? "—"}
                        </td>
                        <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                          {op.business_phone ?? "—"}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-col gap-1">
                            <select
                              value={op.status ?? "active"}
                              disabled={updating.has(op.id)}
                              onChange={(e) =>
                                handleStatusChange(
                                  op.id,
                                  e.target.value as Status,
                                  op.status
                                )
                              }
                              className="border border-gray-200 rounded-lg px-2 py-1 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 cursor-pointer"
                            >
                              {VALID_STATUSES.map((s) => (
                                <option key={s} value={s}>
                                  {s.charAt(0).toUpperCase() + s.slice(1)}
                                </option>
                              ))}
                            </select>
                            {updateErrors[op.id] && (
                              <p className="text-xs text-red-500">
                                {updateErrors[op.id]}
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-400 font-mono text-xs whitespace-nowrap">
                          {op.stripe_customer_id
                            ? op.stripe_customer_id.slice(0, 12) + "..."
                            : "—"}
                        </td>
                        <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                          {formatDate(op.created_at)}
                        </td>
                        <td className="px-4 py-3 text-gray-500 max-w-xs">
                          <span title={op.custom_sms_message ?? undefined}>
                            {truncate(op.custom_sms_message, 50)}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
