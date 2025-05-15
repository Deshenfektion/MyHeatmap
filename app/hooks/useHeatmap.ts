import { useState } from "react";
import { HeatmapServiceImpl } from "../services/HeatmapServiceImpl";
import { SupabaseHeatmapRepository } from "../repository/SupabaseHeatmapRepository";
import { SquaresServiceImpl } from "../services/SquaresServiceImpl";
import { SupabaseSquaresRepository } from "../repository/SupabaseSquaresRepository";
import { Database } from "../domain/database.types";
import { useServices } from "../contexts/ServiceContext";

type HeatmapInsert = Database["public"]["Tables"]["heatmaps"]["Insert"];

export function useHeatmap() {
  const { heatmapService, squaresService } = useServices();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [heatmap, setHeatmap] = useState<HeatmapInsert>();

  const createHeatmap = async (userId: string, label: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const newHeatmap = await heatmapService.createHeatmap(userId, label);
      setHeatmap(newHeatmap);
      return newHeatmap;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create heatmap");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    heatmap,
    isLoading,
    error,
    createHeatmap,
  };
}
