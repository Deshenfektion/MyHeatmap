import React from "react";
import { Database } from "@/types/database.types";
import { updateSquareLevel } from "@/app/services/squareService";

type HeatmapSquare = Database["public"]["Tables"]["heatmap_squares"]["Row"];

interface SquareProps {
  square: HeatmapSquare;
}

export default function Square({ square }: SquareProps) {
  // Hintergrundfarbe basierend auf dem Level
  const getBackgroundColor = (level: number): string => {
    switch (level) {
      case 0:
        return "bg-white"; // Weiß
      case 1:
        return "bg-green-100"; // Leicht Grün
      case 2:
        return "bg-green-300"; // Mittelgrün
      case 3:
        return "bg-green-500"; // Dunkelgrün
      default:
        return "bg-white"; // Standardfarbe für ungültige Level
    }
  };

  // Klick-Handler zum Aktualisieren des Levels
  const handleSquareClick = async () => {
    const newLevel = (square.level + 1) % 4; // Level zyklisch erhöhen (0 -> 1 -> 2 -> 3 -> 0)
    try {
      await updateSquareLevel(square.id, newLevel);
      console.log(`Square ${square.id} updated to level ${newLevel}`);
      // Optional: Lokale UI-Aktualisierung, falls nötig
    } catch (error) {
      console.error("Failed to update square level:", error);
    }
  };

  return (
    <div
      className={`w-10 h-10 border ${getBackgroundColor(square.level)}`}
      title={`Position: ${square.position}, Level: ${square.level}`}
      onClick={handleSquareClick} // Klick-Handler hinzufügen
    >
      {/* Optional: Inhalte oder Debug-Informationen */}
    </div>
  );
}
