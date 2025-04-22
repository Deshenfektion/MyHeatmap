"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { Geist, Geist_Mono } from "next/font/google";
import { saira } from "@/lib/fonts";
import "../globals.css";

// Wenn der Benutzer bereits eingeloggt ist, weiterleiten
const LoginLayout = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        // Wenn der Benutzer bereits eingeloggt ist, weiterleiten
        router.push("/"); // Ändere die Weiterleitungs-URL nach Bedarf
      }

      setLoading(false);
    };

    checkUser();
  }, [router]);

  if (loading) return <div>Loading...</div>;

  return (
    <html lang="en">
      <body className={`${saira.className} antialiased`}>
        {/* Hier kannst du den Login-Inhalt und das Layout für das Login bereitstellen */}
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-800">
          <h1 className="text-4xl mb-4 text-center">Login zu MyHeatmap</h1>
          {children}
        </div>
      </body>
    </html>
  );
};

export default LoginLayout;
