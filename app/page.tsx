// page.tsx

"use client";

import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";
import Heatmap from "./heatmap";
import LoadingSpinner from "./ui/loadingspinner";

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [rowLabels, setRowLabels] = useState<string[] | null>(null);

  useEffect(() => {
    const fetchUserAndLabels = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data, error } = await supabase
          .from("row_labels")
          .select("labels")
          .eq("user_id", user.id)
          .single();

        if (data?.labels) {
          setRowLabels(data.labels);
        } else {
          setRowLabels(["Zeile 1", "Zeile 2"]); // Fallback
        }
      }

      setLoading(false);
    };

    fetchUserAndLabels();
  }, []);

  if (loading) return <LoadingSpinner />;

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl mb-4">Bitte einloggen</h1>
        <button
          onClick={() => supabase.auth.signInWithOAuth({ provider: "github" })}
          className="px-4 py-2 bg-green-600"
        >
          Login mit GitHub
        </button>
      </div>
    );
  }

  return (
    <>
      {rowLabels && (
        <Heatmap
          userId={user.id}
          initialRowLabels={rowLabels}
          rows={2}
          cols={20}
        />
      )}
    </>
  );
}
