import CreateHeatmapButton from "./components/CreateHeatmapButton";
import Heatmap from "./components/Heatmap";
import { ServiceProvider } from "./contexts/ServiceContext";
import { SupabaseHeatmapRepository } from "./repository/SupabaseHeatmapRepository";
import { HeatmapServiceImpl } from "./services/HeatmapServiceImpl";

export default function Page() {
  return (
    <>
      <div className="text-2xl font-bold m-4">MyHeatmap</div>
      <ServiceProvider>
        <div className="m-4">
          <CreateHeatmapButton label="VibeForFlow"></CreateHeatmapButton>
        </div>
        <div className="shadow-lg rounded-lg p-4">
          <Heatmap></Heatmap>
        </div>
      </ServiceProvider>
    </>
  );
}
