import CreateHeatmapButton from "./components/CreateHeatmapButton";
import { ServiceProvider } from "./contexts/ServiceContext";
import { SupabaseHeatmapRepository } from "./repository/SupabaseHeatmapRepository";
import { HeatmapServiceImpl } from "./services/HeatmapServiceImpl";

export default function Page() {
  return (
    // TODO: Get userId from userData? hook

    // TODO: Manage userId and label with useState()
    // then paste into CreateHeatmapButton

    <>
      <div>MyHeatmap</div>
      <ServiceProvider>
        <CreateHeatmapButton label="VibeForFlow"></CreateHeatmapButton>
      </ServiceProvider>
    </>
  );
}
