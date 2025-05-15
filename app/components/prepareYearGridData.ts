import { Database } from "../domain/database.types";

type Square = Database["public"]["Tables"]["squares"]["Row"];

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

export const prepareYearGridData = (
  squaresFromService: Square[],
  creationDate: Date = new Date()
) => {
  const squaresMap = new Map(
    squaresFromService.map((s) => [
      s.date ? new Date(s.date).toDateString() : "",
      s,
    ])
  );

  const gridCells: GridCell[] = [];

  let startDateInGrid = new Date(creationDate);
  startDateInGrid.setDate(startDateInGrid.getDate() - startDateInGrid.getDay()); // Align to Sunday of that week

  let currentDate = new Date(startDateInGrid);
  const numDaysToDisplay = 53 * 7; // Display 53 weeks

  for (let i = 0; i < numDaysToDisplay; i++) {
    const dateStr = currentDate.toDateString();
    const isoDateStr = currentDate.toISOString().split("T")[0];
    const originalSquare = squaresMap.get(dateStr);

    const isPastDayWithoutData = !originalSquare && currentDate < creationDate;
    const isFutureDay = currentDate >= creationDate;
    const isOutsideRelevantYearRange = false; // No longer relevant

    const isBlankCell = isPastDayWithoutData || isOutsideRelevantYearRange;

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
  const monthMarkers: { label: string; weekIndex: number }[] = [];
  const monthToWeeks: Record<string, number[]> = {};
  weeks.forEach((week, weekIdx) => {
    week.forEach((day) => {
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
    const sampleDay = weeks[weekIndices[0]].find(
      (d) => `${d.year}-${d.month}` === monthKey && !d.isBlank
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
