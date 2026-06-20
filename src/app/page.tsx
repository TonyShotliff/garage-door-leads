import Link from "next/link";
import NavBar from "@/components/NavBar";
import MissedCallDemo from "@/components/MissedCallDemo";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F4F1E8] flex flex-col">

      <NavBar
        cta={
          <Link
            href="/pricing"
            className="bg-[#D85A30] hover:bg-[#c14d26] text-white text-sm font-semibold px-5 py-2 rounded-lg transition"
          >
            Try Free for 30 Days
          </Link>
        }
      />

      {/* Hero */}
      <section className="px-6 py-16 lg:py-20">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-sm font-semibold text-[#993C1D] uppercase tracking-wide mb-3">
              For home service businesses
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-5 text-gray-900">
              The call you miss tonight is the job someone else gets tomorrow.
            </h1>
            <p className="text-gray-600 text-lg leading-relaxed mb-8 max-w-md">
              Insta Intake texts the customer back the second you miss their call — while you&apos;re still on the job, not after you&apos;ve lost it. Built for garage door, HVAC, roofing, and other trades that live on the phone.
            </p>
            <div className="flex items-center gap-4 mb-3">
              <Link
                href="/pricing"
                className="inline-block bg-gray-900 hover:bg-gray-800 text-white font-semibold px-6 py-3.5 rounded-lg text-base transition"
              >
                Try Free for 30 Days
              </Link>
              <span className="text-sm text-gray-500">No charge until day 31</span>
            </div>
            <p className="text-xs text-gray-400">
              Works with the number you already have. Nothing to install.
            </p>
          </div>

          <MissedCallDemo />
        </div>
      </section>

      {/* Stats */}
      <section className="bg-gray-900 px-6 py-14">
        <div className="max-w-3xl mx-auto">
          <p className="text-center text-xs font-semibold text-gray-400 uppercase tracking-wide mb-7">
            What a missed call actually costs
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div>
              <p className="text-4xl font-bold text-white mb-1.5">80%</p>
              <p className="text-sm text-gray-400 leading-relaxed">
                of callers who reach voicemail hang up without leaving a message
              </p>
            </div>
            <div>
              <p className="text-4xl font-bold text-white mb-1.5">62%</p>
              <p className="text-sm text-gray-400 leading-relaxed">
                of those callers call a competitor next, the same day
              </p>
            </div>
            <div>
              <p className="text-4xl font-bold text-white mb-1.5">$250</p>
              <p className="text-sm text-gray-400 leading-relaxed">
                average value of a single garage door spring repair job
              </p>
            </div>
          </div>
          <p className="text-center text-xs text-gray-500 mt-7">
            Sources: PATLive caller behavior research; Angi, HomeAdvisor &amp; Forbes Home cost data
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 py-20 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-14">What changes when you sign up</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
            {[
              {
                step: "1",
                title: "You miss a call",
                desc: "Nothing about your day changes. Your phone still rings the same.",
              },
              {
                step: "2",
                title: "They get a text instantly",
                desc: "From your business name, letting them know you saw it and you'll follow up.",
              },
              {
                step: "3",
                title: "You follow up when you're free",
                desc: "The lead is warm and waiting instead of already gone.",
              },
            ].map(({ step, title, desc }) => (
              <div key={step} className="flex flex-col items-start">
                <div className="w-9 h-9 bg-[#D85A30] text-white rounded-full flex items-center justify-center font-semibold text-sm mb-4">
                  {step}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why it matters */}
      <section className="px-6 py-20 bg-[#F4F1E8]">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">Built to stay out of your way</h2>
          <div className="space-y-4">
            {[
              "No app to learn, no new phone number to give out",
              "Works in the background with the number you already use",
              "Set up in minutes, not days",
            ].map((item) => (
              <div key={item} className="flex items-start gap-4 bg-white rounded-xl px-6 py-4">
                <div className="flex-shrink-0 w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center mt-0.5">
                  <svg className="w-3.5 h-3.5 text-[#993C1D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-gray-700 font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA / Pricing */}
      <section className="px-6 py-20 bg-[#FAECE7] text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="text-3xl font-bold mb-3 text-[#4A1B0C]">$49/month. One plan, no tiers.</h2>
          <p className="text-[#712B13] text-lg leading-relaxed mb-8">
            Try it free for 30 days — card on file, nothing charged until day 31. Cancel before then and pay nothing.
          </p>
          <Link
            href="/pricing"
            className="inline-block bg-gray-900 hover:bg-gray-800 text-white font-semibold px-8 py-4 rounded-xl text-base transition"
          >
            Start My Free Trial
          </Link>
          <p className="text-[#993C1D] text-xs leading-relaxed mt-6 max-w-sm mx-auto opacity-80">
            By signing up for Insta Intake, you consent to receive SMS messages
            related to your account and missed-call notifications. Message and
            data rates may apply. Reply STOP to opt out at any time, or HELP
            for help.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 py-20 bg-white">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Common questions</h2>
          <div className="space-y-8">
            {[
              {
                q: "Does this replace my phone system?",
                a: "No — it works alongside the number you already use.",
              },
              {
                q: "Will customers know it's automatic?",
                a: "The message is friendly and clear, not robotic.",
              },
              {
                q: "What if I'm a different type of business?",
                a: "Insta Intake works for any home service trade that takes calls in the field — garage door, HVAC, roofing, and more.",
              },
            ].map(({ q, a }) => (
              <div key={q} className="border-b border-gray-100 pb-8">
                <h3 className="font-semibold text-gray-900 mb-2">{q}</h3>
                <p className="text-gray-500 leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
