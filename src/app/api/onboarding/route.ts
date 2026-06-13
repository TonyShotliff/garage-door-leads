import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  const { businessName, businessPhone, email } = await req.json();

  if (!businessName || !businessPhone || !email) {
    return NextResponse.json(
      { error: "Business name, phone number, and email are required." },
      { status: 400 }
    );
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { error } = await supabase.from("operators").upsert(
    {
      email,
      business_name: businessName,
      business_phone: businessPhone,
      status: "active",
    },
    { onConflict: "email" }
  );

  if (error) {
    console.error("Operator onboarding upsert error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
