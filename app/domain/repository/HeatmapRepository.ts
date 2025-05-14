import { Database } from "@/app/domain/database.types";

type Heatmap = Database["public"]["Tables"]["heatmaps"]["Row"];
type HeatmapInsert = Database["public"]["Tables"]["heatmaps"]["Insert"];

export interface HeatmapRepository {
  insertHeatmap(userId: string, label: string): Promise<HeatmapInsert>;
  findByUserId(userId: string): Promise<HeatmapInsert | null>;
}
