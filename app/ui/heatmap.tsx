import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import heatmapService from "@/lib/heatmapService";

type Square = {
  id: number;
  click_count: number;
};

type Row = {
  id: number;
  label: string;
  squares: Square[];
};

type HeatmapState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "empty" }
  | { status: "ready"; rows: Row[]; heatmapId: string };

const MAX_CLICKS = 3;

const Heatmap = ({ userId }: { userId: string }) => {
  const [state, setState] = useState<HeatmapState>({ status: "loading" });
  const [pendingActions, setPendingActions] = useState<(() => void)[]>([]);

  // Data fetching
  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await heatmapService.fetchHeatmapData(userId);

        if (result.error) {
          if (result.error.includes("No heatmap found")) {
            setState({ status: "empty" });
          } else {
            setState({ status: "error", message: result.error });
          }
          return;
        }

        if (result.heatmapId && result.rows) {
          setState({
            status: "ready",
            rows: result.rows,
            heatmapId: result.heatmapId,
          });
        }
      } catch (error) {
        setState({
          status: "error",
          message: "Failed to load data",
        });
      }
    };

    loadData();
  }, [userId]);

  // Handle pending actions after state updates
  useEffect(() => {
    if (pendingActions.length > 0 && state.status === "ready") {
      pendingActions.forEach((action) => action());
      setPendingActions([]);
    }
  }, [state, pendingActions]);

  // Create new heatmap
  const handleCreateHeatmap = async () => {
    setState({ status: "loading" });

    try {
      const result = await heatmapService.createNewHeatmap(userId);

      if (result.error) {
        setState({ status: "error", message: result.error });
        return;
      }

      if (result.heatmapId) {
        setState((prev) => ({
          status: "ready",
          rows: [],
          heatmapId: result.heatmapId,
        }));
      }
    } catch (error) {
      setState({ status: "error", message: "Creation failed" });
    }
  };

  // Square click handler
  const handleSquareClick = async (rowId: number, squareId: number) => {
    if (state.status !== "ready") return;

    const updateOptimistically = (rows: Row[]) =>
      rows.map((row) =>
        row.id === rowId
          ? {
              ...row,
              squares: row.squares.map((sq) =>
                sq.id === squareId
                  ? {
                      ...sq,
                      click_count: (sq.click_count + 1) % (MAX_CLICKS + 1),
                    }
                  : sq
              ),
            }
          : row
      );

    setState((prev) => {
      if (prev.status !== "ready") return prev;
      return { ...prev, rows: updateOptimistically(prev.rows) };
    });

    try {
      const currentCount =
        state.rows
          .find((r) => r.id === rowId)
          ?.squares.find((s) => s.id === squareId)?.click_count || 0;

      await heatmapService.incrementSquareClick(squareId, currentCount);
    } catch (error) {
      setPendingActions((prev) => [
        ...prev,
        () => {
          setState((prev) => {
            if (prev.status !== "ready") return prev;
            return { ...prev, rows: updateOptimistically(prev.rows) };
          });
        },
      ]);
      setState({ status: "error", message: "Update failed" });
    }
  };

  // Add new row
  const handleAddRow = async () => {
    if (state.status !== "ready") return;

    try {
      const newRow = await heatmapService.createRow(state.heatmapId, "New Row");
      if (!newRow) return;

      setState((prev) => {
        if (prev.status !== "ready") return prev;
        return {
          ...prev,
          rows: [...prev.rows, { ...newRow, squares: [] }],
        };
      });
    } catch (error) {
      setState({ status: "error", message: "Failed to add row" });
    }
  };

  // Render different states
  const renderContent = () => {
    switch (state.status) {
      case "loading":
        return (
          <div className="flex items-center justify-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
          </div>
        );

      case "empty":
        return (
          <div className="flex flex-col items-center justify-center h-screen gap-4">
            <h1 className="text-2xl font-bold">Create Your First Heatmap</h1>
            <button
              onClick={handleCreateHeatmap}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Get Started
            </button>
          </div>
        );

      case "error":
        return (
          <div className="flex flex-col items-center justify-center h-screen gap-4">
            <p className="text-red-500 text-lg">{state.message}</p>
            <button
              onClick={() => setState({ status: "loading" })}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Retry
            </button>
          </div>
        );

      case "ready":
        return (
          <div className="flex flex-col items-center min-h-screen p-6 bg-gray-50">
            <div className="w-full max-w-4xl">
              <h1 className="text-3xl font-bold mb-6 text-center">
                Activity Heatmap
              </h1>

              <div className="flex gap-6">
                <div className="flex flex-col items-end pr-4 gap-2">
                  {state.rows.map((row) => (
                    <input
                      key={row.id}
                      value={row.label}
                      onChange={(e) =>
                        handleLabelChange(row.id, e.target.value)
                      }
                      className="h-10 px-3 py-2 text-right border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ))}
                  <button
                    onClick={handleAddRow}
                    className="w-10 h-10 flex items-center justify-center border rounded-lg bg-white hover:bg-gray-100 transition-colors"
                  >
                    <Plus size={20} />
                  </button>
                </div>

                <div className="flex-1 overflow-auto">
                  <div className="flex flex-col gap-2">
                    {state.rows.map((row) => (
                      <div key={row.id} className="flex gap-2">
                        {row.squares.map((square) => (
                          <button
                            key={square.id}
                            className={`w-12 h-12 rounded-lg border transition-all duration-200 ${
                              square.click_count === 1
                                ? "bg-green-100 hover:bg-green-200 border-green-300"
                                : square.click_count === 2
                                ? "bg-green-300 hover:bg-green-400 border-green-500"
                                : square.click_count === 3
                                ? "bg-green-600 hover:bg-green-700 border-green-800 text-white"
                                : "bg-white hover:bg-gray-100 border-gray-300"
                            }`}
                            onClick={() => handleSquareClick(row.id, square.id)}
                            title={`Clicks: ${square.click_count}`}
                          />
                        ))}
                        <AddSquareButton rowId={row.id} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return renderContent();
};

export default Heatmap;

// Helper components
const AddSquareButton = ({ rowId }: { rowId: number }) => {
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = async () => {
    setIsAdding(true);
    try {
      await heatmapService.createSquare(rowId);
    } catch (error) {
      console.error("Failed to add square");
    }
    setIsAdding(false);
  };

  return (
    <button
      onClick={handleAdd}
      disabled={isAdding}
      className="w-12 h-12 rounded-lg border border-gray-300 flex items-center justify-center bg-white hover:bg-gray-100 transition-colors"
    >
      {isAdding ? (
        <div className="animate-spin h-5 w-5 border-t-2 border-blue-500 rounded-full" />
      ) : (
        <Plus size={20} />
      )}
    </button>
  );
};
