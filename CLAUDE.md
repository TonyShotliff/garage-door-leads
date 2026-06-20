# Insta Intake — Project Context for Claude Code

## What this is
B2B SaaS: missed-call-to-SMS lead retention tool for home service operators.
Pitch: "The moment you miss a call, we auto-text the customer back before
they call your competitor."
Launch vertical: garage door operators (~20,000 US businesses, mostly small
owner-operators). Positioned site-wide as multi-vertical (garage door, HVAC,
roofing, and other home service trades) since expansion beyond garage door
is planned. Price: $49/month after a 30-day free trial. Goal: first paying
customer by fall 2026.

## Local environment
- Local path: `C:\Projects\Insta Intake SaaS` (moved out of OneDrive on
  June 20, 2026 — OneDrive was triggering mass-delete sync popups on every
  `npm run build` because Next.js regenerates the `.next` folder each time).
  Always launch with `code "C:\Projects\Insta Intake SaaS"`. Do not reference
  the old OneDrive path; it may still exist as a stale, unused copy but is
  not the working project.
- GitHub repo: TonyShotliff/garage-door-leads (repo name unchanged, local
  folder name changed — these don't need to match)
- Claude Code runs in VS Code terminal (type `claude` to launch)

## Stack
- Framework: Next.js 14
- Database/Auth: Supabase (project ID: pjcipjlajumcqcsymcyh)
- SMS/Voice: Twilio (number: +18442524470, Messaging Service SID
  MG2da3adb97efc0172ded10944d00d328d)
- Payments: Stripe — LIVE mode (price ID: price_1TTT8KJDihhuWfiFrODF9dkc)
- Email: Resend (domain: instaintake.com, verified, sends from
  tony@instaintake.com; admin notifications also land in Zoho mailbox at
  tony@instaintake.com)
- Hosting: Vercel
- DNS: GoDaddy → instaintake.com

## Design system
Site-wide visual identity established June 20, 2026 across all public and
operator-facing pages. Palette:
- `#F4F1E8` warm cream — page backgrounds
- `#1A2E22` deep pine — dark sections, headlines, nav text
- `#D85A30` burnt orange/coral — primary CTA buttons, accents (hover:
  `#c14d26`)
- `#1D9E75` / emerald-700 — success states, checkmarks
- `#993C1D` / `#4A1B0C` — text-on-coral-background (accessibility: always
  use 800/900 stops on coral fills, never white)
Typography: Georgia serif for headlines, system sans-serif for body.
Applied to: `/`, `/pricing`, `/onboarding`, `/account`, `/account/login`.
Not yet applied to: `/admin`, `/demo`, `/success`, `/dashboard` (lower
priority — not part of the public sales funnel).

## Completed features

### Pages
- `/` — B2B marketing homepage. Rebuilt June 20, 2026: hover-to-replay
  missed-call → SMS demo (MissedCallDemo.tsx, respects
  prefers-reduced-motion, defaults to fully-resolved state at rest), sourced
  stats band (80% voicemail abandonment / PATLive, 62% call a competitor
  next / PATLive via Dialzara, $250 average garage door spring repair /
  Angi+HomeAdvisor+Forbes Home), multi-vertical positioning copy.
- `/garagedoors` — **retired June 20, 2026.** Permanently redirects to `/`
  via `next.config.mjs` redirects(). Old page file deleted. This was a
  near-duplicate of the pre-rebuild homepage, not a true separate consumer
  landing page — if a real consumer-facing lead-gen page is ever needed,
  it would need to be built fresh, not revived from this old file.
- `/pricing` — Stripe checkout, 30-day free trial then $49/mo. Restyled
  June 20 to match new palette; added trust signal cards (Stripe security,
  30-day guarantee, "operated by a real person" signal).
- `/contact` — **new, added June 19, 2026** for Twilio A2P compliance.
  Shows business name, "Operated by Anthony M. Shotliff", address (500
  Mack Rd, Ashland, WI 54806), email, SMS opt-out instructions.
- `/success` — post-checkout, links to /onboarding. Not yet restyled.
- `/onboarding` — collects business name, phone, email; pre-fills email
  from Stripe session; writes to Supabase operators table; sends welcome
  email; **sends signup notification to tony@instaintake.com (added June
  19, 2026)**. Restyled June 20. Has explicit SMS consent notice below the
  phone field (required for A2P compliance).
- `/account/login` — magic link auth via Supabase Auth. Restyled June 20.
- `/account` — protected operator portal. Restyled June 20. Contains:
  - Setup progress stepper (Account Created → SMS Activation → You're Live)
  - Business profile edit form
  - Custom SMS message editor (160-char counter, saves to
    operators.custom_sms_message)
  - SMS preview bubble (live-updates as operator types)
  - Call forwarding instructions (iPhone / Android / Landline accordion)
  - Subscription management via Stripe Customer Portal
  - Recent activity log (from message_log table)
- `/admin` — restricted to tony@instaintake.com. Shows all operators,
  status dropdowns, stats cards. Not yet restyled to new palette.
- `/dashboard` — legacy public activity log, superseded by /account.
  Not restyled.
- `/privacy` — expanded June 19, 2026 with explicit "SMS Messaging and
  Consent" section (implied consent model spelled out), address added to
  contact section. Required for A2P approval.
- `/terms` — expanded June 19, 2026 to match /privacy: "SMS Compliance and
  Consent" section added, address added to contact section.
- `/demo` — legacy intake form, still functional, not part of current
  product flow.

### Shared components
- `src/components/Footer.tsx` — site-wide footer. Shows "Insta Intake",
  "Operated by Anthony M. Shotliff", address, links to Privacy/Terms/
  Contact/email. Required for A2P compliance — do not remove the operator
  name or address without checking A2P campaign status first.
- `src/components/MissedCallDemo.tsx` — client component, animated phone
  mockup used in homepage hero. Defaults to fully-resolved end state;
  hover or focus replays the sequence (missed call → SMS sent → customer
  reply) then returns to resolved state on mouse leave/blur. Respects
  `prefers-reduced-motion`.

### API routes
- `/api/stripe/webhook` — handles checkout.session.completed, creates
  operator row in Supabase
- `/api/create-checkout-session` — Stripe checkout with 30-day trial
- `/api/create-portal-session` — Stripe Customer Portal session
- `/api/onboarding` — upserts operator record, sends welcome email via
  Resend, **sends signup notification email to tony@instaintake.com**
  (added June 19, 2026 — fails silently, never blocks onboarding)
- `/api/account/update-profile` — updates business_name, business_phone,
  custom_sms_message
- `/api/admin/operators` — GET/PATCH for admin panel, checks
  tony@instaintake.com
- `/api/twilio/voice` — **BUILT, NOT ACTIVE:** rejects incoming calls,
  sends auto-SMS to caller using operator's custom message (looked up by
  business_phone), logs to message_log
- `/api/twilio/sms` — **BUILT, NOT ACTIVE:** handles inbound SMS replies,
  forwards to operator phone, logs to message_log
- `/api/send-lead-sms` — legacy
- `/api/send-lead-email` — legacy
- `/auth/callback` — Supabase auth callback handler

## Database (Supabase: pjcipjlajumcqcsymcyh)
- `operators` — id, created_at, stripe_customer_id, stripe_subscription_id,
  business_name, business_phone, email, status ('active'/'live'/
  'cancelled'), custom_sms_message (nullable)
- `message_log` — id, created_at, operator_id (nullable — not yet wired up,
  MVP has one operator hardcoded in webhooks), caller_phone, direction
  ('inbound'/'outbound'), message_body
- `leads` — legacy, from old intake form, ignore

## External services (all configured)
- **Stripe:** live mode, webhook registered at
  https://www.instaintake.com/api/stripe/webhook, Customer Portal enabled
- **Supabase Auth:** magic link enabled, redirect URL
  https://www.instaintake.com/auth/callback
- **Resend:** instaintake.com domain verified, sends from
  tony@instaintake.com
- **Twilio:** +18442524470 (toll-free), A2P brand approved
  (BN572571703608c41407257431e036671d). Campaign
  CMfe39b532de31608e94913697e1e4572e — **5th submission, June 19, 2026,
  status PENDING_REVIEW.** Support ticket #26733608 open with Nicole.
- **Zoho Mail:** tony@instaintake.com mailbox active

## Twilio A2P history — important context for future rejections
Campaign has been rejected 4 times:
1–2. Error 30909 (CTA/consent not verifiable) — fixed by adding explicit
   consent language to /privacy and /terms, plus a consent notice in the
   onboarding form.
3. Errors 30909 + 30919 (insufficient business information on website) —
   fixed by creating /contact page with business name, address, and
   contact info, and adding the address to the footer site-wide.
4. Errors 30907 (website URL doesn't match brand/campaign — brand was
   registered as "Anthony M Shotliff" but the site only said "Insta
   Intake") + 30896 (opt-in information unclear) — fixed by adding
   "Operated by Anthony M. Shotliff" to the contact page and footer, and
   rewriting the campaign description and opt-in message fields in the
   Twilio console to explicitly state the implied-consent model and
   reference the operator's legal name.
5th submission made June 19, 2026 with all of the above in place. If
rejected again, check the specific error code against this history first
— a new error code likely means a new issue, but a repeat of an old code
may mean a field reverted or a step was missed on resubmission.
Do not burn additional resubmissions without reading the specific
rejection reason first.

## Activation checklist (run when A2P approves)
1. Twilio Console → Phone Numbers → +18442524470 → Voice URL →
   `https://www.instaintake.com/api/twilio/voice` (HTTP POST)
2. Twilio Console → Messaging Services → Insta Intake Missed Call SMS →
   Integration → Inbound URL →
   `https://www.instaintake.com/api/twilio/sms` (HTTP POST)
3. Test: call +18442524470, let ring, confirm SMS arrives and message_log
   row created
4. Test reply: text back, confirm forwarded to operator phone and logged
   inbound
5. Flip operator status to `'live'` in Supabase → confirm /account shows
   all 3 stepper steps green
6. Onboard friend's gutter business as beta tester (manual operators row
   insert, no Stripe needed)

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
1. When A2P clears: run activation checklist above, full end-to-end live
   test
2. Restyle /admin, /demo, /success, /dashboard to match new design system
   (lower priority — not public sales funnel)
3. Operator auth email branding — Supabase sends from "Supabase Auth",
   needs custom SMTP (requires paid Supabase plan, ~$25/mo). Low priority
   until real customers exist.
4. Wisconsin LLC formation → update Stripe business profile, re-run
   Twilio A2P brand registration under new EIN — schedule for
   low-customer-impact window
5. Operator outreach — no outreach has started yet. Product is
   feature-complete pending Twilio; outreach strategy is now the
   higher-leverage open question.

## Working style notes for Claude
- Tony is a CNC machinist in Northern Wisconsin, not a developer — explain
  what changed and why in plain language after every build
- Prefer small, deployable changes over large rewrites
- Never print or commit real API keys, tokens, or secrets
- Always commit and push to master when done; handle merge conflicts
  directly
- Flag and confirm before running anything that touches Stripe LIVE mode
  or sends a real SMS through Twilio
- Claude Code runs in VS Code terminal (type `claude` to launch)
- Click-by-click instructions for any Twilio/Stripe/Supabase dashboard
  tasks
