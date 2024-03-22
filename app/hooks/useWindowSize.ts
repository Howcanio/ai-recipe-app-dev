import { useState, useEffect } from 'react';

// Define breakpoints following Tailwind CSS conventions
const mobileBreakpoint = 768; // Mobile: <768px
const tabletBreakpoint = 1024; // Tablet: >=768px and <1024px
const desktopBreakpoint = 1280; // Desktop: >=1024px
const macBookBreakpoint = 1440; // MacBook: 1440px for example

export default function useWindowSize() {
  const [windowSize, setWindowSize] = useState<{
    width: undefined | number;
    height: undefined | number;
    isMobile: boolean;
    isTablet: boolean;
    isDesktop: boolean;
    isMacBook: boolean;
    isBelowDesktop: boolean;
  }>({
    width: undefined,
    height: undefined,
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    isMacBook: false,
    isBelowDesktop: true,
  });

  useEffect(() => {
    function handleResize() {
      const width = window.innerWidth;
      setWindowSize({
        width: width,
        height: window.innerHeight,
        isMobile: width < mobileBreakpoint,
        isTablet: width >= mobileBreakpoint && width < tabletBreakpoint,
        isDesktop: width >= desktopBreakpoint && width < macBookBreakpoint,
        isMacBook: width >= macBookBreakpoint,
        isBelowDesktop: width < desktopBreakpoint,
      });
    }

    // Initialize size
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
}
