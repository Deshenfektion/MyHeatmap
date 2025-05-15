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
  const [squares, setSquares] = useState<Square[]>([]);
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
        const allSquares: Square[] = [];
        for (const heatmap of allHeatmaps) {
          const heatmapSquares = await squaresService.getSquaresForHeatmap(
            heatmap.id
          );
          allSquares.push(...heatmapSquares);
        }
        setSquares(allSquares);
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

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  // Group squares by month
  const squaresByMonth = squares.reduce(
    (acc, square) => {
      const date = square.date ? new Date(square.date) : null;
      if (date) {
        const month = date.toLocaleString("default", { month: "long" });
        if (!acc[month]) {
          acc[month] = [];
        }
        acc[month].push(square);
      }
      return acc;
    },
    {} as Record<string, Square[]>
  );

  return (
    <div>
      <h1>Heatmaps</h1>
      <ul>
        {heatmaps.map((heatmap) => (
          <li key={heatmap.id}>
            {heatmap.label || "Unnamed Heatmap"} - Created at:{" "}
            {new Date(heatmap.created_at).toLocaleDateString()}
          </li>
        ))}
      </ul>
      <h2>Squares</h2>
      <div className="flex flex-row flex-wrap">
        {Object.entries(squaresByMonth).map(([month, monthSquares]) => (
          <div key={month} className="mr-5 mb-5">
            <h3>{month}</h3>
            <div className="flex flex-col">
              {Array.from({ length: Math.ceil(monthSquares.length / 4) }).map(
                (_, rowIndex) => (
                  <div key={rowIndex} className="flex flex-nowrap">
                    {monthSquares
                      .slice(rowIndex * 4, (rowIndex + 1) * 4)
                      .map((square) => (
                        <div
                          key={square.id}
                          className="w-5 h-5 opacity-75 m-0.5 border border-gray-300"
                          title={`Date: ${square.date ? new Date(square.date).toLocaleDateString() : "No date"}, Level: ${square.level}`}
                        />
                      ))}
                  </div>
                )
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Heatmap;
