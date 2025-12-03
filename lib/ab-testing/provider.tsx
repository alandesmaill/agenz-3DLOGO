/**
 * A/B Testing Framework - Provider
 * Context provider that randomly selects and provides A/B test variants
 */

'use client';

import { ReactNode, useMemo } from 'react';
import { ABTestContext } from './context';
import { FORM_VARIANTS, ABTestVariant } from './constants';

interface ABTestProviderProps {
  children: ReactNode;
  // Optional: Override variant selection for testing
  forceVariant?: ABTestVariant;
}

export function ABTestProvider({ children, forceVariant }: ABTestProviderProps) {
  const variant = useMemo(() => {
    if (forceVariant) {
      return forceVariant;
    }

    // Random selection for each user
    // In production, replace with analytics-driven selection (e.g., Google Optimize, Optimizely)
    const layout = FORM_VARIANTS.layouts[Math.floor(Math.random() * FORM_VARIANTS.layouts.length)];
    const cta = FORM_VARIANTS.ctas[Math.floor(Math.random() * FORM_VARIANTS.ctas.length)];
    const style = FORM_VARIANTS.styles[Math.floor(Math.random() * FORM_VARIANTS.styles.length)];

    const selectedVariant = { layout, cta, style };

    // TODO: Track variant selection with your analytics service
    // Example: analytics.track('ab_test_variant_assigned', selectedVariant);

    return selectedVariant;
  }, [forceVariant]);

  return (
    <ABTestContext.Provider value={variant}>
      {children}
    </ABTestContext.Provider>
  );
}
