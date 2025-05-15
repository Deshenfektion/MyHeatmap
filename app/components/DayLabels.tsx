import React from "react";

const DayLabels = ({
  effectiveSquareWidthWithMargins,
  dayLabelWidth,
}: {
  effectiveSquareWidthWithMargins: number;
  dayLabelWidth: number;
}) => (
  <div
    className="flex flex-col text-xs text-gray-400 mr-2 justify-around items-start"
    style={{
      height: `${7 * effectiveSquareWidthWithMargins}px`,
      width: `${dayLabelWidth}px`,
    }}
  >
    <span className="h-2.5 leading-none"></span>
    <span className="h-2.5 leading-none">Mon</span>
    <span className="h-2.5 leading-none"></span>
    <span className="h-2.5 leading-none">Wed</span>
    <span className="h-2.5 leading-none"></span>
    <span className="h-2.5 leading-none">Fri</span>
    <span className="h-2.5 leading-none"></span>
  </div>
);

export default DayLabels;
