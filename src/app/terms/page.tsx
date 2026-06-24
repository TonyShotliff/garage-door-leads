export default function Terms() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
      <p className="text-sm text-gray-500 mb-8">Effective Date: June 9, 2026</p>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">1. Acceptance of Terms</h2>
        <p>By subscribing to Insta Intake, you agree to these Terms of Service. If you do not agree, do not use our service.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">2. Description of Service</h2>
        <p>Insta Intake provides automated SMS notifications to individuals who call a subscribed business line and do not receive an answer. The service is intended for legitimate business use only.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">3. Subscriber Responsibilities</h2>
        <p>Subscribers are responsible for ensuring their use of Insta Intake complies with all applicable laws including TCPA regulations. Subscribers may not use the service to send spam, harassment, or unsolicited commercial messages.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">4. SMS Compliance and Consent</h2>
        <p className="mb-3">When an individual places a phone call to a business that uses Insta Intake and that call goes unanswered, the act of placing that call constitutes the caller&apos;s verbal initiation of contact and consent to receive a single automated SMS message from that business via Insta Intake. The SMS is sent solely to facilitate continued communication between the caller and the business they contacted.</p>
        <p className="mb-3">By activating Insta Intake on their business number, subscribers acknowledge and agree that:</p>
        <ul className="list-disc pl-5 space-y-2 text-gray-700">
          <li>Their customers may receive one automated SMS per missed call.</li>
          <li>All SMS messages sent through Insta Intake include opt-out instructions.</li>
          <li>Recipients may reply <strong>STOP</strong> to stop receiving messages at any time.</li>
          <li>Recipients may reply <strong>HELP</strong> for assistance at any time.</li>
          <li>Subscribers must honor all opt-out requests immediately.</li>
          <li>Message and data rates may apply to recipients.</li>
          <li>Message frequency is one message per missed call.</li>
          <li>Carriers are not liable for delayed or undelivered messages.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">5. SMS Program Details</h2>
        <p className="mb-3"><strong>Program Name:</strong> Insta Intake Missed Call SMS</p>
        <p className="mb-3"><strong>Program Description:</strong> Automated single SMS sent to callers when a subscribed home service business misses their call.</p>
        <p className="mb-3"><strong>Message Frequency:</strong> One message per missed call.</p>
        <p className="mb-3"><strong>Message and data rates may apply.</strong></p>
        <p className="mb-3"><strong>To opt out:</strong> Reply <strong>STOP</strong> to any message.</p>
        <p className="mb-3"><strong>For help:</strong> Reply <strong>HELP</strong> to any message or contact us at <a href="mailto:tony@instaintake.com" className="text-blue-600 hover:underline">tony@instaintake.com</a>.</p>
        <p><strong>Carriers are not liable for delayed or undelivered messages.</strong></p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">6. Payment</h2>
        <p>Insta Intake is billed at $49 per month after a 30-day free trial. Payments are processed securely through Stripe. You may cancel at any time. No refunds are issued for partial months.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">7. Limitation of Liability</h2>
        <p>Insta Intake is not liable for missed messages, carrier filtering, or any damages resulting from use or inability to use the service. The service is provided as-is.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">8. Termination</h2>
        <p>We reserve the right to terminate any account that violates these terms or applicable law.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">9. Contact</h2>
        <p className="mb-2">For questions about these terms, contact us at:</p>
        <address className="not-italic text-gray-700 space-y-1">
          <p>Insta Intake</p>
          <p>500 Mack Rd</p>
          <p>Ashland, WI 54806</p>
          <p><a href="mailto:tony@instaintake.com" className="text-blue-600 hover:underline">tony@instaintake.com</a></p>
        </address>
        <p className="mt-3">Privacy Policy: <a href="https://www.instaintake.com/privacy" className="text-blue-600 hover:underline">https://www.instaintake.com/privacy</a></p>
      </section>
    </div>
  );
}
