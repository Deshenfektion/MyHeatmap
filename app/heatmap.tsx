import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import "./globals.css";

const MAX_CLICKS = 3;

const getColor = (clicks: number) => {
  switch (clicks) {
    case 1:
      return "bg-green-100 dark:bg-green-900";
    case 2:
      return "bg-green-400 dark:bg-green-700";
    case 3:
      return "bg-green-700 dark:bg-green-500";
    default:
      return "bg-white dark:bg-gray-800";
  }
};

type SquareProps = {
  clicks: number;
  onClick: () => void;
};

const Square: React.FC<SquareProps> = ({ clicks, onClick }) => {
  return (
    <div
      className={`w-8 h-8 rounded-md border border-gray-300 dark:border-gray-600 cursor-pointer transition-all duration-200 ${getColor(
        clicks
      )}`}
      onClick={onClick}
      title={`Klicks: ${clicks}`}
    />
  );
};

const Heatmap: React.FC<{
  userId: string;
  rows: number;
  cols: number;
  rowLabels: string[];
}> = ({ userId, rows, cols, rowLabels }) => {
  const [clickCounts, setClickCounts] = useState(
    Array(rows)
      .fill(null)
      .map(() => Array(cols).fill(0))
  );

  const saveClickData = async (
    userId: string,
    row: number,
    col: number,
    click: number
  ) => {
    const { data, error } = await supabase
      .from("heatmap_data")
      .upsert([{ user_id: userId, row, col, click }], {
        onConflict: "user_id,row,col",
      });

    if (error) console.error(error);
    return data;
  };

  const handleClick = (row: number, col: number) => {
    setClickCounts((prev) => {
      const newGrid = prev.map((r) => [...r]);
      newGrid[row][col] = (newGrid[row][col] + 1) % (MAX_CLICKS + 1);

      saveClickData(userId, row, col, newGrid[row][col]);

      return newGrid;
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("heatmap_data")
        .select("*")
        .eq("user_id", userId);

      if (error) {
        console.error(error);
      } else {
        const newGrid = Array(rows)
          .fill(null)
          .map(() => Array(cols).fill(0));
        data?.forEach((entry: any) => {
          newGrid[entry.row][entry.col] = entry.click;
        });
        setClickCounts(newGrid);
      }
    };
    fetchData();
  }, [userId, rows, cols]);

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-semibold mb-4">MyHeatmap</h1>
        <div className="flex">
          {/* Row Labels */}
          <div className="flex flex-col items-end pr-4">
            {rowLabels.map((label, index) => (
              <div
                key={`label-${index}`}
                className="h-8 flex items-center text-sm"
              >
                {label}
              </div>
            ))}
          </div>

          {/* Heatmap Grid */}
          <div
            className="grid gap-1"
            style={{ gridTemplateColumns: `repeat(${cols}, 2rem)` }}
          >
            {clickCounts.map((row, rowIndex) =>
              row.map((clicks, colIndex) => (
                <Square
                  key={`cell-${rowIndex}-${colIndex}`}
                  clicks={clicks}
                  onClick={() => handleClick(rowIndex, colIndex)}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Heatmap;
