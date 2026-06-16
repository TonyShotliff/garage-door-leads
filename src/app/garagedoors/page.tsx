import Link from "next/link";
import NavBar from "@/components/NavBar";

export default function GarageDoorsLanding() {
  return (
    <div className="min-h-screen bg-white flex flex-col">

      <NavBar
        cta={
          <Link
            href="/pricing"
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2 rounded-lg transition"
          >
            Try Free for 30 Days
          </Link>
        }
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white px-6 py-20 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-block bg-blue-500 bg-opacity-50 text-blue-100 text-sm font-medium px-4 py-1.5 rounded-full mb-6 tracking-wide uppercase">
            Built for Garage Door Pros
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-6">
            Stop Losing Garage Door Jobs to Voicemail
          </h1>
          <p className="text-blue-100 text-lg sm:text-xl leading-relaxed mb-10 max-w-2xl mx-auto">
            The moment you miss a call, Insta Intake automatically texts the customer back — before they hang up and call the next garage door company on the list.
          </p>
          <Link
            href="/pricing"
            className="inline-block bg-white text-blue-700 hover:bg-blue-50 font-bold px-8 py-4 rounded-xl text-base transition shadow-md"
          >
            Try Free for 30 Days
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
            You&apos;re under a door, on a ladder, or driving between jobs. The phone rings and goes to voicemail. Most customers don&apos;t leave a message — they just call the next garage door company on the list. Insta Intake texts them the second you miss the call, so the job stays yours.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 py-20 bg-gray-50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">How it works</h2>
          <p className="text-gray-500 mb-14">Nothing changes about how you run your business.</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 text-left">
            {[
              {
                step: "1",
                title: "You miss a call",
                desc: "Keep doing what you do — fixing doors, not watching your phone.",
              },
              {
                step: "2",
                title: "We text them instantly",
                desc: "A friendly auto-reply goes out in seconds, keeping the customer engaged before they move on.",
              },
              {
                step: "3",
                title: "You follow up when you're free",
                desc: "The lead is warmed up and waiting for you, instead of already booked with someone else.",
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

      {/* Benefits */}
      <section className="px-6 py-20 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">Built to stay out of your way</h2>
          <p className="text-gray-500 text-center mb-14 max-w-xl mx-auto">
            No new apps, no new numbers, no learning curve.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-5">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Instant Auto-Text</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                The customer gets a text within seconds of your missed call — while they&apos;re still thinking about their door and not yet dialing someone else.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-5">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Your Existing Number</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                No new phone number to hand out. Insta Intake works in the background with the number you already use and your customers already know.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-5">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Set Up in Minutes</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                No tech skills required. Subscribe, connect your number, and Insta Intake starts working. Most operators are up and running in under 10 minutes.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* CTA / Pricing */}
      <section className="px-6 py-20 bg-blue-600 text-white text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Try it free for 30 days.</h2>
          <p className="text-blue-100 text-lg leading-relaxed mb-10">
            Card required at signup — you won&apos;t be charged until day 31. Cancel before then and pay nothing.
          </p>
          <Link
            href="/pricing"
            className="inline-block bg-white text-blue-700 hover:bg-blue-50 font-bold px-8 py-4 rounded-xl text-base transition shadow-md"
          >
            Try Free for 30 Days
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
                a: "No — it works alongside the number you already use. Nothing about how you take calls changes.",
              },
              {
                q: "Will customers know it's automatic?",
                a: "The message is friendly and clear, not robotic. It reads like a real person letting them know you'll follow up.",
              },
              {
                q: "Do I need to install an app or buy new equipment?",
                a: "No. Insta Intake runs in the background. There's nothing to install and no hardware required.",
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

    </div>
  );
}
