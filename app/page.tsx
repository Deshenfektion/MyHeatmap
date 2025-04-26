// app/page.tsx
// Entferne "use client"; diese Seite ist jetzt eine Server Component
import React from "react";
import {
  getUserHeatmapData,
  addRowToHeatmap,
  initializeHeatmapForUser,
} from "@/app/services/heatmapService"; // Importiere die Service-Funktionen
import { redirect } from "next/navigation";

// WICHTIG: Importiere den korrekten Supabase Server Client für Server Components
// import { createServerComponentClient } from '@/lib/supabase/server'; // Idealerweise
import { createClient } from "@/utils/supabase/server"; // Annahme basierend auf deiner Struktur

// Komponente zum Hinzufügen einer Zeile (Client Component für Interaktivität mit State)
import HeatmapGrid from "./components/heatmapGrid";
import AddRowForm from "./components/addRowform";

export default async function Page() {
  // Erstelle den Supabase Client für Server Components
  const supabase = await createClient();

  // Prüfe Authentifizierung
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) {
    // Leite zum Login um, wenn nicht eingeloggt
    redirect("/login");
  }

  // Versuche, die Heatmap zu initialisieren (nur wenn sie nicht existiert)
  // Dies stellt sicher, dass der User immer eine Heatmap hat, wenn er eingeloggt ist.
  try {
    await initializeHeatmapForUser();
  } catch (error) {
    console.error("Failed to initialize heatmap:", error);
    // Zeige optional eine Fehlermeldung an, aber versuche trotzdem, Daten zu laden
  }

  // Lade die Heatmap-Daten
  const rowsWithSquares = await getUserHeatmapData();

  // Fehlerbehandlung beim Laden der Daten
  if (rowsWithSquares === null) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl text-center mb-8">My Heatmap</h1>
        <p className="text-center text-red-500">
          Fehler beim Laden der Heatmap-Daten. Bitte versuche es später erneut.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl text-center mb-8">My Heatmap</h1>

      {/* Formular zum Hinzufügen einer Zeile */}
      <AddRowForm />

      {/* Das Heatmap Grid */}
      <div className="mt-6">
        <HeatmapGrid rowsWithSquares={rowsWithSquares} />
      </div>
    </div>
  );
}
