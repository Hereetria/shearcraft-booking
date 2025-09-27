"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  ReactNode,
} from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useBreakpoint } from "@/hooks/useBreakpoint";

interface SidebarContextType {
  isSidebarCollapsed: boolean;
  isMobile: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  showToggleButton: boolean;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [previousSidebarState, setPreviousSidebarState] = useState(false);
  const isMobile = useMediaQuery("(max-width: 699px)");
  const isDesktop = useBreakpoint(880);
  const isTransitioning = useRef(false);

  useEffect(() => {
    if (isTransitioning.current) {
      isTransitioning.current = false;
      return;
    }

    if (isMobile) {
      setIsSidebarCollapsed(true);
    } else if (!isDesktop) {
      setPreviousSidebarState((prev) => {
        if (!isSidebarCollapsed) {
          setIsSidebarCollapsed(true);
          return false;
        }
        return prev;
      });
    } else {
      setIsSidebarCollapsed(previousSidebarState);
    }
  }, [isMobile, isDesktop, isSidebarCollapsed, previousSidebarState]);

  const toggleSidebar = () => {
    if (isMobile || !isDesktop) {
      return;
    }

    const newState = !isSidebarCollapsed;
    isTransitioning.current = true;
    setIsSidebarCollapsed(newState);
    setPreviousSidebarState(newState);
  };

  const setSidebarCollapsed = (collapsed: boolean) => {
    if (isMobile || !isDesktop) {
      return;
    }
    isTransitioning.current = true;
    setIsSidebarCollapsed(collapsed);
    setPreviousSidebarState(collapsed);
  };

  const showToggleButton = isDesktop;

  return (
    <SidebarContext.Provider
      value={{
        isSidebarCollapsed,
        isMobile,
        toggleSidebar,
        setSidebarCollapsed,
        showToggleButton,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}
