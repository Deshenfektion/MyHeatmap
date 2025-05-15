import { Database } from "@/app/domain/database.types";

type HeatmapInsert = Database["public"]["Tables"]["heatmaps"]["Insert"];
type Heatmap = Database["public"]["Tables"]["heatmaps"]["Row"];

export interface HeatmapService {
  createHeatmap(userId: string, label: string): Promise<HeatmapInsert>;
  getHeatmapsByUserId(userId: string): Promise<Heatmap[]>;
}
