"use client";

import { usePathname } from "next/navigation";
import { useSidebar } from "@/contexts/SidebarContext";
import { ReactNode, useState, useEffect } from "react";

interface MainContentWrapperProps {
  children: ReactNode;
}

export default function MainContentWrapper({ children }: MainContentWrapperProps) {
  const pathname = usePathname();
  const { isSidebarCollapsed, isMobile } = useSidebar();
  const [isTransitioning, setIsTransitioning] = useState(false);

  const isDashboard = pathname === "/dashboard";

  useEffect(() => {
    if (!isDashboard) {
      setIsTransitioning(false);
    } else {
      setIsTransitioning(false);
    }
  }, [isDashboard]);

  const getLeftMargin = () => {
    if (isMobile) {
      return isDashboard ? "ml-16" : "ml-0";
    }
    if (isDashboard) {
      return isSidebarCollapsed ? "ml-16" : "ml-64";
    }

    return "ml-0";
  };

  return (
    <main
      className={`flex-1 flex flex-col mt-14 md:mt-16 min-h-[calc(100vh-56px)] md:min-h-[calc(100vh-64px)] ${isDashboard ? "transition-all duration-300 ease-in-out" : ""} ${getLeftMargin()}`}
      style={{
        backgroundColor: isTransitioning ? "transparent" : undefined,
      }}
    >
      {children}
    </main>
  );
}
