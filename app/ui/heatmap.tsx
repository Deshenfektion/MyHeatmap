import { useEffect, useState } from "react";
import {
  fetchHeatmapData,
  incrementSquareClick,
  updateRowLabel,
} from "@/lib/heatmapService";
import Square from "./square";

type HeatmapProps = {
  userId: string;
};

const Heatmap: React.FC<HeatmapProps> = ({ userId }) => {
  const [heatmapRows, setHeatmapRows] = useState<
    {
      id: number;
      label: string;
      squares: { id: number; click_count: number }[];
    }[]
  >([]);

  useEffect(() => {
    const loadData = async () => {
      const { rows, error } = await fetchHeatmapData(userId);
      if (!error && rows) {
        setHeatmapRows(rows);
      }
    };

    loadData();
  }, [userId]);

  const handleSquareClick = async (rowIndex: number, squareIndex: number) => {
    const square = heatmapRows[rowIndex].squares[squareIndex];
    const { newCount, error } = await incrementSquareClick(
      square.id,
      square.click_count
    );

    if (!error) {
      setHeatmapRows((prev) => {
        const updated = [...prev];
        updated[rowIndex].squares[squareIndex].click_count = newCount;
        return updated;
      });
    }
  };

  const handleRowLabelChange = async (index: number, newLabel: string) => {
    const rowId = heatmapRows[index].id;
    const { error } = await updateRowLabel(rowId, newLabel);

    if (!error) {
      setHeatmapRows((prev) => {
        const updated = [...prev];
        updated[index].label = newLabel;
        return updated;
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-semibold mb-4">MyHeatmap</h1>
      <div className="flex flex-col gap-2">
        {heatmapRows.map((row, rowIndex) => (
          <div key={row.id} className="flex items-center gap-2">
            <input
              value={row.label}
              onChange={(e) => handleRowLabelChange(rowIndex, e.target.value)}
              className="h-8 text-sm text-right pr-2 border rounded px-1 w-24"
            />
            <div className="flex gap-1">
              {row.squares.map((square, squareIndex) => (
                <Square
                  key={square.id}
                  squareId={square.id}
                  clicks={square.click_count}
                  onClick={() => handleSquareClick(rowIndex, squareIndex)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Heatmap;
