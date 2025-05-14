import { Database } from "@/app/domain/database.types";

type HeatmapInsert = Database["public"]["Tables"]["heatmaps"]["Insert"];

export interface HeatmapService {
  createHeatmap(userId: string, label: string): Promise<HeatmapInsert>;
}
