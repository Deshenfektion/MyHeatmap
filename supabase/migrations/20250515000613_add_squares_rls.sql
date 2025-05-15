-- Zuerst alte Policies löschen, falls doch welche existieren und nicht im Dump waren (sicher ist sicher)
DROP POLICY IF EXISTS "Allow user to manage their own squares" ON public.squares;
-- Oder wie auch immer eine eventuell existierende Policy heißt

-- Neue Policy erstellen
CREATE POLICY "Allow user to manage their own squares"
ON public.squares
FOR ALL -- Gilt für SELECT, INSERT, UPDATE, DELETE
USING (
  -- Der Benutzer kann Squares sehen/bearbeiten, wenn die heatmap_id des Squares
  -- zu einer Heatmap gehört, die dem Benutzer gehört.
  EXISTS (
    SELECT 1
    FROM public.heatmaps h
    WHERE h.id = squares.heatmap_id AND h.user_id = auth.uid()
  )
)
WITH CHECK (
  -- Beim Einfügen/Aktualisieren muss sichergestellt werden, dass die heatmap_id des Squares
  -- zu einer Heatmap gehört, die dem Benutzer gehört.
  EXISTS (
    SELECT 1
    FROM public.heatmaps h
    WHERE h.id = squares.heatmap_id AND h.user_id = auth.uid()
  )
);