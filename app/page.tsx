"use client";

import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";
import Heatmap from "./heatmap";

export default function Home() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "github", // oder "google"
    });
  };

  if (!user)
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl mb-4">Bitte einloggen</h1>
        <button
          onClick={handleLogin}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          Login mit GitHub
        </button>
      </div>
    );

  return <Heatmap userId={user.id} rows={5} cols={5} />;
}
