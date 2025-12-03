/**
 * A/B Testing Framework - Hook
 * Custom React hook to access A/B test variant information
 */

'use client';

import { useContext } from 'react';
import { ABTestContext } from './context';
import { ABTestVariant } from './constants';

export function useABTest(): ABTestVariant {
  const context = useContext(ABTestContext);

  if (!context) {
    throw new Error(
      'useABTest must be used within ABTestProvider. ' +
      'Wrap your app with <ABTestProvider> to use A/B testing.'
    );
  }

  return context;
}

/**
 * Optional helper hook to track conversion events
 * Use this when user completes the form to track A/B test performance
 */
export function useTrackConversion() {
  const variant = useABTest();

  return () => {
    // TODO: Implement conversion tracking with your analytics service
    // Example: analytics.track('form_submission', { variant });
  };
}
