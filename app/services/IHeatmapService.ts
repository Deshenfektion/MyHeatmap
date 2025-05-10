import { Database } from "@/database.types";

type Heatmap = Database['public']['Tables']['heatmaps']['Row'];

export interface IHeatmapService {
  createHeatmap(userId: string, label: string): Promise<Heatmap>;
}