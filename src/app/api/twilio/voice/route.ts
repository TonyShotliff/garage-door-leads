import twilio from "twilio";
import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

// A2P 10DLC messaging service — routes SMS through the registered campaign
const MESSAGING_SERVICE_SID = "MG2da3adb97efc0172ded10944d00d328d";

// TwiML that declines the call immediately with a busy signal
const REJECT_TWIML = `<?xml version="1.0" encoding="UTF-8"?><Response><Reject reason="busy"/></Response>`;

function buildDefaultMessage(businessName: string) {
  return `Hi, this is ${businessName}. Sorry we missed your call — how can we help? Reply here and we'll get right back to you. Reply STOP to opt out.`;
}

const GENERIC_FALLBACK =
  "Hi, sorry we missed your call. We'll get right back to you. Reply STOP to opt out.";

export async function POST(req: NextRequest) {
  // Twilio sends voice webhooks as application/x-www-form-urlencoded
  const formData = await req.formData();
  const callerNumber = formData.get("From") as string | null;
  // "To" is the Twilio number that received the call — used to identify which operator
  const toNumber = formData.get("To") as string | null;

  if (callerNumber) {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Look up the operator whose business_phone matches the Twilio number that received the call
    let replyMessage = GENERIC_FALLBACK;
    let operatorId: string | null = null;
    let operatorLabel = "unknown";

    if (toNumber) {
      const { data: operator } = await supabase
        .from("operators")
        .select("id, business_name, custom_sms_message")
        .eq("business_phone", toNumber)
        .maybeSingle();

      if (operator) {
        operatorId = operator.id;
        operatorLabel = operator.business_name ?? "operator";
        replyMessage = operator.custom_sms_message?.trim()
          ? operator.custom_sms_message.trim()
          : buildDefaultMessage(operator.business_name ?? "Us");
      }
    }

    // Send auto-reply SMS
    try {
      const client = twilio(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN
      );
      await client.messages.create({
        body: replyMessage,
        messagingServiceSid: MESSAGING_SERVICE_SID,
        to: callerNumber,
      });
      console.log(`[${operatorLabel}] Missed-call SMS sent to ${callerNumber}`);
    } catch (err) {
      // Log the error but don't crash — TwiML response must always be returned
      console.error(
        `[${operatorLabel}] Missed-call SMS failed:`,
        err instanceof Error ? err.message : err
      );
    }

    // Log the outbound auto-reply to message_log
    const { error: logError } = await supabase.from("message_log").insert({
      caller_phone: callerNumber,
      direction: "outbound",
      message_body: replyMessage,
      ...(operatorId ? { operator_id: operatorId } : {}),
    });
    if (logError) {
      console.error(`[${operatorLabel}] message_log insert error (outbound):`, logError.message);
    }
  }

  return new NextResponse(REJECT_TWIML, {
    status: 200,
    headers: { "Content-Type": "text/xml" },
  });
}
