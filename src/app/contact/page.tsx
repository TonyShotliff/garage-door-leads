export default function Contact() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
      <p className="text-gray-500 mb-10">Questions about Insta Intake? Reach out anytime.</p>

      <div className="bg-white border border-gray-200 rounded-2xl p-8 space-y-6">
        <div>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">Business</h2>
          <p className="text-gray-900 font-medium">Insta Intake</p>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">Address</h2>
          <address className="not-italic text-gray-900">
            <p>500 Mack Rd</p>
            <p>Ashland, WI 54806</p>
          </address>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">Email</h2>
          <a href="mailto:tony@instaintake.com" className="text-blue-600 hover:underline">tony@instaintake.com</a>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">SMS Support</h2>
          <p className="text-gray-700 text-sm">
            If you received an automated text message and want to opt out, reply <strong>STOP</strong> to any message. For help, reply <strong>HELP</strong>.
          </p>
        </div>
      </div>
    </div>
  );
}
