// app/components/AddRowForm.tsx
"use client";

import React, { useState, useTransition } from "react";
import { addRowToHeatmap } from "@/app/services/heatmapService"; // Importiere die Server Action

export default function AddRowForm() {
  const [label, setLabel] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null); // Fehler zurücksetzen

    if (!label.trim()) {
      setError("Label darf nicht leer sein.");
      return;
    }

    startTransition(async () => {
      try {
        await addRowToHeatmap(label);
        setLabel(""); // Formular leeren nach Erfolg
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

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center space-x-2 mb-4 p-4 rounded"
    >
      <input
        type="text"
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        placeholder="Neues Label für Zeile..."
        className="border p-2 rounded flex-grow focus:outline-none focus:ring-2 focus:ring-blue-500"
        disabled={isPending}
        required
      />
      <button
        type="submit"
        disabled={isPending}
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
      >
        {isPending ? "Wird hinzugefügt..." : "Zeile hinzufügen"}
      </button>
      {error && <p className="text-red-500 text-sm ml-2">{error}</p>}
    </form>
  );
}
