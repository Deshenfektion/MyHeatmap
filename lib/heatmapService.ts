// lib/heatmapService.ts
import { supabase } from "@/lib/supabaseClient";

// Hole alle Squares für eine bestimmte Heatmap
export async function fetchHeatmapData(userId: string) {
  const { data: heatmap, error: heatmapError } = await supabase
    .from("heatmap")
    .select("id")
    .eq("user_id", userId)
    .single();

  if (heatmapError || !heatmap)
    return { error: heatmapError || "No heatmap found for this user" };

  const { data: rows, error: rowsError } = await supabase
    .from("row")
    .select("id, label, square(id, click_count)")
    .eq("heatmap_id", heatmap.id);

  if (rowsError) return { error: rowsError };

  return { heatmapId: heatmap.id, rows };
}

// Klick speichern (hochzählen)
export async function incrementSquareClick(
  squareId: number,
  currentCount: number
) {
  const newCount = (currentCount + 1) % 4;

  const { error } = await supabase
    .from("square")
    .update({ click_count: newCount })
    .eq("id", squareId);

  return { error, newCount };
}

// Label aktualisieren
export async function updateRowLabel(rowId: number, newLabel: string) {
  const { error } = await supabase
    .from("row")
    .update({ label: newLabel })
    .eq("id", rowId);

  return { error };
}
