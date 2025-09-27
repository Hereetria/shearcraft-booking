import { useState, useEffect } from 'react';

export function useResponsiveNav() {
  const [showAllNavItems, setShowAllNavItems] = useState(true);

  useEffect(() => {
    const checkNavSpace = () => {
      const navbarContainer = document.querySelector("[data-nav-container]");
      if (!navbarContainer) {
        setShowAllNavItems(false);
        return;
      }

      const containerWidth = navbarContainer.clientWidth;

      const minRequiredWidth = 648;
      const wouldOverflow = containerWidth < minRequiredWidth;
      
      setShowAllNavItems(!wouldOverflow);
    };

    checkNavSpace();
    window.addEventListener('resize', checkNavSpace);
    
    return () => window.removeEventListener('resize', checkNavSpace);
  }, []);

  return { showAllNavItems };
}
