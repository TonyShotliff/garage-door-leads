import { createClient } from "@supabase/supabase-js";
import NavBar from "@/components/NavBar";

// Always fetch fresh data — never statically generate this page
export const dynamic = "force-dynamic";

type MessageRow = {
  id: string;
  created_at: string;
  caller_phone: string;
  direction: "inbound" | "outbound";
  message_body: string;
};

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
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

export default async function DashboardPage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: messages, error } = await supabase
    .from("message_log")
    .select("*")
    .order("created_at", { ascending: false });

  const rows: MessageRow[] = messages ?? [];

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar cta={<span className="text-sm text-gray-400">Activity Log</span>} />

      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Recent Activity</h1>
          <p className="text-gray-500 mt-1">Missed calls and customer replies</p>
        </div>

        {/* Error state */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-5 py-4 text-sm mb-6">
            Could not load activity: {error.message}
          </div>
        )}

        {/* Empty state */}
        {!error && rows.length === 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-8 py-16 text-center">
            <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-7 h-7 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <p className="text-gray-500 font-medium">No activity yet</p>
            <p className="text-gray-400 text-sm mt-1">
              Messages will appear here once the missed-call flow is active.
            </p>
          </div>
        )}

        {/* Message list */}
        {rows.length > 0 && (
          <div className="space-y-3">
            {rows.map((row, i) => {
              const date = formatDate(row.created_at);
              const prevDate = i > 0 ? formatDate(rows[i - 1].created_at) : null;
              const showDateDivider = date !== prevDate;

              return (
                <div key={row.id}>
                  {/* Date divider */}
                  {(i === 0 || showDateDivider) && (
                    <div className="flex items-center gap-3 py-2">
                      <div className="h-px flex-1 bg-gray-200" />
                      <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                        {date}
                      </span>
                      <div className="h-px flex-1 bg-gray-200" />
                    </div>
                  )}

                  {/* Message card */}
                  <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-4">
                    <div className="flex items-start justify-between gap-4">
                      {/* Left: badge + phone + body */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5">
                          <DirectionBadge direction={row.direction} />
                          <span className="text-sm font-semibold text-gray-800">
                            {row.caller_phone}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed break-words">
                          {row.message_body}
                        </p>
                      </div>

                      {/* Right: time */}
                      <span className="text-xs text-gray-400 whitespace-nowrap pt-0.5 flex-shrink-0">
                        {formatTime(row.created_at)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Row count */}
        {rows.length > 0 && (
          <p className="text-center text-xs text-gray-400 mt-8">
            {rows.length} {rows.length === 1 ? "message" : "messages"}
          </p>
        )}
      </main>
    </div>
  );
}
