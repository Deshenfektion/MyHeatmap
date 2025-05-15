import React from "react";
import HeatmapSquare from "./HeatmapSquare";

const HeatmapGrid = ({
  weeks,
  weekColumnMarginRight,
  getSquareColor,
  onSquareClick,
}: {
  weeks: any[][];
  weekColumnMarginRight: number;
  getSquareColor: (level: number, isBlank?: boolean) => string;
  onSquareClick: (squareData: any) => void;
}) => (
  <div className="flex flex-row">
    {weeks.map((weekData, weekIdx) => (
      <div
        key={weekIdx}
        className="flex flex-col"
        style={{
          marginRight:
            weekIdx < weeks.length - 1 ? `${weekColumnMarginRight}px` : "0px",
        }}
      >
        {weekData.map((day) => (
          <HeatmapSquare
            key={day.id}
            day={day}
            getSquareColor={getSquareColor}
            onSquareClick={onSquareClick}
          />
        ))}
      </div>
    ))}
  </div>
);

export default HeatmapGrid;
