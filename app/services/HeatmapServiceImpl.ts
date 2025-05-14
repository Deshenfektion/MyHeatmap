import { HeatmapRepository } from "../domain/repository/HeatmapRepository";
import { Database } from "@/app/domain/database.types";
import { SquaresService } from "./SquaresService";
import { HeatmapService } from "./HeatmapService";

type HeatmapInsert = Database["public"]["Tables"]["heatmaps"]["Insert"];

export class HeatmapServiceImpl implements HeatmapService {
  private repository;
  private squaresService;

  constructor(repository: HeatmapRepository, squaresService: SquaresService) {
    this.repository = repository;
    this.squaresService = squaresService;
  }

  async createHeatmap(userId: string, label: string): Promise<HeatmapInsert> {
    // 1. PRÜFEN, ob der Benutzer bereits eine Heatmap hat
    const existingHeatmap = await this.repository.findByUserId(userId); // Du brauchst diese Methode im Repository

    if (existingHeatmap) {
      // Option A: Fehler werfen
      // throw new Error(`User ${userId} already has a heatmap.`);

      // Option B: Die existierende Heatmap zurückgeben (eventuell aktualisieren?)
      console.warn(
        `User ${userId} already has a heatmap. Returning existing one or updating.`
      );
      // Hier könntest du entscheiden, die existierende Heatmap zu aktualisieren oder einfach zurückzugeben.
      // Wenn du sie aktualisieren willst, brauchst du eine update-Methode im Repository.
      // Fürs Erste geben wir sie einfach zurück, oder werfen einen Fehler.
      return existingHeatmap; // Stelle sicher, dass der Typ passt.
    }

    // 2. Wenn keine existiert, erstelle eine neue Heatmap
    const newHeatmap = await this.repository.insertHeatmap(userId, label);

    if (!newHeatmap) {
      throw new Error("Failed to create heatmap: Repository returned null.");
    }

    // 3. Erstelle die Quadrate
    await this.squaresService.createYearOfSquares(newHeatmap.id || "");

    return newHeatmap;
  }
}
