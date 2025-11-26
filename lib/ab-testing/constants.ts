/**
 * A/B Testing Framework - Constants
 * Defines form layout variants, CTA text options, and styling variations
 */

export type FormLayout = 'single-column' | 'two-column';
export type CTAText = 'send-message' | 'submit' | 'get-started' | 'contact-us';
export type FormStyle = 'liquid-glass' | 'dark-glass' | 'gradient';

export const FORM_VARIANTS = {
  layouts: ['single-column', 'two-column'] as FormLayout[],
  ctas: ['send-message', 'submit', 'get-started', 'contact-us'] as CTAText[],
  styles: ['liquid-glass', 'dark-glass', 'gradient'] as FormStyle[],
};

export const CTA_TEXT_MAP: Record<CTAText, string> = {
  'send-message': 'Send Message',
  'submit': 'Submit Form',
  'get-started': 'Get Started',
  'contact-us': 'Contact Us',
};

export interface ABTestVariant {
  layout: FormLayout;
  cta: CTAText;
  style: FormStyle;
}
