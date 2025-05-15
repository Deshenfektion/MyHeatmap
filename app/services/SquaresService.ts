import { Database } from "../domain/database.types";
import { SquaresRepository } from "../domain/repository/SquaresRepository";

type Square = Database["public"]["Tables"]["squares"]["Row"];
type SquareInsert = Database["public"]["Tables"]["squares"]["Insert"];
type SquareUpdate = Database["public"]["Tables"]["squares"]["Update"];

export interface SquaresService {
  createSquare(heatmapId: string, date: string): Promise<SquareInsert>;

  createYearOfSquares(heatmapId: string): Promise<SquareInsert[]>;

  getSquaresForHeatmap(heatmapId: string): Promise<Square[]>;

  insertSquare(squareData: SquareInsert): Promise<Square>;

  insertMultipleSquares(squaresData: SquareInsert[]): Promise<Square[]>;

  updateSquare(squareId: string, squareData: SquareUpdate): Promise<Square>;
}
