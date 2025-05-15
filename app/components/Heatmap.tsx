"use client";

import React, { useEffect, useState } from "react";
import { useServices } from "../contexts/ServiceContext";
import { Database } from "../domain/database.types";
import { useAuthContext } from "../contexts/AuthContext";

type Heatmap = Database["public"]["Tables"]["heatmaps"]["Row"];
type Square = Database["public"]["Tables"]["squares"]["Row"];

const Heatmap: React.FC = () => {
  const { heatmapService, squaresService } = useServices();
  const [heatmaps, setHeatmaps] = useState<Heatmap[]>([]);
  const [squaresByHeatmap, setSquaresByHeatmap] = useState<
    Record<string, Square[]>
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
        const squaresByHeatmap: Record<string, Square[]> = {};
        for (const heatmap of allHeatmaps) {
          const heatmapSquares = await squaresService.getSquaresForHeatmap(
            heatmap.id
          );
          squaresByHeatmap[heatmap.id] = heatmapSquares;
        }
        setSquaresByHeatmap(squaresByHeatmap);

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

  const handleSquareClick = async (square: Square) => {
    const newLevel = (square.level + 1) % 4;
    const updatedSquare = { ...square, level: newLevel };
    setSquaresByHeatmap((prev) => {
      const heatmapId = square.heatmap_id;
      if (!heatmapId) return prev;
      return {
        ...prev,
        [heatmapId]: prev[heatmapId].map((s: Square) =>
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

  const getSquareColor = (level: number) => {
    switch (level) {
      case 0:
        return "bg-transparent";
      case 1:
        return "bg-green-200";
      case 2:
        return "bg-green-500";
      case 3:
        return "bg-green-800";
      default:
        return "bg-transparent";
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {heatmaps.map((heatmap) => (
        <div key={heatmap.id} className="mb-8">
          <div
            className="flex items-center cursor-pointer text-xl font-bold mb-2"
            onClick={() => toggleHeatmapCollapse(heatmap.id)}
            title={`Created at: ${new Date(heatmap.created_at).toLocaleDateString()}`}
          >
            <span className="mr-2">
              {collapsedHeatmaps.has(heatmap.id) ? "▶" : "▼"}
            </span>
            {heatmap.label || "Unnamed Heatmap"}
          </div>
          {!collapsedHeatmaps.has(heatmap.id) && (
            <div className="flex flex-row flex-wrap">
              {Object.entries(
                (squaresByHeatmap[heatmap.id] || []).reduce(
                  (acc, square) => {
                    const date = square.date ? new Date(square.date) : null;
                    if (date) {
                      const month = date.toLocaleString("default", {
                        month: "long",
                      });
                      if (!acc[month]) {
                        acc[month] = [];
                      }
                      acc[month].push(square);
                    }
                    return acc;
                  },
                  {} as Record<string, Square[]>
                )
              ).map(([month, monthSquares]) => (
                <div key={month} className="mr-5 mb-5">
                  <h3>{month}</h3>
                  <div className="flex flex-col">
                    {Array.from({
                      length: Math.ceil(monthSquares.length / 4),
                    }).map((_, rowIndex) => (
                      <div key={rowIndex} className="flex flex-nowrap">
                        {monthSquares
                          .slice(rowIndex * 4, (rowIndex + 1) * 4)
                          .map((square) => (
                            <div
                              key={square.id}
                              className={`w-5 h-5 m-0.5 border border-gray-300 cursor-pointer ${getSquareColor(square.level)}`}
                              title={`Date: ${square.date ? new Date(square.date).toLocaleDateString() : "No date"}, Level: ${square.level}`}
                              onClick={() => handleSquareClick(square)}
                            />
                          ))}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Heatmap;
