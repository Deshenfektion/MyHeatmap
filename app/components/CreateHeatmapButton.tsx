"use client";

import { useState } from "react";
import { useAuthContext } from "../contexts/AuthContext";
import { useHeatmap } from "../hooks/useHeatmap";
import CreateHeatmapDialog from "./CreateHeatmapDialog";

type CreateHeatmapButtonProps = {
  label: string;
};

export default function CreateHeatmapButton({
  label,
}: CreateHeatmapButtonProps) {
  const { user } = useAuthContext();
  const { createHeatmap, isLoading, error } = useHeatmap();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleClick = () => {
    setIsDialogOpen(true);
  };

  const handleClose = () => {
    setIsDialogOpen(false);
  };

  const handleSubmit = async (heatmapLabel: string) => {
    if (!user) return;

    try {
      await createHeatmap(user.id, heatmapLabel);
      handleClose();
    } catch (err) {
      console.error("Failed to create heatmap:", err);
    }
  };

  return (
    <div>
      <button
        onClick={handleClick}
        disabled={isLoading || !user}
        className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Create New Heatmap
      </button>

      {error && <div className="text-red-500 mt-2">{error}</div>}

      <CreateHeatmapDialog
        isOpen={isDialogOpen}
        onClose={handleClose}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  );
}
