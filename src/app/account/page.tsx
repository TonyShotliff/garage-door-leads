import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { createServerSupabase } from "@/lib/supabase-server";
import AccountContent from "./AccountContent";

export const dynamic = "force-dynamic";

type MessageRow = {
  id: string;
  created_at: string;
  caller_phone: string;
  direction: "inbound" | "outbound";
  message_body: string;
};

export default async function AccountPage() {
  const supabase = createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/account/login");
  }

  // Use service role for data reads — operators table is not publicly readable
  const service = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: operator } = await service
    .from("operators")
    .select("business_name, business_phone, status, stripe_customer_id")
    .eq("email", user.email!)
    .maybeSingle();

  // operator_id is not yet set in message_log (MVP — one operator hardcoded in webhooks).
  // Fetch all rows for now; filter by operator_id once multi-tenant support is added.
  const { data: messages } = await service
    .from("message_log")
    .select("id, created_at, caller_phone, direction, message_body")
    .order("created_at", { ascending: false });

  return (
    <AccountContent
      userEmail={user.email!}
      operator={operator ?? null}
      messages={(messages as MessageRow[]) ?? []}
    />
  );
}
