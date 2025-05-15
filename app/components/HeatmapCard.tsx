import React from "react";

import { Database } from "../domain/database.types";
import DayLabels from "./DayLabels";
import HeatmapGrid from "./HeatmapGrid";
import MonthLabels from "./MonthLabels";

type Heatmap = Database["public"]["Tables"]["heatmaps"]["Row"];

const HeatmapCard = ({
  heatmap,
  gridData,
  collapsed,
  onToggleCollapse,
  onSquareClick,
}: {
  heatmap: Heatmap;
  gridData: any;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onSquareClick: (squareData: any) => void;
}) => {
  const dayLabelWidth = 28;
  const squareSize = 16;
  const squareMargin = 1;
  const weekColumnMarginRight = 2;
  const effectiveSquareWidthWithMargins = squareSize + squareMargin * 2;
  const weekColumnWidth = effectiveSquareWidthWithMargins;
  const totalGridWidth =
    53 * (weekColumnWidth + weekColumnMarginRight) - weekColumnMarginRight;

  const getSquareColor = (level: number, isBlank?: boolean) => {
    if (isBlank) {
      return "bg-neutral-100"; // For empty cells (past, no data, or future)
    }
    switch (level) {
      case 0:
        return "bg-neutral-200"; // Activity recorded, level 0
      case 1:
        return "bg-purple-300";
      case 2:
        return "bg-purple-500";
      case 3:
        return "bg-purple-800";
      default:
        return "bg-neutral-100";
    }
  };

  return (
    <div className="mb-8">
      <div
        className="flex items-center cursor-pointer text-xl font-bold mb-4"
        onClick={onToggleCollapse}
        title={`Created at: ${new Date(heatmap.created_at).toLocaleDateString()}`}
      >
        <span className="mr-2">{collapsed ? "▶" : "▼"}</span>
        {heatmap.label || "Unnamed Heatmap"}
      </div>
      {!collapsed && gridData && (
        <div className="flex flex-col items-start">
          <MonthLabels
            monthMarkers={gridData.monthMarkers}
            totalGridWidth={totalGridWidth}
            dayLabelWidth={dayLabelWidth}
            weekColumnWidth={weekColumnWidth}
            weekColumnMarginRight={weekColumnMarginRight}
          />
          <div className="flex flex-row">
            <DayLabels
              effectiveSquareWidthWithMargins={effectiveSquareWidthWithMargins}
              dayLabelWidth={dayLabelWidth}
            />
            <HeatmapGrid
              weeks={gridData.weeks}
              weekColumnMarginRight={weekColumnMarginRight}
              getSquareColor={getSquareColor}
              onSquareClick={onSquareClick}
            />
          </div>
        </div>
      )}
      {!collapsed && !gridData && <div>Preparing heatmap data...</div>}
    </div>
  );
};

export default HeatmapCard;
