import React from "react";

const MonthLabels = ({
  monthMarkers,
  totalGridWidth,
  dayLabelWidth,
  weekColumnWidth,
  weekColumnMarginRight,
}: {
  monthMarkers: { label: string; weekIndex: number }[];
  totalGridWidth: number;
  dayLabelWidth: number;
  weekColumnWidth: number;
  weekColumnMarginRight: number;
}) => (
  <div
    className="relative h-4 mb-1"
    style={{
      width: `${totalGridWidth}px`,
      marginLeft: `${dayLabelWidth}px`,
    }}
  >
    {monthMarkers.map((marker) => (
      <span
        key={`${marker.label}-${marker.weekIndex}`}
        className="absolute text-s font-bold text-gray-500"
        style={{
          left: `${marker.weekIndex * (weekColumnWidth + weekColumnMarginRight)}px`,
          top: "-4px",
          transform: "translateX(-50%)",
        }}
      >
        {marker.label}
      </span>
    ))}
  </div>
);

export default MonthLabels;
