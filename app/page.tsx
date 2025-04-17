// page.tsx

"use client";

import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";
import Heatmap from "./heatmap";
import LoadingSpinner from "./ui/loadingspinner";

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true); // Zustand für das Laden

  useEffect(() => {
    // Authentifizierungsstatus überprüfen
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
      setLoading(false); // Sobald der Status überprüft wurde, auf false setzen
    };
    fetchUser();
  }, []);

  // Ladeindikator anzeigen, wenn die Seite noch lädt
  if (loading) {
    return <LoadingSpinner />;
  }

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "github", // oder "google"
    });
  };

  // Wenn der User noch nicht eingeloggt ist, den Login-Screen anzeigen
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl mb-4">Bitte einloggen</h1>
        <button onClick={handleLogin} className="px-4 py-2 bg-green-600">
          Login mit GitHub
        </button>
      </div>
    );
  }

  // Wenn der User eingeloggt ist, die Heatmap anzeigen
  return <Heatmap userId={user.id} rows={5} cols={5} />;
}
