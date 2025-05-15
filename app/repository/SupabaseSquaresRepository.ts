import { Database } from "@/app/domain/database.types";
import { supabaseClient } from "@/lib/supabaseClient";
import { SquaresRepository } from "../domain/repository/SquaresRepository";

type Square = Database["public"]["Tables"]["squares"]["Row"];
type SquareInsert = Database["public"]["Tables"]["squares"]["Insert"];
type SquareUpdate = Database["public"]["Tables"]["squares"]["Update"];

export class SupabaseSquaresRepository implements SquaresRepository {
  // Class attribute
  private supabaseClient;

  // Constructor
  constructor() {
    this.supabaseClient = supabaseClient;
  }

  // Create square
  async insertSquare(squareData: SquareInsert): Promise<Square> {
    console.log(
      "SupabaseSquaresRepository: Inserting single square:",
      squareData
    );
    const { data, error } = await this.supabaseClient
      .from("squares")
      .insert(squareData)
      .select()
      .single();

    if (error) {
      console.error(
        "SupabaseSquaresRepository: Error inserting single square:",
        error
      );
      throw error;
    }
    if (!data) {
      console.error(
        "SupabaseSquaresRepository: No data returned after inserting single square."
      );
      throw new Error("Failed to insert square: No data returned.");
    }
    console.log(
      "SupabaseSquaresRepository: Successfully inserted single square, ID:",
      data.id
    );
    return data as Square;
  }

  async insertMultipleSquares(squaresData: SquareInsert[]): Promise<Square[]> {
    if (!squaresData || squaresData.length === 0) {
      console.log(
        "SupabaseSquaresRepository: No squares data provided to insertMultipleSquares."
      );
      return [];
    }
    console.log(
      `SupabaseSquaresRepository: Attempting to batch insert ${squaresData.length} squares.`
    );

    const { data, error } = await this.supabaseClient
      .from("squares")
      .insert(squaresData)
      .select();

    if (error) {
      console.error(
        "SupabaseSquaresRepository: Error during batch insert of squares:",
        error
      );
      throw error;
    }

    console.log(
      `SupabaseSquaresRepository: Successfully batch inserted ${data?.length || 0} squares.`
    );
    return (data as Square[]) || [];
  }

  async findSquaresByHeatmapId(heatmapId: string): Promise<Square[]> {
    console.log(
      `SupabaseSquaresRepository: Finding squares for heatmapId: ${heatmapId}`
    );
    const { data, error } = await this.supabaseClient
      .from("squares")
      .select("*")
      .eq("heatmap_id", heatmapId)
      .order("date", { ascending: true });

    if (error) {
      console.error(
        `SupabaseSquaresRepository: Error finding squares for heatmapId ${heatmapId}:`,
        error
      );
      throw error;
    }
    console.log(
      `SupabaseSquaresRepository: Found ${data?.length || 0} squares for heatmapId: ${heatmapId}`
    );
    return (data as Square[]) || [];
  }

  async updateSquare(
    squareId: string,
    squareData: SquareUpdate
  ): Promise<Square> {
    console.log(
      `SupabaseSquaresRepository: Updating square with ID: ${squareId}, data:`,
      squareData
    );
    const { data, error } = await this.supabaseClient
      .from("squares")
      .update(squareData)
      .eq("id", squareId)
      .select()
      .single();

    if (error) {
      console.error(
        `SupabaseSquaresRepository: Error updating square with ID ${squareId}:`,
        error
      );
      throw error;
    }
    if (!data) {
      console.error(
        `SupabaseSquaresRepository: No data returned after updating square with ID ${squareId}.`
      );
      throw new Error("Failed to update square: No data returned.");
    }
    console.log(
      `SupabaseSquaresRepository: Successfully updated square with ID: ${squareId}`
    );
    return data as Square;
  }
}
