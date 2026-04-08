import Link from "next/link";

export default function SuccessPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-md p-10 max-w-md w-full text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-green-100 rounded-full p-4">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">You&apos;re subscribed!</h1>
        <p className="text-gray-500 mb-8">
          Welcome aboard. You&apos;ll start receiving garage door leads via SMS and email right away.
        </p>
        <Link
          href="/"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition text-sm"
        >
          Go to Lead Form
        </Link>
      </div>
    </main>
  );
}
