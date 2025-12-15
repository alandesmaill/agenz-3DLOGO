'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

/**
 * PageReadyContext - Cross-page paint ready signaling system
 *
 * This context enables the morph animation overlay to wait for explicit
 * confirmation that the new page is fully painted before fading out.
 *
 * This solves the flash/reload issue in browsers without View Transitions API
 * by replacing unreliable timing hacks (RAF + setTimeout) with deterministic
 * signaling.
 *
 * How it works:
 * 1. Showcase page: Creates overlay, navigates, polls for ready signal
 * 2. Detail page: Completes paint, calls markReady()
 * 3. Showcase page: Receives signal, fades overlay
 * 4. Result: Zero flash, seamless transition
 */

interface PageReadyContextValue {
  /**
   * Whether the page is fully painted and ready to be revealed
   */
  isReady: boolean;

  /**
   * Mark the page as fully painted and ready
   * Triggers sessionStorage signal for cross-page communication
   */
  markReady: () => void;

  /**
   * Wait for the page to be ready, then execute callback
   * @param callback - Function to execute when page is ready
   */
  waitForReady: (callback: () => void) => void;
}

const PageReadyContext = createContext<PageReadyContextValue | null>(null);

interface PageReadyProviderProps {
  children: ReactNode;
}

export function PageReadyProvider({ children }: PageReadyProviderProps) {
  const [isReady, setIsReady] = useState(false);
  const [callbacks, setCallbacks] = useState<(() => void)[]>([]);

  /**
   * Mark the page as ready and execute any waiting callbacks
   * Also sets sessionStorage signal for cross-page communication
   */
  const markReady = useCallback(() => {
    console.log('[PageReady] Marking page as ready');

    setIsReady(true);

    // Set sessionStorage signal for morph overlay to detect
    try {
      sessionStorage.setItem('page-ready-signal', 'true');
    } catch (error) {
      console.error('[PageReady] Failed to set sessionStorage signal:', error);
    }

    // Execute all waiting callbacks
    callbacks.forEach((cb) => {
      try {
        cb();
      } catch (error) {
        console.error('[PageReady] Callback execution failed:', error);
      }
    });

    // Clear callbacks array
    setCallbacks([]);
  }, [callbacks]);

  /**
   * Register a callback to execute when page is ready
   * If already ready, executes immediately
   */
  const waitForReady = useCallback(
    (callback: () => void) => {
      if (isReady) {
        // Already ready - execute immediately
        callback();
      } else {
        // Not ready yet - add to queue
        setCallbacks((prev) => [...prev, callback]);
      }
    },
    [isReady]
  );

  const value: PageReadyContextValue = {
    isReady,
    markReady,
    waitForReady,
  };

  return (
    <PageReadyContext.Provider value={value}>
      {children}
    </PageReadyContext.Provider>
  );
}

/**
 * Hook to access page ready state and actions
 * Must be used within PageReadyProvider
 */
export function usePageReady() {
  const context = useContext(PageReadyContext);

  if (!context) {
    throw new Error('usePageReady must be used within PageReadyProvider');
  }

  return context;
}
