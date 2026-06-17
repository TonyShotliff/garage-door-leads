# Insta Intake — Project Context for Claude Code

## What this is
B2B SaaS: missed-call-to-SMS lead retention tool for home service operators.
Pitch: "Don't lose leads to voicemail — auto-text the customer the moment you
miss their call, before they call a competitor."
Launch vertical: garage door operators (~20,000 US businesses, mostly small
owner-operators). Planned expansion: HVAC, roofing (additional routes, not
yet built).

## Stack
- Framework: Next.js 14
- Database/Auth: Supabase (project ID: pjcipjlajumcqcsymcyh)
- SMS: Twilio (number: +18442524470)
- Payments: Stripe — LIVE mode (price ID: price_1TTT8KJDihhuWfiFrODF9dkc)
- Email: Resend (domain: instaintake.com, verified, sends from tony@instaintake.com)
- Hosting: Vercel
- DNS: GoDaddy → instaintake.com

## Completed features

### Pages
- `/` — B2B marketing homepage, "Stop Losing Jobs to Voicemail"
- `/garagedoors` — vertical landing page
- `/pricing` — Stripe checkout, 30-day free trial then $49/mo
- `/success` — post-checkout, "Complete Your Setup" CTA
- `/onboarding` — collects business name, phone, email; pre-fills email from
  Stripe session; writes to Supabase operators table; sends welcome email
- `/account/login` — magic link auth via Supabase Auth
- `/account` — protected operator portal:
  - Setup progress stepper (Account Created → SMS Activation → You're Live)
  - Business profile edit form
  - SMS preview bubble (shows exact auto-reply message)
  - Call forwarding instructions (iPhone / Android / Landline accordion)
  - Subscription management via Stripe Customer Portal
  - Recent activity log (from message_log table)
- `/dashboard` — public activity log (will be deprecated once /account is adopted)
- `/privacy` and `/terms` — live
- `/demo` — legacy intake form, still functional

### API routes
- `/api/stripe/webhook` — handles checkout.session.completed, creates operator
  row in Supabase
- `/api/create-checkout-session` — Stripe checkout with 30-day trial
- `/api/create-portal-session` — Stripe Customer Portal session
- `/api/onboarding` — upserts operator record, sends welcome email via Resend
- `/api/account/update-profile` — updates business_name and business_phone
- `/api/twilio/voice` — **BUILT, NOT ACTIVE:** rejects incoming calls, sends
  auto-SMS to caller, logs to message_log
- `/api/twilio/sms` — **BUILT, NOT ACTIVE:** handles inbound SMS replies,
  forwards to operator phone (+19205400557), logs to message_log
- `/api/send-lead-sms` — legacy, sends lead notification to Tony's cell
- `/api/send-lead-email` — legacy
- `/auth/callback` — Supabase auth callback handler

## Database (Supabase: pjcipjlajumcqcsymcyh)
- `operators` — id, created_at, stripe_customer_id, stripe_subscription_id,
  business_name, business_phone, email, status
- `message_log` — id, created_at, operator_id (nullable), caller_phone,
  direction ('inbound'/'outbound'), message_body
- `leads` — legacy, from old intake form

## External services (all configured and working)
- **Stripe:** live mode, webhook registered at
  https://www.instaintake.com/api/stripe/webhook
- **Supabase Auth:** magic link enabled, redirect URL
  https://www.instaintake.com/auth/callback configured
- **Resend:** instaintake.com domain verified, from tony@instaintake.com
- **Twilio:** +18442524470, Messaging Service SID MG2da3adb97efc0172ded10944d00d328d,
  A2P campaign In Review (3rd submission June 16 2026)

## Current blocker
**Twilio A2P campaign approval** — voice and SMS webhooks are built and deployed
but not pointed at live endpoints yet. Everything else is functional.

## Activation checklist (run when A2P approves)
1. Twilio Console → Phone Numbers → +18442524470 → Voice URL →
   `https://www.instaintake.com/api/twilio/voice` (HTTP POST)
2. Twilio Console → Messaging Services → Insta Intake Missed Call SMS →
   Integration → Inbound URL → `https://www.instaintake.com/api/twilio/sms`
   (HTTP POST)
3. Test: call +18442524470, let ring, confirm SMS arrives and message_log row
   created
4. Test reply: text back, confirm forwarded to +19205400557 and logged inbound
5. Flip operator status to `'live'` in Supabase → confirm /account shows all
   3 stepper steps green
6. Onboard friend's gutter business as beta tester

## Environment variables (all in Vercel)
- `STRIPE_SECRET_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY`

## Next priorities
1. When A2P clears: run activation checklist above
2. Custom SMS message per operator (stored in operators table, pulled in voice
   webhook — currently hardcoded)
3. Admin view at /admin for managing operators without going into Supabase
4. Notification email to tony@instaintake.com when new operator signs up
5. Operator auth email branding (Supabase sends from "Supabase Auth" — needs
   custom SMTP, requires paid Supabase plan)
6. Wisconsin LLC formation → update Stripe + re-run Twilio A2P brand under
   new EIN

## Working style notes for Claude
- Tony is a CNC machinist, not a developer — explain what changed and why in
  plain language after every build
- Prefer small, deployable changes over large rewrites
- Never print or commit real API keys, tokens, or secrets
- Always commit and push to master when done; handle merge conflicts directly
- Flag and confirm before running anything that touches Stripe LIVE mode or
  sends a real SMS through Twilio
- Claude Code runs in VS Code terminal (type `claude` to launch)
