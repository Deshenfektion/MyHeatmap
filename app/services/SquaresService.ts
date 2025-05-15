import { Database } from "../domain/database.types";

type Square = Database["public"]["Tables"]["squares"]["Row"];
type SquareInsert = Database["public"]["Tables"]["squares"]["Insert"];

export interface SquaresService {
  createSquare(heatmapId: string, date: string): Promise<SquareInsert>;

  createYearOfSquares(heatmapId: string): Promise<SquareInsert[]>;

  getSquaresForHeatmap(heatmapId: string): Promise<Square[]>;
}
