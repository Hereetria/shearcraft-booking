"use client";

import { useState, useEffect } from "react";

export function useBreakpoint(breakpoint: number) {
  const [isAboveBreakpoint, setIsAboveBreakpoint] = useState(false);

  useEffect(() => {
    const checkBreakpoint = () => {
      setIsAboveBreakpoint(window.innerWidth >= breakpoint);
    };

    
    checkBreakpoint();

    
    window.addEventListener("resize", checkBreakpoint);

    
    return () => window.removeEventListener("resize", checkBreakpoint);
  }, [breakpoint]);

  return isAboveBreakpoint;
}
