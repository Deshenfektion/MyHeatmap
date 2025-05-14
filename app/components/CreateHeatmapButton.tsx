"use client";

import { useAuthContext } from "../contexts/AuthContext";
import { useHeatmap } from "../hooks/useHeatmap";

type CreateHeatmapButtonProps = {
  label: string;
};

export default function CreateHeatmapButton({
  label,
}: CreateHeatmapButtonProps) {
  const { user } = useAuthContext();
  const { createHeatmap, isLoading, error } = useHeatmap();

  const handleClick = async () => {
    if (!user) return;

    try {
      await createHeatmap(user.id, label);
      // Handle success
    } catch (err) {
      console.error("Failed to create heatmap:", err);
    }
  };

  return (
    <div>
      <button onClick={handleClick} disabled={isLoading || !user}>
        {isLoading ? "Creating..." : "Create New Heatmap"}
      </button>

      {error && <div className="error">{error}</div>}
    </div>
  );
}
