import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const { full_name, phone, email, zip_code, service_type, urgency, message } =
    await req.json();

  const { error } = await resend.emails.send({
    from: "onboarding@resend.dev",
    to: "tony.shotliff@gmail.com",
    subject: `New Lead: ${full_name} — ${service_type}`,
    html: `
      <h2>New Garage Door Service Request</h2>
      <table cellpadding="8" cellspacing="0" style="border-collapse:collapse;width:100%;max-width:500px;">
        <tr><td style="font-weight:600;color:#374151;width:140px;">Name</td><td>${full_name}</td></tr>
        <tr style="background:#f9fafb;"><td style="font-weight:600;color:#374151;">Phone</td><td>${phone}</td></tr>
        <tr><td style="font-weight:600;color:#374151;">Email</td><td>${email}</td></tr>
        <tr style="background:#f9fafb;"><td style="font-weight:600;color:#374151;">Zip Code</td><td>${zip_code}</td></tr>
        <tr><td style="font-weight:600;color:#374151;">Service Type</td><td>${service_type}</td></tr>
        <tr style="background:#f9fafb;"><td style="font-weight:600;color:#374151;">Urgency</td><td>${urgency}</td></tr>
        <tr><td style="font-weight:600;color:#374151;vertical-align:top;">Message</td><td>${message || "<em>None provided</em>"}</td></tr>
      </table>
    `,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
