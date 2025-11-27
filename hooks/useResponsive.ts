import { useState, useEffect } from 'react';

// Debounce utility function
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export interface ResponsiveState {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  windowWidth: number;
}

/**
 * Custom hook for responsive breakpoint detection
 *
 * Breakpoints:
 * - Mobile: < 768px
 * - Tablet: 768px - 1024px
 * - Desktop: > 1024px
 *
 * @returns {ResponsiveState} Current responsive state
 */
export const useResponsive = (): ResponsiveState => {
  const [state, setState] = useState<ResponsiveState>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    windowWidth: typeof window !== 'undefined' ? window.innerWidth : 1024,
  });

  useEffect(() => {
    // Check if we're on the client side
    if (typeof window === 'undefined') return;

    const checkBreakpoints = () => {
      const width = window.innerWidth;
      const isMobile = width < 768;
      const isTablet = width >= 768 && width < 1024;
      const isDesktop = width >= 1024;

      setState({
        isMobile,
        isTablet,
        isDesktop,
        windowWidth: width,
      });
    };

    // Initial check
    checkBreakpoints();

    // Debounced resize handler (250ms delay)
    const debouncedCheck = debounce(checkBreakpoints, 250);
    window.addEventListener('resize', debouncedCheck);

    // Cleanup
    return () => {
      window.removeEventListener('resize', debouncedCheck);
    };
  }, []);

  return state;
};
