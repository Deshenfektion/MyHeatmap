"use client";

import React, { useEffect, useState } from "react";
import { useServices } from "../contexts/ServiceContext";
import { Database } from "../domain/database.types";
import { useAuthContext } from "../contexts/AuthContext";

type Heatmap = Database["public"]["Tables"]["heatmaps"]["Row"];
type Square = Database["public"]["Tables"]["squares"]["Row"];

// Helper function to prepare data for the yearly grid view
const prepareYearGridData = (
  squaresFromService: Square[],
  today: Date = new Date()
) => {
  const squaresMap = new Map(
    squaresFromService.map((s) => [
      s.date ? new Date(s.date).toDateString() : "",
      s,
    ])
  );

  const gridCells: Array<{
    date: string;
    level: number;
    id: string;
    originalSquare?: Square;
    isBlank: boolean;
    dayOfWeek: number;
    month: number;
    year: number;
  }> = [];

  let lastDateInGrid = new Date(today);

  let startDateInGrid = new Date(lastDateInGrid);
  startDateInGrid.setDate(startDateInGrid.getDate() - 364); // Go back 365 days (covers 52 weeks + 1 day)
  startDateInGrid.setDate(startDateInGrid.getDate() - startDateInGrid.getDay()); // Align to Sunday of that week

  let currentDate = new Date(startDateInGrid);
  const numDaysToDisplay = 53 * 7; // Display 53 weeks

  for (let i = 0; i < numDaysToDisplay; i++) {
    const dateStr = currentDate.toDateString();
    const isoDateStr = currentDate.toISOString().split("T")[0];
    const originalSquare = squaresMap.get(dateStr);

    const isPastDayWithoutData =
      !originalSquare &&
      currentDate <= lastDateInGrid &&
      currentDate >=
        new Date(
          new Date(lastDateInGrid).setDate(lastDateInGrid.getDate() - 364)
        );
    const isFutureDay = currentDate > lastDateInGrid;
    const isOutsideRelevantYearRange =
      currentDate <
      new Date(
        new Date(lastDateInGrid).setDate(lastDateInGrid.getDate() - 364)
      );

    const isBlankCell =
      isPastDayWithoutData || isFutureDay || isOutsideRelevantYearRange;

    gridCells.push({
      date: isoDateStr,
      level: originalSquare ? originalSquare.level : 0,
      id: originalSquare ? originalSquare.id : `placeholder-${isoDateStr}`,
      originalSquare: originalSquare,
      isBlank: isBlankCell,
      dayOfWeek: currentDate.getDay(),
      month: currentDate.getMonth(),
      year: currentDate.getFullYear(),
    });
    currentDate.setDate(currentDate.getDate() + 1);
  }

  const weeks: GridCell[][] = [];
  for (let i = 0; i < gridCells.length; i += 7) {
    weeks.push(gridCells.slice(i, i + 7));
  }

  // Center month label above the squares that belong to that month
  type GridCell = {
    date: string;
    level: number;
    id: string;
    originalSquare?: Square;
    isBlank: boolean;
    dayOfWeek: number;
    month: number;
    year: number;
  };
  const monthMarkers: { label: string; weekIndex: number }[] = [];
  const monthToWeeks: Record<string, number[]> = {};
  (weeks as GridCell[][]).forEach((week, weekIdx) => {
    week.forEach((day: GridCell) => {
      if (!day.isBlank) {
        const monthKey = `${day.year}-${day.month}`;
        if (!monthToWeeks[monthKey]) monthToWeeks[monthKey] = [];
        if (!monthToWeeks[monthKey].includes(weekIdx)) {
          monthToWeeks[monthKey].push(weekIdx);
        }
      }
    });
  });
  Object.entries(monthToWeeks).forEach(([monthKey, weekIndices]) => {
    weekIndices.sort((a, b) => a - b);
    const centerIdx = weekIndices[Math.floor(weekIndices.length / 2)];
    // Get a sample day from the first week of this month for the label
    const sampleDay = (weeks as GridCell[][])[weekIndices[0]].find(
      (d: GridCell) => `${d.year}-${d.month}` === monthKey && !d.isBlank
    );
    if (sampleDay) {
      const monthName = new Date(sampleDay.date).toLocaleString("default", {
        month: "short",
      });
      monthMarkers.push({
        label: monthName,
        weekIndex: centerIdx,
      });
    }
  });

  return { weeks, monthMarkers };
};

