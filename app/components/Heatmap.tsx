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
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {squares.map((square) => (
          <div
            key={square.id}
            style={{
              width: "20px",
              height: "20px",
              backgroundColor: `rgba(0, 0, 255, ${square.level / 3})`,
              margin: "1px",
              border: "1px solid #ccc",
            }}
            title={`Date: ${square.date ? new Date(square.date).toLocaleDateString() : "No date"}, Level: ${square.level}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Heatmap;
