// app/components/HeatmapGrid.tsx
import React from "react";
import HeatmapRow from "./row"; // Importiere die Zeilen-Komponente
import { RowWithSquares } from "@/app/services/heatmapService"; // Importiere den gemeinsamen Typ

interface HeatmapGridProps {
  rowsWithSquares: RowWithSquares[]; // Die Daten kommen von der übergeordneten Komponente
}

export default function HeatmapGrid({ rowsWithSquares }: HeatmapGridProps) {
  if (!rowsWithSquares || rowsWithSquares.length === 0) {
    return (
      <div className="text-center text-gray-500 mt-10">
        Noch keine Daten vorhanden. Füge deine erste Zeile hinzu!
      </div>
    );
  }

  return (
    <div className="p-4 rounded-md">
      {rowsWithSquares.map((row) => (
        <HeatmapRow
          key={row.id}
          row={row} // Übergib die Zeilendaten
          initialSquares={row.heatmap_squares} // Übergib die zugehörigen Quadrate
        />
      ))}
    </div>
  );
}
