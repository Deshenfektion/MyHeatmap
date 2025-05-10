// SupabaseHeatmapRepository aka HeatmapRepositoryImpl

import { supabase } from "@/lib/supabaseClient";
import { Database } from "@/database.types";
import { IHeatmapRepository } from "../domain/IHeatmapRepository";

type Heatmap = Database['public']['Tables']['heatmaps']['Row'];
type HeatmapInsert = Database['public']['Tables']['heatmaps']['Insert']; 
type HeatmapUpdate = Database['public']['Tables']['heatmaps']['Update'];

export class SupabaseHeatmapRepository implements IHeatmapRepository {
   private supabaseClient; 

   constructor() {
    this.supabaseClient = supabase;
   }

   async getClient() {
    return this.supabaseClient;
   }

    // Create a heatmap with userId and label
    async createHeatmap(userId: string, label: string): Promise<Heatmap> {
        
        const newHeatmap: HeatmapInsert = {
            user_id: userId,
            label: label,
        }
        
        const {data, error} = await this.supabaseClient
        .from('heatmaps')
        .insert(newHeatmap)
        .select()
        .single();

        // TODO: Automatically create 365 squares for a new heatmap
        // ISquaresRepository, SupabaseSquaresRepository, 
        // ISquaresService, SquaresServiceImpl

        // Return the newly created heatmap
        return data;
    }
        
    // Update heatmap label

    // Delete heatmap
}