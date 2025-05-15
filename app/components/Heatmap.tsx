"use client";

import React, { useEffect, useState } from "react";
import { useServices } from "../contexts/ServiceContext";
import { useAuthContext } from "../contexts/AuthContext";

import { Database } from "../domain/database.types";
import HeatmapCard from "./HeatmapCard";
import { prepareYearGridData } from "./prepareYearGridData";

type Heatmap = Database["public"]["Tables"]["heatmaps"]["Row"];
type Square = Database["public"]["Tables"]["squares"]["Row"];

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
    if (!user?.id) return;
    const fetchHeatmapsAndSquares = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const allHeatmaps = await heatmapService.getHeatmapsByUserId(
          user?.id || ""
        );
        setHeatmaps(allHeatmaps);

        const squaresData: Record<string, Square[]> = {};
        for (const heatmap of allHeatmaps) {
          const heatmapSquares = await squaresService.getSquaresForHeatmap(
            heatmap.id
          );
          heatmapSquares.sort((a, b) => {
            const dateA = a.date ? new Date(a.date).getTime() : 0;
            const dateB = b.date ? new Date(b.date).getTime() : 0;
            return dateA - dateB;
          });
          squaresData[heatmap.id] = heatmapSquares;
        }
        setSquaresByHeatmap(squaresData);
        setCollapsedHeatmaps(new Set());
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
        squaresByHeatmap[heatmapId].filter((s) => s.date)
      );
    }
    setProcessedHeatmapData(newProcessedData);
  }, [squaresByHeatmap]);

  const handleSquareClick = async (squareData: any) => {
    if (!squareData.originalSquare || squareData.isBlank) return;
    const square = squareData.originalSquare;
    const newLevel = (square.level + 1) % 4;
    const updatedSquare = { ...square, level: newLevel };

    setSquaresByHeatmap((prev) => {
      const heatmapId = square.heatmap_id;
      if (!heatmapId) return prev;
      return {
        ...prev,
        [heatmapId]: (prev[heatmapId] || []).map((s: any) =>
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

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {heatmaps.map((heatmap) => (
        <HeatmapCard
          key={heatmap.id}
          heatmap={heatmap}
          gridData={processedHeatmapData[heatmap.id]}
          collapsed={collapsedHeatmaps.has(heatmap.id)}
          onToggleCollapse={() => toggleHeatmapCollapse(heatmap.id)}
          onSquareClick={handleSquareClick}
        />
      ))}
    </div>
  );
};

export default Heatmap;
