import React, { useTransition } from "react";
import { Database } from "@/types/database.types";
import { updateSquareLevelAndRevalidate } from "../services/rowService";

type HeatmapSquare = Database["public"]["Tables"]["heatmap_squares"]["Row"];

interface SquareProps {
  square: HeatmapSquare;
}

export default function Square({ square }: SquareProps) {
  const [isPending, startTransition] = useTransition(); // Für Ladezustand
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
  const handleSquareClick = () => {
    // Wenn bereits eine Aktualisierung läuft, nichts tun
    if (isPending) return;

    startTransition(async () => {
      const newLevel = (square.level + 1) % 4;
      try {
        // Rufe die Action auf, die revalidatePath enthält
        await updateSquareLevelAndRevalidate(square.id, newLevel);
        console.log(
          `Square ${square.id} update requested to level ${newLevel}`
        );
        // Kein router.refresh() oder setState nötig dank revalidatePath
      } catch (error) {
        console.error("Failed to update square level:", error);
        // TODO: Benutzerfeedback bei Fehler
      }
    });
  };

  return (
    <div
      className={`w-10 h-10 border rounded-sm ${getBackgroundColor(
        square.level
      )}`}
      title={`Position: ${square.position}, Level: ${square.level}`}
      onClick={handleSquareClick} // Klick-Handler hinzufügen
    >
      {/* Optional: Inhalte oder Debug-Informationen */}
    </div>
  );
}
