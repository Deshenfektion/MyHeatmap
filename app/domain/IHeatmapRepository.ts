import { Database } from "@/database.types"

type Heatmap = Database['public']['Tables']['heatmaps']['Row'];


export interface IHeatmapRepository {
    createHeatmap(userId: string, label: string): Promise<Heatmap>
}