import React, { useState } from "react";

type HeatmapProps = {
  rows: number;
  cols: number;
};

const MAX_CLICKS = 3;

const getColor = (clicks: number) => {
  switch (clicks) {
    case 1:
      return "bg-green-100";
    case 2:
      return "bg-green-400";
    case 3:
      return "bg-green-700";
    default:
      return "bg-white";
  }
};

const Heatmap: React.FC<HeatmapProps> = ({ rows, cols }) => {
  const [clickCounts, setClickCounts] = useState(
    Array(rows)
      .fill(null)
      .map(() => Array(cols).fill(0))
  );

  const handleClick = (row: number, col: number) => {
    setClickCounts((prev) => {
      const newGrid = prev.map((r) => [...r]);
      newGrid[row][col] = (newGrid[row][col] + 1) % (MAX_CLICKS + 1);
      return newGrid;
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <h1 className="text-2xl font-semibold mb-4">MyHeatmap</h1>
      <div
        className="grid gap-1"
        style={{ gridTemplateColumns: `repeat(${cols}, 2rem)` }}
      >
        {clickCounts.map((row, rowIndex) =>
          row.map((clicks, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`w-8 h-8 rounded-md border border-gray-300 cursor-pointer transition-all duration-200 ${getColor(
                clicks
              )}`}
              onClick={() => handleClick(rowIndex, colIndex)}
              title={`Klicks: ${clicks}`}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Heatmap;
