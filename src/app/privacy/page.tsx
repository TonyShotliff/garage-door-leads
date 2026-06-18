export default function PrivacyPolicy() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
      <p className="text-sm text-gray-500 mb-8">Effective Date: June 9, 2026</p>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">1. Who We Are</h2>
        <p>Insta Intake (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) provides automated missed-call SMS notification services for home service businesses. Our website is instaintake.com.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">2. Information We Collect</h2>
        <p>We collect information you provide when subscribing to our service, including your name, email address, phone number, and business information. We also collect phone numbers of individuals who call our subscribers&rsquo; business lines.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">3. How We Use Your Information</h2>
        <p>We use collected information to deliver automated SMS notifications to individuals who have called a subscriber&rsquo;s business line and did not receive an answer. SMS messages are sent solely to facilitate communication between the caller and the business.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">4. SMS Messaging and Consent</h2>
        <p className="mb-3">When an individual places a phone call to a business that uses Insta Intake and that call goes unanswered, the act of placing that call constitutes implied consent to receive a single automated SMS message from that business via Insta Intake. The SMS is sent solely to facilitate continued communication between the caller and the business they contacted.</p>
        <p className="mb-3">Insta Intake subscribers (business operators) are notified of this SMS practice through our Terms of Service and onboarding process prior to activating their account.</p>
        <ul className="list-disc pl-5 space-y-2 text-gray-700">
          <li>Message and data rates may apply.</li>
          <li>To opt out of future messages, reply <strong>STOP</strong> to any message you receive.</li>
          <li>For help, reply <strong>HELP</strong>.</li>
          <li>No additional opt-in is required beyond the call itself.</li>
          <li>Message frequency: one message per missed call.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">5. Data Sharing</h2>
        <p>We do not sell your personal information. We may share data with service providers necessary to operate our platform, including Twilio for SMS delivery and Stripe for payment processing.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">6. Data Retention</h2>
        <p>We retain personal data only as long as necessary to provide our services or as required by law.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">7. Contact Us</h2>
        <p className="mb-2">For privacy questions, contact us at:</p>
        <address className="not-italic text-gray-700 space-y-1">
          <p>Insta Intake</p>
          <p>500 Mack Rd</p>
          <p>Ashland, WI 54806</p>
          <p><a href="mailto:tony@instaintake.com" className="text-blue-600 hover:underline">tony@instaintake.com</a></p>
        </address>
      </section>
    </div>
  );
}
