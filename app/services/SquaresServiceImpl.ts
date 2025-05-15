import { SquaresRepository } from "../domain/repository/SquaresRepository";
import { SquaresService } from "./SquaresService";
import { Database } from "../domain/database.types";

type Square = Database["public"]["Tables"]["squares"]["Row"];
type SquareInsert = Database["public"]["Tables"]["squares"]["Insert"];

export class SquaresServiceImpl implements SquaresService {
  private squaresRepository: SquaresRepository;

  constructor(repository: SquaresRepository) {
    this.squaresRepository = repository;
  }

  async createSquare(
    heatmapId: string,
    date: string,
    level: number = 0
  ): Promise<Square> {
    console.log(
      `SquaresService: Creating single square for heatmapId: ${heatmapId}, date: ${date}, level: ${level}`
    );
    if (!heatmapId) {
      console.error(
        "SquaresService: Invalid heatmapId received for createSquare."
      );
      throw new Error("Cannot create square for an invalid heatmapId.");
    }
    const squareData: SquareInsert = {
      heatmap_id: heatmapId,
      date: date,
      level: level,
    };
    return this.squaresRepository.insertSquare(squareData);
  }

  async createYearOfSquares(heatmapId: string): Promise<Square[]> {
    console.log(
      `SquaresService: Attempting to create year of squares for heatmapId: ${heatmapId}`
    );
    if (!heatmapId) {
      console.error(
        "SquaresService: Invalid heatmapId received for createYearOfSquares."
      );
      throw new Error(
        "Cannot create year of squares for an invalid heatmapId."
      );
    }

    const squaresToInsert: SquareInsert[] = [];
    const today = new Date();

    for (let i = 0; i < 365; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);

      const squareData: SquareInsert = {
        heatmap_id: heatmapId,
        date: date.toISOString().split("T")[0],
        level: 0,
      };
      squaresToInsert.push(squareData);
    }

    let insertedSquares: Square[] = [];

    if (squaresToInsert.length > 0) {
      console.log(
        `SquaresService: Attempting to batch insert ${squaresToInsert.length} squares for heatmapId: ${heatmapId}`
      );
      try {
        insertedSquares =
          await this.squaresRepository.insertMultipleSquares(squaresToInsert);
        console.log(
          `SquaresService: Successfully batch inserted ${insertedSquares.length} squares for heatmapId: ${heatmapId}`
        );
      } catch (error) {
        console.error(
          `SquaresService: Error during batch insert of squares for heatmapId ${heatmapId}:`,
          error
        );
        throw error;
      }
    } else {
      console.warn(
        `SquaresService: No squares generated to insert for heatmapId: ${heatmapId}`
      );
    }
    return insertedSquares;
  }

  async getSquaresForHeatmap(heatmapId: string): Promise<Square[]> {
    console.log(`SquaresService: Fetching squares for heatmapId: ${heatmapId}`);
    if (!heatmapId) {
      console.error(
        "SquaresService: Invalid heatmapId for getSquaresForHeatmap."
      );
      return [];
    }
    return this.squaresRepository.findSquaresByHeatmapId(heatmapId);
  }
}
