import { Database } from "@/app/domain/database.types";
import { HeatmapService } from "./HeatmapService";
import { HeatmapRepository } from "../domain/repository/HeatmapRepository";
import { SquaresService } from "./SquaresService";

type HeatmapInsert = Database["public"]["Tables"]["heatmaps"]["Insert"];
type Heatmap = Database["public"]["Tables"]["heatmaps"]["Row"];

export class HeatmapServiceImpl implements HeatmapService {
  private heatmapRepository: HeatmapRepository;
  private squaresService: SquaresService;

  constructor(repository: HeatmapRepository, squaresService: SquaresService) {
    this.heatmapRepository = repository;
    this.squaresService = squaresService;
  }

  async createHeatmap(userId: string, label: string): Promise<Heatmap> {
    console.log(
      `HeatmapService: Attempting to create heatmap for userId: ${userId}, label: ${label}`
    );
    // Die Prüfung auf eine existierende Heatmap wird entfernt, da ein User mehrere haben kann.
    // Jedes Mal, wenn diese Funktion aufgerufen wird, wird eine NEUE Heatmap erstellt.

    console.log(
      `HeatmapService: Creating new heatmap for userId: ${userId}, label: ${label}.`
    );
    const newHeatmap = await this.heatmapRepository.insertHeatmap(
      userId,
      label
    );

    if (!newHeatmap || !newHeatmap.id) {
      console.error(
        "HeatmapService: Failed to create heatmap or heatmap ID is missing. Repository returned:",
        newHeatmap
      );
      throw new Error(
        "Failed to create heatmap or heatmap ID is missing: Repository returned invalid data."
      );
    }
    console.log(
      `HeatmapService: Successfully created heatmap with ID: ${newHeatmap.id}`
    );

    // Erstelle die Quadrate für die NEUE Heatmap
    console.log(
      `HeatmapService: Attempting to create year of squares for new heatmap ID: ${newHeatmap.id}`
    );
    try {
      // Annahme: createYearOfSquares gibt Promise<Square[]> zurück, wenn die Squares benötigt werden.
      // Wenn nicht, kann der Rückgabewert ignoriert werden.
      await this.squaresService.createYearOfSquares(newHeatmap.id);
      console.log(
        `HeatmapService: Successfully created squares for heatmap ID: ${newHeatmap.id}`
      );
    } catch (squaresError) {
      console.error(
        `HeatmapService: Error creating squares for heatmap ID ${newHeatmap.id}:`,
        squaresError
      );
      // Überlege dir eine Strategie: Soll die Heatmap gelöscht werden, wenn Squares nicht erstellt werden können?
      // Fürs Erste werfen wir den Fehler weiter und die Heatmap würde ohne Squares bestehen bleiben.
      throw squaresError;
    }

    return newHeatmap; // Gib die neu erstellte Heatmap zurück
  }
  // Du benötigst wahrscheinlich noch eine Methode, um ALLE Heatmaps eines Users zu laden, z.B.:
  // async getHeatmapsByUserId(userId: string): Promise<Heatmap[]> {
  //   return this.heatmapRepository.findAllByUserId(userId); // Diese Methode müsste im Repository existieren
  // }
}
