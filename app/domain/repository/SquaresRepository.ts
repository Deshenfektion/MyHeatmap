import { Database } from "@/app/domain/database.types";

type Square = Database["public"]["Tables"]["squares"]["Row"];
type SquareInsert = Database["public"]["Tables"]["squares"]["Insert"];
export interface SquaresRepository {
  insertSquare(squareData: SquareInsert): Promise<Square>;
}
