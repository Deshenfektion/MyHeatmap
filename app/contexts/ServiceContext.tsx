"use client";

import { createContext, ReactNode, useContext } from "react";
import { HeatmapService } from "../services/HeatmapService";
import { SquaresService } from "../services/SquaresService";
import { SupabaseHeatmapRepository } from "../repository/SupabaseHeatmapRepository";
import { SupabaseSquaresRepository } from "../repository/SupabaseSquaresRepository";
import { HeatmapServiceImpl } from "../services/HeatmapServiceImpl";
import { SquaresServiceImpl } from "../services/SquaresServiceImpl";

// Typ für Context
type ServiceContextType = {
  heatmapService: HeatmapService;
  squaresService: SquaresService;
};

export const ServiceContext = createContext<ServiceContextType | null>(null);

export function ServiceProvider({ children }: { children: ReactNode }) {
  // Initialisiere repositories und services (kein DI Container, weil Overkill)
  const heatmapRepository = new SupabaseHeatmapRepository();
  const squaresRepository = new SupabaseSquaresRepository();
  const squaresService = new SquaresServiceImpl(squaresRepository);
  const heatmapService = new HeatmapServiceImpl(
    heatmapRepository,
    squaresService
  );

  const value: ServiceContextType = {
    heatmapService,
    squaresService,
  };

  return (
    <ServiceContext.Provider value={value}>{children}</ServiceContext.Provider>
  );
}

export function useServices() {
  const context = useContext(ServiceContext);
  if (!context) {
    throw new Error("useServices must be used within a ServiceProvider");
  }
  return context;
}
