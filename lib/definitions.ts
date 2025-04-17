// lib/definitions.ts

export const click = {
  id: "UUID",
  user_id: "string", // User ID (z. B. Supabase User ID)
  row: "integer", // Zeile der Heatmap
  col: "integer", // Spalte der Heatmap
  clicks: "integer", // Anzahl der Klicks für diese Zelle
};

export const user = {
  id: "string", // User ID (automatisch von Supabase generiert)
  created_at: "timestamp", // Zeit, wann der User erstellt wurde
  updated_at: "timestamp", // Zeit der letzten Änderung
};

export const saveClick = {
  user_id: "string",
  row: "integer",
  col: "integer",
  clicks: "integer",
};
