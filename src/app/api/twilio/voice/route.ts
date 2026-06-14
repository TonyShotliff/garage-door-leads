import twilio from "twilio";
import { NextRequest, NextResponse } from "next/server";

// Hardcoded for MVP — will be replaced with per-operator DB lookup
const OPERATOR_NAME = "Tony's Doors";
const REPLY_MESSAGE =
  "Hi, this is Tony's Doors. Sorry we missed your call — how can we help? Reply here and we'll get right back to you. Reply STOP to opt out.";

const FROM_NUMBER = "+18442524470";
// A2P 10DLC messaging service — routes SMS through the registered campaign
const MESSAGING_SERVICE_SID = "MG2da3adb97efc0172ded10944d00d328d";

// TwiML that declines the call immediately.
// Twilio's webhook fires on every incoming call — we can't "let it ring" without
// forwarding it somewhere. <Reject reason="busy"> gives the caller a busy signal
// and never answers, which is the right MVP behavior since we're not yet
// forwarding to the operator's real number.
const REJECT_TWIML = `<?xml version="1.0" encoding="UTF-8"?><Response><Reject reason="busy"/></Response>`;

export async function POST(req: NextRequest) {
  // Twilio sends voice webhooks as application/x-www-form-urlencoded
  const formData = await req.formData();
  const callerNumber = formData.get("From") as string | null;

  if (callerNumber) {
    try {
      const client = twilio(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN
      );
      await client.messages.create({
        body: REPLY_MESSAGE,
        messagingServiceSid: MESSAGING_SERVICE_SID,
        to: callerNumber,
      });
      console.log(`[${OPERATOR_NAME}] Missed-call SMS sent to ${callerNumber}`);
    } catch (err) {
      // Log the error but don't let it crash — TwiML response must always be returned
      console.error(
        `[${OPERATOR_NAME}] Missed-call SMS failed:`,
        err instanceof Error ? err.message : err
      );
    }
  }

  return new NextResponse(REJECT_TWIML, {
    status: 200,
    headers: { "Content-Type": "text/xml" },
  });
}
