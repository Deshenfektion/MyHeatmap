import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { supabaseClient } from "@/lib/supabaseClient";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialer Auth-Status
    supabaseClient.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Auth-Status Änderungen überwachen
    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return {
    user,
    loading,
    signIn: (email: string, password: string) =>
      supabaseClient.auth.signInWithPassword({ email, password }),
    signUp: (email: string, password: string) =>
      supabaseClient.auth.signUp({ email, password }),
    signOut: () => supabaseClient.auth.signOut(),
  };
}
