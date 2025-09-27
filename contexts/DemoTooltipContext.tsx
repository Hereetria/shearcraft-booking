"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

interface DemoTooltipState {
  showTooltip: boolean;
  tooltipPosition: "top" | "bottom";
  tooltipCoords: { x: number; y: number };
  action: string;
}

interface DemoTooltipContextType {
  tooltipState: DemoTooltipState;
  showTooltip: (
    coords: { x: number; y: number },
    position: "top" | "bottom",
    action: string
  ) => void;
  hideTooltip: () => void;
}

const DemoTooltipContext = createContext<DemoTooltipContextType | undefined>(
  undefined
);

export function DemoTooltipProvider({ children }: { children: React.ReactNode }) {
  const [tooltipState, setTooltipState] = useState<DemoTooltipState>({
    showTooltip: false,
    tooltipPosition: "top",
    tooltipCoords: { x: 0, y: 0 },
    action: "",
  });

  const showTooltip = useCallback(
    (
      coords: { x: number; y: number },
      position: "top" | "bottom",
      action: string
    ) => {
      setTooltipState({
        showTooltip: true,
        tooltipPosition: position,
        tooltipCoords: coords,
        action,
      });
    },
    []
  );

  const hideTooltip = useCallback(() => {
    setTooltipState((prev) => ({
      ...prev,
      showTooltip: false,
    }));
  }, []);

  return (
    <DemoTooltipContext.Provider value={{ tooltipState, showTooltip, hideTooltip }}>
      {children}
    </DemoTooltipContext.Provider>
  );
}

export function useDemoTooltip() {
  const context = useContext(DemoTooltipContext);
  if (context === undefined) {
    throw new Error("useDemoTooltip must be used within a DemoTooltipProvider");
  }
  return context;
}
