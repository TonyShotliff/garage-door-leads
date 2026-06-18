import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white px-6 py-10">
      <div className="max-w-5xl mx-auto space-y-5">
        <p className="text-xs text-gray-400 leading-relaxed max-w-2xl mx-auto text-center">
          By signing up for Insta Intake, you consent to receive SMS messages
          related to your account and missed-call notifications. Message and
          data rates may apply. Reply STOP to opt out at any time, or HELP for
          help.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-400 pt-4 border-t border-gray-100">
          <div className="flex flex-col items-center sm:items-start gap-1">
            <span className="font-semibold text-gray-500">Insta Intake</span>
            <span className="text-xs text-gray-400">500 Mack Rd, Ashland, WI 54806</span>
          </div>
          <div className="flex flex-wrap items-center gap-6 justify-center">
            <Link href="/privacy" className="hover:text-gray-600 transition">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-gray-600 transition">Terms of Service</Link>
            <Link href="/contact" className="hover:text-gray-600 transition">Contact</Link>
            <a href="mailto:tony@instaintake.com" className="hover:text-gray-600 transition">tony@instaintake.com</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
