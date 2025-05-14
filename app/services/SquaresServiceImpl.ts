import { SquaresRepository } from "../domain/repository/SquaresRepository";
import { SquaresService } from "./SquaresService";
import { Database } from "../domain/database.types";

type SquareInsert = Database["public"]["Tables"]["squares"]["Insert"];

export class SquaresServiceImpl implements SquaresService {
  private repository;

  constructor(repository: SquaresRepository) {
    this.repository = repository;
  }

  async createSquare(heatmapId: string, date: string): Promise<SquareInsert> {
    const square = this.repository.insertSquare(heatmapId, date);
    return square;
  }

  async createYearOfSquares(heatmapId: string): Promise<SquareInsert[]> {
    const squares: SquareInsert[] = [];
    const startDate = new Date("2025-01-01");

    for (let i = 0; i < 365; i++) {
      const date = startDate;
      date.setDate(date.getDate() + i);

      const square = await this.createSquare(
        heatmapId,
        date.toISOString().split("T")[0]
      );

      squares.push(square);
    }
    return squares;
  }
}
