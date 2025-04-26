import { supabase } from "@/lib/supabaseClient";

export type Square = {
  id: number;
  click_count: number;
  row_id: number;
  created_at: string;
};

export type Row = {
  id: number;
  label: string;
  heatmap_id: number;
  squares: Square[];
  created_at: string;
};

export type Heatmap = {
  id: number;
  user_id: string;
  created_at: string;
};

type ServiceResponse<T> = {
  data?: T;
  error?: string;
};

async function fetchHeatmapData(
  userId: string
): Promise<ServiceResponse<{ heatmap: Heatmap; rows: Row[] }>> {
  try {
    // Get user's heatmap
    const { data: heatmap, error: heatmapError } = await supabase
      .from("heatmap")
      .select("*")
      .eq("user_id", userId);
    if (heatmapError || !heatmap) {
      return { error: heatmapError?.message || "No heatmap found" };
    }

    // Get associated rows with squares
    const { data: rows, error: rowsError } = await supabase
      .from("row")
      .select(
        `
        id,
        label,
        heatmap_id,
        created_at,
        squares:square (
          id,
          click_count,
          row_id,
          created_at
        )
      `
      )
      .eq("heatmap_id", heatmap.id);

    if (rowsError) {
      return { error: rowsError.message };
    }

    return {
      data: {
        heatmap,
        rows:
          rows?.map((row) => ({
            ...row,
            squares: row.squares || [],
          })) || [],
      },
    };
  } catch (error) {
    console.error("Fetch heatmap error:", error);
    return { error: "Failed to load heatmap data" };
  }
}

async function createNewHeatmap(
  userId: string
): Promise<ServiceResponse<Heatmap>> {
  try {
    // Create heatmap
    const { data: heatmap, error } = await supabase
      .from("heatmap")
      .insert([{ user_id: userId }])
      .select();
    if (error || !heatmap) {
      return { error: error?.message || "Failed to create heatmap" };
    }

    // Create default row
    const { data: row } = await supabase
      .from("row")
      .insert([
        {
          heatmap_id: heatmap.id,
          label: "Activity",
        },
      ])
      .select();
    if (!row) {
      await supabase.from("heatmap").delete().eq("id", heatmap.id);
      return { error: "Failed to initialize heatmap" };
    }

    // Create default square
    await supabase.from("square").insert([
      {
        row_id: row.id,
        click_count: 0,
      },
    ]);

    return { data: heatmap };
  } catch (error) {
    console.error("Create heatmap error:", error);
    return { error: "Failed to create heatmap" };
  }
}

async function incrementSquareClick(
  squareId: number,
  currentCount: number
): Promise<ServiceResponse<number>> {
  try {
    const newCount = (currentCount + 1) % 4;

    const { error } = await supabase
      .from("square")
      .update({ click_count: newCount })
      .eq("id", squareId);

    return error ? { error: error.message } : { data: newCount };
  } catch (error) {
    console.error("Increment click error:", error);
    return { error: "Failed to update square" };
  }
}

async function updateRowLabel(
  rowId: number,
  newLabel: string
): Promise<ServiceResponse<void>> {
  try {
    const { error } = await supabase
      .from("row")
      .update({ label: newLabel })
      .eq("id", rowId);

    return error ? { error: error.message } : {};
  } catch (error) {
    console.error("Update label error:", error);
    return { error: "Failed to update label" };
  }
}

async function createRow(
  heatmapId: number,
  label: string
): Promise<ServiceResponse<Row>> {
  try {
    const { data: row, error } = await supabase
      .from("row")
      .insert([{ heatmap_id: heatmapId, label }])
      .select();
    return error || !row
      ? { error: error?.message || "Failed to create row" }
      : { data: row };
  } catch (error) {
    console.error("Create row error:", error);
    return { error: "Failed to create row" };
  }
}

async function createSquare(rowId: number): Promise<ServiceResponse<Square>> {
  try {
    const { data: square, error } = await supabase
      .from("square")
      .insert([{ row_id: rowId, click_count: 0 }])
      .select();
    return error || !square
      ? { error: error?.message || "Failed to create square" }
      : { data: square };
  } catch (error) {
    console.error("Create square error:", error);
    return { error: "Failed to create square" };
  }
}

export default {
  fetchHeatmapData,
  createNewHeatmap,
  incrementSquareClick,
  updateRowLabel,
  createRow,
  createSquare,
};
