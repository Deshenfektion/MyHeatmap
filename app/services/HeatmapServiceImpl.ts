import { IHeatmapRepository } from "../domain/IHeatmapRepository";
import { IHeatmapService } from "./IHeatmapService";
import { Database } from "@/database.types";

type Heatmap = Database['public']['Tables']['heatmaps']['Row'];

export class HeatmapServiceImpl implements IHeatmapService{
    private repository;

    constructor(repository: IHeatmapRepository) {
        this.repository = repository;
    }

    async createHeatmap(userId: string, label: string): Promise<Heatmap> {
        const newHeatmap = this.repository.createHeatmap(userId, label);
        return newHeatmap;
    }
        
}