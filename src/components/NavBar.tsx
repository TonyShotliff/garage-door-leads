"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createBrowserSupabase } from "@/lib/supabase-browser";

interface NavBarProps {
  cta?: React.ReactNode;
}

export default function NavBar({ cta }: NavBarProps) {
  // undefined = still loading; null = not signed in; string = signed-in email
  const [userEmail, setUserEmail] = useState<string | null | undefined>(undefined);

  useEffect(() => {
    const supabase = createBrowserSupabase();

    supabase.auth.getSession().then(({ data }) => {
      setUserEmail(data.session?.user?.email ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserEmail(session?.user?.email ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <nav className="border-b border-gray-100 bg-white px-6 py-4">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-blue-600 tracking-tight">
          Insta Intake
        </Link>
        <div className="flex items-center gap-4">
          {cta}
          {/* Render nothing while auth state loads to avoid Sign In → My Account flash */}
          {userEmail === undefined ? null : userEmail ? (
            <>
              {userEmail === "tony@instaintake.com" && (
                <Link
                  href="/admin"
                  className="text-sm font-medium text-gray-600 hover:text-blue-600 transition"
                >
                  Admin
                </Link>
              )}
              <Link
                href="/account"
                className="text-sm font-medium text-gray-600 hover:text-blue-600 transition"
              >
                My Account
              </Link>
            </>
          ) : (
            <Link
              href="/account/login"
              className="text-sm font-medium text-gray-600 hover:text-blue-600 transition"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
