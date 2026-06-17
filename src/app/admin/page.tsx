import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase-server";
import AdminContent from "./AdminContent";

export const dynamic = "force-dynamic";

const ADMIN_EMAIL = "tony@instaintake.com";

export default async function AdminPage() {
  const supabase = createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/account/login");
  }

  if (user.email !== ADMIN_EMAIL) {
    redirect("/account");
  }

  return <AdminContent />;
}
