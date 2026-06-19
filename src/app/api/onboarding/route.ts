import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

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

  // Send welcome email — failure here does not block the onboarding response
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: "tony@instaintake.com",
      to: email,
      subject: "Welcome to Insta Intake — you're all set",
      html: `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;">

          <!-- Logo -->
          <tr>
            <td style="padding-bottom:24px;">
              <span style="font-size:20px;font-weight:700;color:#2563eb;letter-spacing:-0.5px;">Insta Intake</span>
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td style="background:#ffffff;border-radius:16px;padding:40px;box-shadow:0 1px 4px rgba(0,0,0,0.06);">

              <p style="margin:0 0 8px;font-size:24px;font-weight:700;color:#111827;">You're all set, ${businessName}.</p>
              <p style="margin:0 0 28px;font-size:15px;color:#6b7280;line-height:1.6;">
                Your Insta Intake account is active and your 30-day free trial has started. No charge until day 31.
              </p>

              <p style="margin:0 0 12px;font-size:15px;color:#111827;font-weight:600;">What happens next:</p>
              <table cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                <tr>
                  <td style="vertical-align:top;padding:4px 12px 4px 0;color:#2563eb;font-size:15px;font-weight:700;">1.</td>
                  <td style="padding:4px 0;font-size:15px;color:#374151;line-height:1.5;">
                    We're activating your missed-call SMS line. We'll email you as soon as it's live — usually within a few days.
                  </td>
                </tr>
                <tr>
                  <td style="vertical-align:top;padding:4px 12px 4px 0;color:#2563eb;font-size:15px;font-weight:700;">2.</td>
                  <td style="padding:4px 0;font-size:15px;color:#374151;line-height:1.5;">
                    Once active, every call you miss will trigger an instant auto-text to the customer.
                  </td>
                </tr>
                <tr>
                  <td style="vertical-align:top;padding:4px 12px 4px 0;color:#2563eb;font-size:15px;font-weight:700;">3.</td>
                  <td style="padding:4px 0;font-size:15px;color:#374151;line-height:1.5;">
                    You'll be able to see all activity — missed calls and customer replies — in your dashboard.
                  </td>
                </tr>
              </table>

              <p style="margin:0;font-size:15px;color:#374151;line-height:1.6;">
                Questions in the meantime? Just reply to this email — I'm here.
              </p>

              <p style="margin:24px 0 0;font-size:15px;color:#374151;">
                — Tony<br>
                <span style="color:#6b7280;font-size:13px;">Insta Intake</span>
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding-top:24px;">
              <p style="margin:0;font-size:12px;color:#9ca3af;line-height:1.6;text-align:center;">
                Insta Intake · instaintake.com<br>
                You're receiving this because you signed up for Insta Intake.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `,
    });
  } catch (emailErr) {
    console.error(
      "Welcome email failed:",
      emailErr instanceof Error ? emailErr.message : emailErr
    );
  }

  // Send signup notification to Tony
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: "tony@instaintake.com",
      to: "tony@instaintake.com",
      subject: `New signup: ${businessName}`,
      html: `
        <p style="font-family:sans-serif;font-size:15px;color:#111827;">
          <strong>New operator signed up.</strong>
        </p>
        <table style="font-family:sans-serif;font-size:14px;color:#374151;border-collapse:collapse;">
          <tr><td style="padding:4px 16px 4px 0;font-weight:600;">Business:</td><td>${businessName}</td></tr>
          <tr><td style="padding:4px 16px 4px 0;font-weight:600;">Phone:</td><td>${businessPhone}</td></tr>
          <tr><td style="padding:4px 16px 4px 0;font-weight:600;">Email:</td><td>${email}</td></tr>
        </table>
        <p style="font-family:sans-serif;font-size:13px;color:#6b7280;margin-top:24px;">
          View in <a href="https://www.instaintake.com/admin">admin panel</a>.
        </p>
      `,
    });
  } catch (notifyErr) {
    console.error(
      "Signup notification failed:",
      notifyErr instanceof Error ? notifyErr.message : notifyErr
    );
  }

  return NextResponse.json({ success: true });
}
