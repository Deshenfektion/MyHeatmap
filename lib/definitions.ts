// lib/definitions.ts

export const click = {
  id: "UUID", // Eindeutiger Bezeichner für den Klick
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
  user_id: "string", // User ID
  row: "integer", // Zeile der Heatmap
  col: "integer", // Spalte der Heatmap
  clicks: "integer", // Anzahl der Klicks für diese Zelle
};

export const heatmapData = {
  id: "UUID", // Eindeutiger Bezeichner für die Heatmap-Daten
  user_id: "string", // User ID (verknüpft mit der User-Tabelle)
  row: "integer", // Zeile der Heatmap
  col: "integer", // Spalte der Heatmap
  clicks: "integer", // Anzahl der Klicks in dieser Zelle
  created_at: "timestamp", // Zeit, wann die Heatmap-Daten gespeichert wurden
  updated_at: "timestamp", // Zeit der letzten Änderung der Heatmap-Daten
};
