'use client';

import { useCallback } from 'react';

const TRANSITION_KEY = 'works-page-transition';

interface TransitionData {
  projectId: string;
  fromRect: {
    top: number;
    left: number;
    width: number;
    height: number;
  };
  direction: 'forward' | 'back';
  timestamp: number;
}

export function usePageTransition() {
  // Save transition data to sessionStorage
  const startTransition = useCallback((
    element: HTMLElement,
    projectId: string,
    direction: 'forward' | 'back'
  ) => {
    const rect = element.getBoundingClientRect();
    const data: TransitionData = {
      projectId,
      fromRect: {
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      },
      direction,
      timestamp: Date.now(),
    };

    try {
      sessionStorage.setItem(TRANSITION_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('[usePageTransition] Failed to save transition data:', error);
    }
  }, []);

  // Get transition data from sessionStorage
  const getTransition = useCallback((): TransitionData | null => {
    try {
      const data = sessionStorage.getItem(TRANSITION_KEY);
      if (!data) return null;

      const parsed: TransitionData = JSON.parse(data);

      // Expire after 2 seconds (avoid stale data on refresh)
      if (Date.now() - parsed.timestamp > 2000) {
        sessionStorage.removeItem(TRANSITION_KEY);
        return null;
      }

      return parsed;
    } catch (error) {
      console.error('[usePageTransition] Failed to get transition data:', error);
      return null;
    }
  }, []);

  // Clear transition data from sessionStorage
  const clearTransition = useCallback(() => {
    try {
      sessionStorage.removeItem(TRANSITION_KEY);
    } catch (error) {
      console.error('[usePageTransition] Failed to clear transition data:', error);
    }
  }, []);

  return {
    startTransition,
    getTransition,
    clearTransition,
  };
}
