import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white flex flex-col">

      {/* Nav */}
      <nav className="border-b border-gray-100 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <span className="text-xl font-bold text-blue-600 tracking-tight">Insta Intake</span>
          <Link
            href="/pricing"
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2 rounded-lg transition"
          >
            Get Started Free
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white px-6 py-20 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-block bg-blue-500 bg-opacity-50 text-blue-100 text-sm font-medium px-4 py-1.5 rounded-full mb-6 tracking-wide uppercase">
            Missed Call → Instant SMS
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-6">
            Stop Losing Jobs to Voicemail
          </h1>
          <p className="text-blue-100 text-lg sm:text-xl leading-relaxed mb-10 max-w-2xl mx-auto">
            The moment you miss a call, Insta Intake automatically texts the customer back — so they don&apos;t hang up and call your competitor.
          </p>
          <Link
            href="/pricing"
            className="inline-block bg-white text-blue-700 hover:bg-blue-50 font-bold px-8 py-4 rounded-xl text-base transition shadow-md"
          >
            Start Free — No Setup Required
          </Link>
        </div>
      </section>

      {/* Problem */}
      <section className="px-6 py-20 bg-white">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Every missed call is a job you might never get back.
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            You&apos;re under a garage door, on a ladder, or driving between jobs. The phone rings. It goes to voicemail. Most people don&apos;t leave one — they just call the next name on the list.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 py-20 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-14">How it works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
            {[
              {
                step: "1",
                title: "You miss a call",
                desc: "Nothing changes about how you run your business.",
              },
              {
                step: "2",
                title: "We text them instantly",
                desc: "A friendly auto-reply lets them know you'll follow up, or invites them to text details right away.",
              },
              {
                step: "3",
                title: "You follow up when you're free",
                desc: "With the lead already warmed up and waiting, instead of gone.",
              },
            ].map(({ step, title, desc }) => (
              <div key={step} className="flex flex-col items-start">
                <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg mb-4">
                  {step}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why it matters */}
      <section className="px-6 py-20 bg-white">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">Built to stay out of your way</h2>
          <div className="space-y-4">
            {[
              "No app to learn, no new phone number to give out",
              "Works in the background with the number you already use",
              "Set up in minutes, not days",
            ].map((item) => (
              <div key={item} className="flex items-start gap-4 bg-gray-50 rounded-xl px-6 py-4">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                  <svg className="w-3.5 h-3.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      <section className="px-6 py-20 bg-blue-600 text-white text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Try it free for 30 days.</h2>
          <p className="text-blue-100 text-lg leading-relaxed mb-10">
            No credit card pressure, no long-term contract. If it doesn&apos;t help you keep more jobs, cancel anytime.
          </p>
          <Link
            href="/pricing"
            className="inline-block bg-white text-blue-700 hover:bg-blue-50 font-bold px-8 py-4 rounded-xl text-base transition shadow-md"
          >
            Get Started Free
          </Link>
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
                a: "Insta Intake works for any service business that takes calls in the field.",
              },
            ].map(({ q, a }) => (
              <div key={q} className="border-b border-gray-100 pb-8">
                <h3 className="font-bold text-gray-900 mb-2">{q}</h3>
                <p className="text-gray-500 leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 px-6 py-8">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-400">
          <span className="font-semibold text-gray-500">Insta Intake</span>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-gray-600 transition">Privacy</Link>
            <Link href="/terms" className="hover:text-gray-600 transition">Terms</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
