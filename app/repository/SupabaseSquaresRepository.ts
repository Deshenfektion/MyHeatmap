import { Database } from "@/app/domain/database.types";
import { SquaresRepository } from "../domain/repository/SquaresRepository";
import { supabaseClient } from "@/lib/supabaseClient";

type Square = Database["public"]["Tables"]["squares"]["Row"];
type SquareInsert = Database["public"]["Tables"]["squares"]["Insert"];

export class SupabaseSquaresRepository implements SquaresRepository {
  // Class attribute
  private supabaseClient;

  // Constructor
  constructor() {
    this.supabaseClient = supabaseClient;
  }

  // Create square
  async insertSquare(heatmapId: string, date: string): Promise<Square> {
    const newSquare: SquareInsert = {
      heatmap_id: heatmapId,
      date: date,
    };

    const { data, error } = await supabaseClient
      .from("squares")
      .insert(newSquare)
      .select()
      .single();

    return data;
  }
}
