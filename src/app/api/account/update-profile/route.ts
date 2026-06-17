import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  const cookieStore = cookies();

  // Verify the caller is authenticated
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

  const { businessName, businessPhone, customSmsMessage } = await req.json();

  // Build update payload from whatever fields were sent — all are optional
  const payload: Record<string, string | null> = {};
  if (businessName !== undefined) payload.business_name = businessName;
  if (businessPhone !== undefined) payload.business_phone = businessPhone;
  // Empty string → null so we fall back to the default message in the webhook
  if (customSmsMessage !== undefined) payload.custom_sms_message = customSmsMessage || null;

  if (Object.keys(payload).length === 0) {
    return NextResponse.json({ error: "Nothing to update." }, { status: 400 });
  }

  // Use service role to write — operators table is not publicly writable
  const service = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { error } = await service
    .from("operators")
    .update(payload)
    .eq("email", user.email!);

  if (error) {
    console.error("update-profile error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
