"use client";

import { login, signup } from "@/app/login/actions";
import { createClient } from "@/utils/supabase/client";
import { useEffect } from "react";

export default function LoginPage() {
  // GitHub Login Logik with Supabase Client
  const handleGitHubLogin = async () => {
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${window.location.origin}/`, // Dynamische Weiterleitung zur Startseite
      },
    });
    if (error) console.error("Error logging in with GitHub:", error.message);
  };

  // Session-Überprüfung nach der Weiterleitung
  useEffect(() => {
    const checkSession = async () => {
      const supabase = await createClient();
      const { data, error } = await supabase.auth.getSession();
      if (data.session) {
        // Benutzer ist authentifiziert, leite zur Startseite weiter
        window.location.href = "/";
      }
    };

    checkSession();
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md rounded-lg shadow-md p-8 border border-white">
        <h1 className="text-2xl font-bold text-center mb-6">Welcome Back</h1>
        <form className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="mt-1 block w-full rounded-md border border-white shadow-sm focus:ring sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="mt-1 block w-full rounded-md border border-white shadow-sm focus:ring sm:text-sm"
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              formAction={login}
              className="w-full py-2 px-4 rounded-md border border-emerald-600 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2"
            >
              Log in
            </button>
          </div>
          <div className="text-center">
            <p className="text-sm">Don't have an account?</p>
            <button
              formAction={signup}
              className="mt-2 w-full py-2 px-4 rounded-md border border-emerald-600 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2"
            >
              Sign up
            </button>
          </div>
          <div className="mt-6">
            <button
              onClick={handleGitHubLogin}
              className="w-full py-2 px-4 rounded-md border border-gray-800 bg-gray-800 text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2"
            >
              Sign in with GitHub
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
