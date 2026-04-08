import twilio from "twilio";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { full_name, phone, service_type, urgency } = await req.json();

  const client = twilio(
    process.env.NEXT_PUBLIC_TWILIO_ACCOUNT_SID,
    process.env.NEXT_PUBLIC_TWILIO_AUTH_TOKEN
  );

  const body = `New Lead: ${full_name} - ${service_type} - ${urgency} - Call: ${phone}`;

  const { status } = await client.messages.create({
    body,
    from: "+18442524470",
    to: "+19205400557"
  });

  if (!status) {
    return NextResponse.json({ error: "Failed to send SMS" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
