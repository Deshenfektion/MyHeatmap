import { SupabaseHeatmapRepository } from "./repository/SupabaseHeatmapRepository";
import { HeatmapServiceImpl } from "./services/HeatmapServiceImpl";

export default function Page() {
  const heatmapRepository = new SupabaseHeatmapRepository();
  const heatmapService = new HeatmapServiceImpl(heatmapRepository);

  // If user does not have a heatmap yet, ask user for label and
  // create a new heatmap for them

  // Display heatmap on the page
  return <div>MyHeatmap</div>;
}
