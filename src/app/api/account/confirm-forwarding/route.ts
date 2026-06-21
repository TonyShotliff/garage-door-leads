import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { Resend } from "resend";

export async function POST() {
  const cookieStore = cookies();

  const authClient = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await authClient.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const service = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: operator, error: fetchError } = await service
    .from("operators")
    .select("business_name, status")
    .eq("email", user.email!)
    .maybeSingle();

  if (fetchError) {
    console.error("confirm-forwarding lookup error:", fetchError.message);
    return NextResponse.json({ error: fetchError.message }, { status: 500 });
  }

  if (operator?.status === "live") {
    return NextResponse.json({ success: true, alreadyLive: true });
  }

  const { error: updateError } = await service
    .from("operators")
    .update({ status: "live" })
    .eq("email", user.email!);

  if (updateError) {
    console.error("confirm-forwarding update error:", updateError.message);
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  // Notify Tony — self-service status changes should still surface somewhere
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: "tony@instaintake.com",
      to: "tony@instaintake.com",
      subject: `Operator confirmed call forwarding: ${operator?.business_name ?? user.email}`,
      html: `
        <p style="font-family:sans-serif;font-size:15px;color:#111827;">
          <strong>${operator?.business_name ?? user.email}</strong> just confirmed they
          set up call forwarding and is now marked <strong>live</strong>.
        </p>
        <p style="font-family:sans-serif;font-size:13px;color:#6b7280;margin-top:16px;">
          View in <a href="https://www.instaintake.com/admin">admin panel</a>.
        </p>
      `,
    });
  } catch (notifyErr) {
    console.error(
      "Live-status notification failed:",
      notifyErr instanceof Error ? notifyErr.message : notifyErr
    );
  }

  return NextResponse.json({ success: true, alreadyLive: false });
}
