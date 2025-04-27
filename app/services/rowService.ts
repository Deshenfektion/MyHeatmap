// app/services/rowService.ts
'use server'; // Markiert alle exportierten Funktionen als Server Actions

import { Database } from '@/types/database.types';
// ACHTUNG: Dies sollte idealerweise ein Server-Client sein!
// Importiere die korrekte Funktion zum Erstellen eines Server-Clients.
// z.B. import { createServerActionClient } from '@/lib/supabase/server';
import { createClient } from '@/utils/supabase/server'; // <- Passe dies an!
import { revalidatePath } from 'next/cache';

type HeatmapSquare = Database['public']['Tables']['heatmap_squares']['Row'];

/**
 * Ruft alle Quadrate für eine bestimmte Zeilen-ID ab, sortiert nach Position.
 * @param rowId Die ID der Heatmap-Zeile.
 * @returns Ein Array von Heatmap-Quadraten.
 */
export async function getSquaresForRow(rowId: string): Promise<HeatmapSquare[]> {
  //const supabase = createServerActionClient(); // Empfohlene Methode
  const supabase = await createClient(); // Deine aktuelle Methode (anpassen!)

  const { data, error } = await supabase
    .from('heatmap_squares')
    .select('*')
    .eq('row_id', rowId)
    .order('position', { ascending: true }); // Sortieren nach Position

  if (error) {
    console.error('Error fetching squares for row:', error.message);
    throw new Error(`Failed to fetch squares for row ${rowId}`);
  }

  return data || [];
}

/**
 * Fügt ein neues Quadrat am Ende einer bestimmten Zeile hinzu.
 * @param rowId Die ID der Heatmap-Zeile, zu der das Quadrat hinzugefügt werden soll.
 * @returns Das neu erstellte Heatmap-Quadrat.
 */
export async function addSquareToRow(rowId: string): Promise<HeatmapSquare | null> {
  // const supabase = createServerActionClient(); // Empfohlene Methode
  const supabase = await createClient(); // Deine aktuelle Methode (anpassen!)

  try {
    // 1. Finde die höchste aktuelle Position in dieser Zeile
    const { data: lastSquare, error: positionError } = await supabase
      .from('heatmap_squares')
      .select('position')
      .eq('row_id', rowId)
      .order('position', { ascending: false }) // Höchste zuerst
      .limit(1) // Nur die höchste
      .maybeSingle(); // Gibt null zurück, wenn keine Quadrate vorhanden sind

    if (positionError) {
      console.error('Error finding last position:', positionError.message);
      throw new Error('Could not determine next position for the new square.');
    }

    // Nächste Position = höchste Position + 1 (oder 0, wenn es die erste ist)
    const nextPosition = (lastSquare?.position ?? -1) + 1;

    // 2. Füge das neue Quadrat mit der nächsten Position ein
    const { data: newSquare, error: insertError } = await supabase
      .from('heatmap_squares')
      .insert({
        row_id: rowId,
        position: nextPosition,
        level: 0, // Neues Quadrat startet bei Level 0 (weiß)
      })
      .select() // Gibt das eingefügte Objekt zurück
      .single(); // Erwarten genau ein Ergebnis

    if (insertError) {
      console.error('Error inserting new square:', insertError.message);
      throw new Error('Failed to add new square to the row.');
    }

    console.log(`Added new square with position ${nextPosition} to row ${rowId}`);
    
    // Optional aber empfohlen: Revalidiere den Pfad, damit die UI aktualisiert wird
    // Passe den Pfad an, wo deine Heatmap angezeigt wird, z.B. '/heatmap'
    revalidatePath('/heatmap'); // Oder spezifischerer Pfad

    return newSquare;

  } catch (error) {
      console.error("Failed to add square:", error);
      // Stelle sicher, dass der Fehler weitergegeben wird oder gib null zurück
      throw error; // Oder return null; je nachdem wie du es handhaben willst
  }
}

// --- Ergänzung für Square.tsx Update ---
// Es ist besser, die Revalidierung auch nach dem Update eines Squares auszulösen.
// Du kannst entweder die updateSquareLevel Funktion hierher verschieben oder
// revalidatePath im squareService hinzufügen. Beispiel für hier:

import { updateSquareLevel as originalUpdateSquareLevel } from '@/app/services/squareService';

export async function updateSquareLevelAndRevalidate(squareId: string, newLevel: number) {
    const result = await originalUpdateSquareLevel(squareId, newLevel);
    // Passe den Pfad an, wo deine Heatmap angezeigt wird, z.B. '/heatmap'
    revalidatePath('/heatmap'); // Oder spezifischerer Pfad
    return result;
}