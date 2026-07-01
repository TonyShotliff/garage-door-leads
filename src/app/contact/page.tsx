export default function Contact() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
      <p className="text-gray-500 mb-8">Questions about Insta Intake? Reach out anytime.</p>

      <div className="bg-[#1A2E22] text-white rounded-2xl p-6 mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400 mb-2">SMS Opt-Out &amp; Support</p>
        <p className="text-base leading-relaxed">
          If you received an automated text message from a business using Insta Intake and want to stop receiving messages,
          reply <strong>STOP</strong> to any message. For help, reply <strong>HELP</strong> or email us at{" "}
          <a href="mailto:tony@instaintake.com" className="underline text-emerald-300 hover:text-white">
            tony@instaintake.com
          </a>.
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-8 space-y-6">
        <div>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">Business</h2>
          <p className="text-gray-900 font-medium">Insta Intake</p>
          <p className="text-gray-500 text-sm">Operated by Anthony M. Shotliff</p>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">Address</h2>
          <address className="not-italic text-gray-900">
            <p>500 Mack Rd</p>
            <p>Ashland, WI 54806</p>
          </address>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">Phone</h2>
          <a href="tel:+18442524470" className="text-gray-900 font-medium hover:underline">+1 (844) 252-4470</a>
          <p className="text-sm text-gray-700 mt-1 leading-relaxed">
            By calling this number, you may receive an automated SMS reply if your call is missed. Message and data rates may apply. Reply <strong>STOP</strong> to opt out, or <strong>HELP</strong> for help.
          </p>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">Email</h2>
          <a href="mailto:tony@instaintake.com" className="text-blue-600 hover:underline">tony@instaintake.com</a>
        </div>
      </div>
    </div>
  );
}
