// SupabaseHeatmapRepository aka HeatmapRepositoryImpl

import { supabaseClient } from "@/lib/supabaseClient";
import { Database } from "@/app/domain/database.types";
import { HeatmapRepository } from "../domain/repository/HeatmapRepository";

type Heatmap = Database["public"]["Tables"]["heatmaps"]["Row"];
type HeatmapInsert = Database["public"]["Tables"]["heatmaps"]["Insert"];
type HeatmapUpdate = Database["public"]["Tables"]["heatmaps"]["Update"];

export class SupabaseHeatmapRepository implements HeatmapRepository {
  private supabaseClient;

  constructor() {
    this.supabaseClient = supabaseClient;
  }

  async getClient() {
    return this.supabaseClient;
  }

  // Create a heatmap with userId and label
  async insertHeatmap(userId: string, label: string): Promise<HeatmapInsert> {
    console.log(
      "SupabaseHeatmapRepository: Attempting to create heatmap with userId:",
      userId,
      "label:",
      label
    );

    const newHeatmap: HeatmapInsert = {
      user_id: userId,
      label: label,
    };

    const { data, error } = await this.supabaseClient
      .from("heatmaps")
      .insert(newHeatmap)
      .select()
      .single();

    console.log("Supabase response - data:", data);
    console.log("Supabase response - error:", error);

    return data as HeatmapInsert; // Stelle sicher, dass der Typ hier korrekt ist
  }

  async findByUserId(userId: string): Promise<HeatmapInsert | null> {
    const { data, error } = await this.supabaseClient
      .from("heatmaps")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle(); // .maybeSingle() gibt null zurück, wenn nichts gefunden wird, anstatt einen Fehler zu werfen

    if (error) {
      console.error("Error finding heatmap by user ID:", error.message);
      return null;
    }
    return data as HeatmapInsert | null;
  }

  async findAllByUserId(userId: string): Promise<Heatmap[]> {
    const { data, error } = await this.supabaseClient
      .from("heatmaps")
      .select("*")
      .eq("user_id", userId);

    if (error) {
      console.error("Error finding heatmaps by user ID:", error.message);
      return [];
    }
    return data as Heatmap[];
  }

  // Update heatmap label

  // Delete heatmap
}
