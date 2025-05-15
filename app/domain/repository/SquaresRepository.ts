import { Database } from "@/app/domain/database.types";

type Square = Database["public"]["Tables"]["squares"]["Row"];
type SquareInsert = Database["public"]["Tables"]["squares"]["Insert"];
type SquareUpdate = Database["public"]["Tables"]["squares"]["Update"];

export interface SquaresRepository {
  insertSquare(squareData: SquareInsert): Promise<Square>;
  insertMultipleSquares(squaresData: SquareInsert[]): Promise<Square[]>;
  findSquaresByHeatmapId(heatmapId: string): Promise<Square[]>;
  updateSquare(squareId: string, squareData: SquareUpdate): Promise<Square>;
}
