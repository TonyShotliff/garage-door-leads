import Link from "next/link";

export default function GarageDoorsLanding() {
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
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white px-6 py-20 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-block bg-blue-500 bg-opacity-50 text-blue-100 text-sm font-medium px-4 py-1.5 rounded-full mb-6 tracking-wide uppercase">
            Built for Garage Door Pros
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-6">
            Never Miss a Garage Door Lead Again
          </h1>
          <p className="text-blue-100 text-lg sm:text-xl leading-relaxed mb-10 max-w-2xl mx-auto">
            Get instant SMS and email alerts the moment a customer submits a service request — complete with photos so you know the job before you call back.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/pricing"
              className="bg-white text-blue-700 hover:bg-blue-50 font-bold px-8 py-4 rounded-xl text-base transition shadow-md"
            >
              Start for $49/month
            </Link>
            <Link
              href="/"
              className="border border-blue-300 text-white hover:bg-blue-700 font-semibold px-8 py-4 rounded-xl text-base transition"
            >
              See the Lead Form
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="px-6 py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">Everything you need to close more jobs</h2>
          <p className="text-gray-500 text-center mb-14 max-w-xl mx-auto">
            Insta Intake puts the right information in your hands the second a customer reaches out.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {/* Benefit 1 */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-5">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Instant SMS Alert</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Your phone buzzes the second a lead comes in. Name, service type, and urgency — right in your pocket before your competition even knows the job exists.
              </p>
            </div>

            {/* Benefit 2 */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-5">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Full Email with Lead Details</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Name, phone number, and full problem description delivered straight to your inbox. Everything you need to make a confident callback — no guessing.
              </p>
            </div>

            {/* Benefit 3 */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-5">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Photo Upload</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Customers can attach a photo of the problem so you can assess the job instantly. Show up prepared, quote accurately, and close the deal on the first call.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 py-20 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Up and running in minutes</h2>
          <p className="text-gray-500 mb-14">No tech skills required. Just subscribe and start receiving leads.</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-left">
            {[
              { step: "1", title: "Subscribe", desc: "Sign up for $49/month. No contracts, cancel anytime." },
              { step: "2", title: "Share Your Form", desc: "Send customers your unique intake form link — embed it anywhere." },
              { step: "3", title: "Get Notified", desc: "Receive an SMS and email the instant a customer submits a request." },
            ].map(({ step, title, desc }) => (
              <div key={step} className="flex flex-col items-start">
                <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg mb-4">
                  {step}
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="px-6 py-20 bg-gray-50">
        <div className="max-w-md mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">One simple price</h2>
          <p className="text-gray-500 mb-10">No setup fees. No long-term contracts. Just leads.</p>
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
            <div className="bg-blue-600 px-8 py-8">
              <p className="text-blue-100 text-sm font-medium uppercase tracking-widest mb-2">Monthly Plan</p>
              <div className="flex items-end justify-center gap-1">
                <span className="text-white text-5xl font-bold">$49</span>
                <span className="text-blue-200 text-lg mb-1">/month</span>
              </div>
              <p className="text-blue-100 text-sm mt-2">Cancel anytime</p>
            </div>
            <div className="px-8 py-6 space-y-3">
              {[
                "Instant SMS notifications",
                "Full email lead details",
                "Customer photo attachments",
                "Unlimited lead submissions",
                "Cancel anytime, no contracts",
              ].map((feature) => (
                <div key={feature} className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-700 text-sm">{feature}</span>
                </div>
              ))}
            </div>
            <div className="px-8 pb-8">
              <Link
                href="/pricing"
                className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 rounded-xl transition text-base text-center shadow-sm"
              >
                Subscribe Now — $49/month
              </Link>
              <p className="text-xs text-center text-gray-400 mt-3">
                Secure payment powered by Stripe.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 px-6 py-8 text-center text-sm text-gray-400">
        <span className="font-semibold text-gray-500">Insta Intake</span> — Built for garage door professionals.
      </footer>

    </div>
  );
}
