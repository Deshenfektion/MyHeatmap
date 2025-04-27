// app/components/AddRowForm.tsx
"use client";

import React, { useState, useTransition } from "react";
import { addRowToHeatmap } from "@/app/services/heatmapService";

export default function AddRowForm() {
  // Label wird nicht mehr direkt im State gehalten, sondern über prompt abgefragt
  // const [label, setLabel] = useState('');
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleAddClick = () => {
    setError(null); // Fehler zurücksetzen

    // Frage den Benutzer nach dem Label
    const enteredLabel = window.prompt(
      "Bitte gib das Label für die neue Zeile ein:"
    );

    // Breche ab, wenn der Benutzer abbricht oder nichts eingibt
    if (enteredLabel === null) {
      // Benutzer hat "Abbrechen" geklickt
      return;
    }
    if (!enteredLabel.trim()) {
      setError("Label darf nicht leer sein.");
      return;
    }

    // Starte die Server Action mit dem erhaltenen Label
    startTransition(async () => {
      try {
        await addRowToHeatmap(enteredLabel.trim());
        // Kein Label mehr im State zum Zurücksetzen
      } catch (err) {
        console.error("Failed to add row:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Ein unbekannter Fehler ist aufgetreten."
        );
      }
    });
  };

  // Das <form>-Element ist nicht mehr nötig, da wir keinen direkten Submit haben
  return (
    <div className="flex justify-start items-center mb-4 p-1">
      {/* Der Button zum Starten des Hinzufüge-Prozesses */}
      <button
        type="button" // Wichtig: type="button", nicht "submit"
        onClick={handleAddClick}
        disabled={isPending}
        className="w-24 px-3 py-1 bg-gray-600 text-white rounded-full hover:bg-gray-500 disabled:opacity-50 flex items-center justify-center h-8 m-4" // Styling für runden Plus-Button
        title="Neue Zeile hinzufügen" // Tooltip
      >
        {isPending ? (
          // Kleine Spinner-Animation (optional, benötigt CSS oder eine Lib)
          <span className="animate-spin text-xs">⏳</span>
        ) : (
          // Plus-Symbol
          "+"
        )}
      </button>

      {/* Fehlermeldung wird neben dem Button angezeigt */}
      {error && <p className="text-red-500 text-sm ml-3">{error}</p>}
    </div>
  );
}
