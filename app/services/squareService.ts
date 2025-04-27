'use server';

import { createClient } from "@/utils/supabase/server";

export async function updateSquareLevel(squareId: string, newLevel: number) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("heatmap_squares")
    .update({ level: newLevel })
    .eq("id", squareId);

  if (error) {
    console.error("Error updating square level:", error.message);
    throw new Error("Failed to update square level");
  }

  return data;
}