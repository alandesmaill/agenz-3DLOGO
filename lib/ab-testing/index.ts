/**
 * A/B Testing Framework - Public API
 * Exports all A/B testing utilities for use in components
 */

export { ABTestProvider } from './provider';
export { useABTest, useTrackConversion } from './useABTest';
export { CTA_TEXT_MAP, FORM_VARIANTS } from './constants';
export type { FormLayout, CTAText, FormStyle, ABTestVariant } from './constants';