const Heatmap: React.FC = () => {
  const { heatmapService, squaresService } = useServices();
  const [heatmaps, setHeatmaps] = useState<Heatmap[]>([]);
  const [squaresByHeatmap, setSquaresByHeatmap] = useState<
    Record<string, Square[]>
  >({});
  const [processedHeatmapData, setProcessedHeatmapData] = useState<
    Record<string, ReturnType<typeof prepareYearGridData>>
  >({});
  const [collapsedHeatmaps, setCollapsedHeatmaps] = useState<Set<string>>(
    new Set()
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthContext();

  useEffect(() => {
    const fetchHeatmapsAndSquares = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const allHeatmaps = await heatmapService.getHeatmapsByUserId(
          user?.id || ""
        );
        setHeatmaps(allHeatmaps);

        // Fetch squares for each heatmap
        const squaresData: Record<string, Square[]> = {};
        for (const heatmap of allHeatmaps) {
          const heatmapSquares = await squaresService.getSquaresForHeatmap(
            heatmap.id
          );
          // Sort squares by date ascending, handling possible null dates
          heatmapSquares.sort((a, b) => {
            const dateA = a.date ? new Date(a.date).getTime() : 0;
            const dateB = b.date ? new Date(b.date).getTime() : 0;
            return dateA - dateB;
          });
          squaresData[heatmap.id] = heatmapSquares;
        }
        setSquaresByHeatmap(squaresData);

        // Initially collapse all heatmaps
        setCollapsedHeatmaps(new Set(allHeatmaps.map((h) => h.id)));
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to fetch heatmaps or squares"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchHeatmapsAndSquares();
  }, [heatmapService, squaresService, user]);

  useEffect(() => {
    const newProcessedData: Record<
      string,
      ReturnType<typeof prepareYearGridData>
    > = {};
    for (const heatmapId in squaresByHeatmap) {
      newProcessedData[heatmapId] = prepareYearGridData(
        squaresByHeatmap[heatmapId].filter((s) => s.date) as Square[]
      );
    }
    setProcessedHeatmapData(newProcessedData);
  }, [squaresByHeatmap]);

  const handleSquareClick = async (squareData: {
    originalSquare?: Square;
    date: string;
    level: number;
    id: string;
    isBlank?: boolean;
  }) => {
    if (!squareData.originalSquare || squareData.isBlank) return; // Cannot click placeholder or blank cells

    const square = squareData.originalSquare;
    const newLevel = (square.level + 1) % 4;
    const updatedSquare = { ...square, level: newLevel };

    setSquaresByHeatmap((prev) => {
      const heatmapId = square.heatmap_id;
      if (!heatmapId) return prev;
      return {
        ...prev,
        [heatmapId]: (prev[heatmapId] || []).map((s: Square) =>
          s.id === square.id ? updatedSquare : s
        ),
      };
    });
    try {
      await squaresService.updateSquare(square.id, { level: newLevel });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update square level"
      );
    }
  };

  const toggleHeatmapCollapse = (heatmapId: string) => {
    setCollapsedHeatmaps((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(heatmapId)) {
        newSet.delete(heatmapId);
      } else {
        newSet.add(heatmapId);
      }
      return newSet;
    });
  };

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

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {heatmaps.map((heatmap) => {
        const currentHeatmapGridData = processedHeatmapData[heatmap.id];
        const dayLabelWidth = 28; // px, for "Mon, Wed, Fri" labels
        const squareSize = 16; // w-4, h-4 in Tailwind = 16px
        const squareMargin = 1; // m-px = 1px
        const weekColumnMarginRight = 2; // mr-0.5 = 2px
        const effectiveSquareWidthWithMargins = squareSize + squareMargin * 2;
        const weekColumnWidth = effectiveSquareWidthWithMargins; // Assuming week column itself adds no padding around squares
        const totalGridWidth =
          53 * (weekColumnWidth + weekColumnMarginRight) -
          weekColumnMarginRight; // 53 columns

        return (
          <div key={heatmap.id} className="mb-8">
            <div
              className="flex items-center cursor-pointer text-xl font-bold mb-4"
              onClick={() => toggleHeatmapCollapse(heatmap.id)}
              title={`Created at: ${new Date(
                heatmap.created_at
              ).toLocaleDateString()}`}
            >
              <span className="mr-2">
                {collapsedHeatmaps.has(heatmap.id) ? "▶" : "▼"}
              </span>
              {heatmap.label || "Unnamed Heatmap"}
            </div>
            {!collapsedHeatmaps.has(heatmap.id) && currentHeatmapGridData && (
              <div className="flex flex-col items-start">
                {/* Month Labels */}
                <div
                  className="relative h-4 mb-1"
                  style={{
                    width: `${totalGridWidth}px`,
                    marginLeft: `${dayLabelWidth}px`,
                  }}
                >
                  {currentHeatmapGridData.monthMarkers.map((marker) => (
                    <span
                      key={`${marker.label}-${marker.weekIndex}`}
                      className="absolute text-s font-bold text-gray-500"
                      style={{
                        left: `${marker.weekIndex * (weekColumnWidth + weekColumnMarginRight)}px`,
                        top: "-4px", // Adjust this value to increase the distance
                        transform: "translateX(-50%)",
                      }}
                    >
                      {marker.label}
                    </span>
                  ))}
                </div>

                <div className="flex flex-row">
                  {/* Day Labels */}
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

                  {/* Grid of Squares */}
                  <div className="flex flex-row">
                    {currentHeatmapGridData.weeks.map((weekData, weekIdx) => (
                      <div
                        key={weekIdx}
                        className="flex flex-col"
                        style={{
                          marginRight:
                            weekIdx < currentHeatmapGridData.weeks.length - 1
                              ? `${weekColumnMarginRight}px`
                              : "0px",
                        }}
                      >
                        {weekData.map((day) => (
                          <div
                            key={day.id}
                            className={`w-4 h-4 m-px border border-neutral-200  cursor-pointer ${getSquareColor(
                              day.level,
                              day.isBlank
                            )}`}
                            title={`Date: ${
                              day.date
                                ? new Date(day.date).toLocaleDateString()
                                : "No date"
                            }, Level: ${day.level}${
                              day.isBlank ? " (No data)" : ""
                            }`}
                            onClick={() => handleSquareClick(day)}
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {!collapsedHeatmaps.has(heatmap.id) &&
              !currentHeatmapGridData &&
              !isLoading && <div>Preparing heatmap data...</div>}
          </div>
        );
      })}
    </div>
  );
};

export default Heatmap;
