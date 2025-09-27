"use client";

import { useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useDemoTooltip } from "@/contexts/DemoTooltipContext";

interface DemoModeTooltipProps {
  children: React.ReactNode;
  action: string;
}

export default function DemoModeTooltip({ children, action }: DemoModeTooltipProps) {
  const { tooltipState, showTooltip, hideTooltip } = useDemoTooltip();
  const containerRef = useRef<HTMLDivElement>(null);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const spaceAbove = rect.top;

      const x = rect.left + rect.width / 2;
      const y = spaceAbove > 60 ? rect.top - 10 : rect.bottom + 10;
      const position = spaceAbove > 60 ? "top" : "bottom";

      showTooltip({ x, y }, position, action);

      setTimeout(() => hideTooltip(), 2000);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (tooltipState.showTooltip) {
        hideTooltip();
      }
    };

    if (tooltipState.showTooltip) {
      window.addEventListener("scroll", handleScroll, true);
      return () => window.removeEventListener("scroll", handleScroll, true);
    }
  }, [tooltipState.showTooltip, hideTooltip]);

  useEffect(() => {
    const handleResize = () => {
      if (tooltipState.showTooltip) {
        hideTooltip();
      }
    };

    if (tooltipState.showTooltip) {
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, [tooltipState.showTooltip, hideTooltip]);

  return (
    <>
      <div ref={containerRef} className="relative inline-block">
        <div onClick={handleClick} className="cursor-not-allowed">
          {children}
        </div>
      </div>

      {tooltipState.showTooltip &&
        typeof window !== "undefined" &&
        createPortal(
          <div
            className="fixed z-[9999] pointer-events-none"
            style={{
              left: Math.max(
                10,
                Math.min(tooltipState.tooltipCoords.x, window.innerWidth - 10)
              ),
              top:
                tooltipState.tooltipPosition === "top"
                  ? tooltipState.tooltipCoords.y - 50
                  : tooltipState.tooltipCoords.y + 10,
              transform: "translateX(-50%)",
            }}
          >
            <div className="bg-red-600 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap relative max-w-[calc(100vw-20px)]">
              <div className="flex items-center space-x-1">
                <span>🚫</span>
                <span>Not allowed in demo</span>
              </div>
              <div
                className={`absolute left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 ${
                  tooltipState.tooltipPosition === "top"
                    ? "top-full border-t-4 border-transparent border-t-red-600"
                    : "bottom-full border-b-4 border-transparent border-b-red-600"
                }`}
              ></div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
