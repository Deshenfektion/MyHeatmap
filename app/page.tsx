// app/page.tsx

"use client";

import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";
import Heatmap from "./ui/heatmap";
import LoadingSpinner from "./ui/loadingspinner";
import { useRouter } from "next/navigation";

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [rowLabels, setRowLabels] = useState<string[] | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserAndLabels = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);

      if (!user) {
        router.push("/login");
        return;
      }

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

      setLoading(false);
    };

    fetchUserAndLabels();
  }, [router]);

  if (loading) return <LoadingSpinner />;

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
