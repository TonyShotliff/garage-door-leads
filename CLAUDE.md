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
- Payments: Stripe — LIVE mode (price ID: price_1TTT8KKJDihhuWfiFrODF9dk)
- Email: Resend
- Hosting: Vercel
- DNS: GoDaddy → instaintake.com
- Business EIN: 42-2330715

## Site architecture
- instaintake.com — B2B homepage (needs restructuring — currently the
  intake form, should become an operator-facing homepage)
- /garagedoors — operator landing page (exists, needs to reflect missed-call
  SMS focus rather than form capture)
- /privacy and /terms — done, live
- Future: /hvac, /roofing as additional vertical routes

## Known issues / active blockers
1. Env var security: several sensitive credentials are incorrectly prefixed
   with NEXT_PUBLIC_, exposing them to the browser bundle. Audit .env.local
   and next.config.mjs — anything server-side must NOT carry the
   NEXT_PUBLIC_ prefix.
2. Twilio A2P campaign registration submitted (Messaging Service SID
   MG2da3adb97efc0172ded10944d00d328d) — pending carrier approval.
3. Business email tony@instaintake.com not yet set up.
4. End-to-end test of missed-call-to-SMS flow not yet done in production.

## Working style notes for Claude
- Tony is not a developer — after each change, explain what changed and why
  in plain language.
- Prefer small, deployable changes over large rewrites.
- Never print or commit real API keys, tokens, or secrets.
- Flag and confirm before running anything that touches Stripe LIVE mode or
  sends a real SMS through Twilio.
- Always commit and push changes to master when done, handling any merge
  conflicts directly rather than leaving it to Tony.
