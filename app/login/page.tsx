// app/login/page.tsx

"use client";

import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl mb-4">Bitte einloggen</h1>
      <button
        onClick={() => supabase.auth.signInWithOAuth({ provider: "github" })}
        className="px-4 py-2 bg-green-600 text-white rounded"
      >
        Login mit GitHub
      </button>
    </div>
  );
}
