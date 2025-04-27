"use client"; // Benötigt für onClick Handler und potenziell useRouter

import React, { useState, useTransition } from "react";
import { Database } from "@/types/database.types";
import { addSquareToRow } from "@/app/services/rowService"; // Importiere die Server Action
// Importiere die neue Update-Funktion, wenn du revalidatePath dort hinzugefügt hast
import Square from "./square";
// Alternativ importiere die Originalfunktion und useRouter
// import { updateSquareLevel } from '@/app/services/squareService';
// import { useRouter } from 'next/navigation';

type HeatmapRowData = Database["public"]["Tables"]["heatmap_rows"]["Row"];
type HeatmapSquareData = Database["public"]["Tables"]["heatmap_squares"]["Row"];

interface HeatmapRowProps {
  row: HeatmapRowData;
  initialSquares: HeatmapSquareData[]; // Die Quadrate für diese Zeile
}

export default function HeatmapRow({ row, initialSquares }: HeatmapRowProps) {
  // Lokaler State, um die Quadrate zu verwalten (optional, wenn revalidatePath zuverlässig funktioniert)
  // const [squares, setSquares] = useState<HeatmapSquareData[]>(initialSquares);
  // const router = useRouter(); // Nur nötig, wenn revalidatePath nicht verwendet wird

  const [isPending, startTransition] = useTransition(); // Für Ladezustand bei Actions

  const handleAddSquare = () => {
    startTransition(async () => {
      try {
        // Rufe die Server Action auf
        await addSquareToRow(row.id);
        console.log(`Request to add square to row ${row.id} sent.`);
        // Mit revalidatePath in der Action ist kein manuelles Refresh nötig.
        // router.refresh(); // Alternative ohne revalidatePath

        // Wenn du lokalen State verwendest (weniger empfohlen mit Server Actions):
        // const newSquare = await addSquareToRow(row.id);
        // if (newSquare) {
        //   setSquares(currentSquares => [...currentSquares, newSquare].sort((a, b) => a.position - b.position));
        // }
      } catch (error) {
        console.error("Failed to add square via button:", error);
        // TODO: Zeige dem Benutzer eine Fehlermeldung an
      }
    });
  };

  // --- WICHTIG: Update für die Square Komponente ---
  // Damit Klicks auf Quadrate die UI aktualisieren, muss die `handleSquareClick`
  // im `Square.tsx` entweder:
  // 1. Die neue `updateSquareLevelAndRevalidate` Action aufrufen (bevorzugt).
  // 2. Die ursprüngliche Action aufrufen und danach `router.refresh()` ausführen.

  // Beispiel, wie du die Update-Funktion an Square übergeben könntest (wenn du die Logik hier behalten willst):
  /*
   const handleSquareUpdate = (squareId: string, newLevel: number) => {
     startTransition(async () => {
       try {
         // Verwende die Action, die revalidiert
         await updateSquareLevelAndRevalidate(squareId, newLevel);
         // Oder:
         // await updateSquareLevel(squareId, newLevel);
         // router.refresh();
       } catch (error) {
         console.error("Failed to update square level:", error);
       }
     });
   };
   */
  // In diesem Fall müsstest du die SquareProps ändern und die Funktion übergeben:
  // <Square key={square.id} square={square} onUpdate={handleSquareUpdate} />

  return (
    <div className="flex items-center space-x-2 mb-2 p-2">
      {/* Label der Zeile */}
      <div className="w-24 font-medium pr-2 text-right shrink-0">
        {row.label}
      </div>

      {/* Container für die Quadrate */}
      <div className="flex flex-wrap gap-1 grow">
        {initialSquares // oder `squares`, wenn du lokalen State verwendest
          .map((square) => (
            <Square
              key={square.id}
              square={square}
              // Wenn du die Logik nicht im Square selbst haben willst:
              // onUpdate={handleSquareUpdate} // Übergib die Update-Funktion
            />
          ))}
      </div>

      {/* Button zum Hinzufügen eines Quadrats */}
      <button
        onClick={handleAddSquare}
        disabled={isPending} // Deaktiviere während die Action läuft
        className="w-5 h-8 rounded-sm bg-gray-600  hover:bg-gray-500 text-center shrink-0"
        title="Neues Quadrat hinzufügen"
      >
        +
      </button>
    </div>
  );
}
