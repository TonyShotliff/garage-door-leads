import twilio from "twilio";
import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

// Hardcoded for MVP — will be replaced with per-operator DB lookup
const OPERATOR_NAME = "Tony's Doors";
const OPERATOR_PHONE = "+19205400557"; // Tony's personal cell
const MESSAGING_SERVICE_SID = "MG2da3adb97efc0172ded10944d00d328d";

// Empty TwiML — we do NOT auto-reply to the customer's reply (that would create a loop)
const EMPTY_TWIML = `<?xml version="1.0" encoding="UTF-8"?><Response></Response>`;

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const from = formData.get("From") as string | null;
  const body = formData.get("Body") as string | null;

  // Ignore messages from the operator's own number — they would self-forward
  if (from === OPERATOR_PHONE) {
    return new NextResponse(EMPTY_TWIML, {
      status: 200,
      headers: { "Content-Type": "text/xml" },
    });
  }

  if (from && body) {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Log the inbound message
    const { error: logError } = await supabase.from("message_log").insert({
      caller_phone: from,
      direction: "inbound",
      message_body: body,
    });
    if (logError) {
      console.error(`[${OPERATOR_NAME}] message_log insert error (inbound):`, logError.message);
    }

    // Forward the customer's reply to the operator
    try {
      const client = twilio(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN
      );
      await client.messages.create({
        body: `New reply from ${from}: ${body}`,
        messagingServiceSid: MESSAGING_SERVICE_SID,
        to: OPERATOR_PHONE,
      });
      console.log(`[${OPERATOR_NAME}] Forwarded reply from ${from} to operator`);
    } catch (err) {
      console.error(
        `[${OPERATOR_NAME}] Forward SMS failed:`,
        err instanceof Error ? err.message : err
      );
    }
  }

  return new NextResponse(EMPTY_TWIML, {
    status: 200,
    headers: { "Content-Type": "text/xml" },
  });
}
