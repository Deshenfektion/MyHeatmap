import React from "react";

const HeatmapSquare = ({
  day,
  getSquareColor,
  onSquareClick,
}: {
  day: any;
  getSquareColor: (level: number, isBlank?: boolean) => string;
  onSquareClick: (squareData: any) => void;
}) => (
  <div
    className={`w-4 h-4 m-px border border-neutral-200 cursor-pointer ${getSquareColor(
      day.level,
      day.isBlank
    )}`}
    title={`Date: ${
      day.date ? new Date(day.date).toLocaleDateString() : "No date"
    }, Level: ${day.level}${day.isBlank ? " (No data)" : ""}`}
    onClick={() => onSquareClick(day)}
  />
);

export default HeatmapSquare;
