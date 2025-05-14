import { Database } from "@/app/domain/database.types";

type Square = Database["public"]["Tables"]["squares"]["Row"];

export interface SquaresRepository {
  insertSquare(heatmapId: string, date: string): Promise<Square>;
}
