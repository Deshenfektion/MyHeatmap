// app/login.ts (oder irgendwo im Client z. B. useEffect)
import { supabase } from "@/lib/supabaseClient";

export const signInAnon = async () => {
  const { data, error } = await supabase.auth.signInAnonymously();
  if (error) console.error("Login-Fehler", error);
  else console.log("User-ID:", data.user?.id);
};
