// app/services/heatmapService.ts
'use server';

import { Database } from '@/types/database.types';
// WICHTIG: Server Actions und Server Components benötigen einen SERVER-seitigen Supabase Client!
// Passe diesen Import an deine tatsächliche Implementierung an (idealerweise aus lib/supabase/server.ts)
import { createClient } from '@/utils/supabase/server'; // <- Annahme, dass dies der Server-Client ist
import { revalidatePath } from 'next/cache';

// Definiere einen Typ für eine Zeile inklusive ihrer Quadrate
export type RowWithSquares = Database['public']['Tables']['heatmap_rows']['Row'] & {
  heatmap_squares: Database['public']['Tables']['heatmap_squares']['Row'][];
};

/**
 * Lädt die Heatmap-Daten (Zeilen und zugehörige Quadrate) für den aktuell angemeldeten Benutzer.
 * @returns Ein Array von Zeilen, wobei jede Zeile ihre Quadrate enthält, oder null bei Fehlern.
 */
export async function getUserHeatmapData(): Promise<RowWithSquares[] | null> {
  const supabase = await createClient(); // Server-Client für Datenabfragen

  // 1. Benutzer-ID holen
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error('Error fetching user or user not found:', userError?.message);
    // Nicht eingeloggt oder Fehler -> keine Daten
    return null;
  }

  try {
    // 2. Heatmap-ID des Benutzers holen
    const { data: heatmap, error: heatmapError } = await supabase
      .from('heatmaps')
      .select('id')
      .eq('user_id', user.id)
      .single(); // Erwarte genau eine Heatmap pro User

    if (heatmapError) {
        if (heatmapError.code === 'PGRST116') {
            // PGRST116: Row not found - Der User hat noch keine Heatmap.
            console.log(`No heatmap found for user ${user.id}. Returning empty array.`);
            // Es ist kein Fehler, wenn der User noch keine Heatmap hat. Leeres Array zurückgeben.
            return [];
        }
        // Anderer Fehler beim Holen der Heatmap
        console.error('Error fetching heatmap ID:', heatmapError.message);
        throw new Error('Could not fetch heatmap ID.');
    }

    if (!heatmap) {
        // Sollte durch .single() und PGRST116 abgedeckt sein, aber sicherheitshalber
        console.log(`No heatmap found for user ${user.id}. Returning empty array.`);
        return [];
    }

    const userHeatmapId = heatmap.id;

    // 3. Lade alle Zeilen der Heatmap UND deren Quadrate mit einem JOIN
    const { data: rowsWithSquares, error: rowsError } = await supabase
      .from('heatmap_rows')
      .select(`
        *,
        heatmap_squares ( * )
      `) // Wähle alle Felder der Zeile und alle Felder der zugehörigen Quadrate
      .eq('heatmap_id', userHeatmapId) // Nur Zeilen dieser Heatmap
      .order('order', { ascending: true }) // Sortiere Zeilen nach 'order'
      .order('position', { foreignTable: 'heatmap_squares', ascending: true }); // Sortiere Quadrate innerhalb jeder Zeile

    if (rowsError) {
      console.error('Error fetching rows with squares:', rowsError.message);
      throw new Error('Could not fetch heatmap rows and squares.');
    }

    // Stelle sicher, dass heatmap_squares immer ein Array ist (auch wenn leer)
    const ensuredData = rowsWithSquares.map(row => ({
        ...row,
        heatmap_squares: row.heatmap_squares || []
    }));

    return ensuredData;

  } catch (error) {
    console.error('An error occurred in getUserHeatmapData:', error);
    return null; // Gib null zurück, um auf der UI einen Fehlerzustand anzuzeigen
  }
}

/**
 * Fügt eine neue Zeile zur Heatmap des aktuellen Benutzers hinzu.
 * @param label Das Label für die neue Zeile.
 * @param newOrder Optional: Die Ordnungsposition für die neue Zeile.
 * @returns Die neu erstellte Zeile oder null bei Fehlern.
 */
export async function addRowToHeatmap(
    label: string,
    newOrder?: number
): Promise<Database['public']['Tables']['heatmap_rows']['Row'] | null> {
  const supabase = await createClient(); // Server-Client für Mutationen (Actions)

  // 1. Benutzer-ID holen
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error('Error fetching user or user not authenticated:', userError?.message);
    throw new Error("User not authenticated");
  }

  try {
    // 2. Heatmap-ID des Benutzers holen (oder erstellen, falls nicht vorhanden?)
    // Hier gehen wir davon aus, dass die Heatmap existiert, wenn der User Daten sieht.
    const { data: heatmap, error: heatmapError } = await supabase
      .from('heatmaps')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (heatmapError || !heatmap) {
      console.error('Error fetching heatmap ID for adding row:', heatmapError?.message);
      throw new Error('Could not find heatmap for the user.');
    }

    const userHeatmapId = heatmap.id;

    // 3. Neue Zeile einfügen
    const { data: newRow, error: insertError } = await supabase
      .from('heatmap_rows')
      .insert({
        heatmap_id: userHeatmapId,
        label: label,
        order: newOrder ?? 0, // Standardwert 0, wenn nicht angegeben
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error inserting new row:', insertError.message);
      throw new Error('Failed to add new row.');
    }

    console.log(`Added new row "${label}" to heatmap ${userHeatmapId}`);

    // 4. Pfad revalidieren, damit die UI die neue Zeile anzeigt
    revalidatePath('/'); // Revalidiere die Hauptseite (oder wo die Heatmap angezeigt wird)

    return newRow;

  } catch (error) {
    console.error('Failed to add row:', error);
     // Stelle sicher, dass der Fehler weitergegeben wird oder gib null zurück
    throw error; // Oder return null;
  }
}

// Initialisiere die Heatmap für einen neuen Benutzer, falls sie noch nicht existiert.
// Diese Funktion könnte beim ersten Login oder auf Anforderung aufgerufen werden.
export async function initializeHeatmapForUser(): Promise<Database['public']['Tables']['heatmaps']['Row'] | null> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error("User not authenticated");

    // Prüfen, ob schon eine Heatmap existiert
    const { data: existingHeatmap, error: fetchError } = await supabase
        .from('heatmaps')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle(); // maybeSingle gibt null zurück, wenn nichts gefunden wird

    if (fetchError && fetchError.code !== 'PGRST116') { // Ignoriere 'Row not found'
        console.error("Error checking for existing heatmap:", fetchError);
        throw fetchError;
    }

    if (existingHeatmap) {
        console.log("Heatmap already exists for user.");
        return existingHeatmap; // Gebe die existierende zurück
    }

    // Heatmap existiert nicht, also erstellen
    console.log("No heatmap found, creating one for user:", user.id);
    const { data: newHeatmap, error: insertError } = await supabase
        .from('heatmaps')
        .insert({ user_id: user.id })
        .select()
        .single();

    if (insertError) {
        console.error("Error creating heatmap for user:", insertError);
        throw insertError;
    }

    console.log("Successfully created heatmap for user:", user.id);
    return newHeatmap;
}