'use client';

import { useState, useRef, useEffect } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import FormField from './FormField';
import FormTextarea from './FormTextarea';
import gsap from 'gsap';

interface ContactFormProps {
  onSuccess: () => void;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  message?: string;
  general?: string;
}

export default function ContactForm({ onSuccess }: ContactFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Offline detection
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    // Set initial online status
    setIsOnline(navigator.onLine);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Check if reCAPTCHA is properly configured
  const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  const isRecaptchaConfigured = recaptchaSiteKey &&
    recaptchaSiteKey !== 'your_recaptcha_site_key_here' &&
    recaptchaSiteKey !== '';


  // Validation functions
  const validateEmail = (email: string): string | undefined => {
    if (!email) return 'Email is required';
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email)) return 'Please enter a valid email address';
    return undefined;
  };

  const validateName = (name: string): string | undefined => {
    if (!name) return 'Name is required';
    if (name.length < 2) return 'Name must be at least 2 characters';
    if (name.length > 100) return 'Name is too long';
    return undefined;
  };

  const validateMessage = (message: string): string | undefined => {
    if (!message) return 'Message is required';
    if (message.length < 10) return 'Message must be at least 10 characters';
    if (message.length > 1000) return 'Message is too long';
    return undefined;
  };

  const validatePhone = (phone: string): string | undefined => {
    if (phone && phone.length > 0 && phone.length < 10) {
      return 'Please enter a valid phone number';
    }
    return undefined;
  };

  const validateCompany = (company: string): string | undefined => {
    if (company && company.length > 100) {
      return 'Company name is too long';
    }
    return undefined;
  };

  // Validate single field
  const validateField = (name: keyof FormData, value: string): string | undefined => {
    switch (name) {
      case 'name':
        return validateName(value);
      case 'email':
        return validateEmail(value);
      case 'phone':
        return validatePhone(value);
      case 'company':
        return validateCompany(value);
      case 'message':
        return validateMessage(value);
      default:
        return undefined;
    }
  };

  // Validate all fields
  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};

    const nameError = validateName(formData.name);
    if (nameError) newErrors.name = nameError;

    const emailError = validateEmail(formData.email);
    if (emailError) newErrors.email = emailError;

    const phoneError = validatePhone(formData.phone);
    if (phoneError) newErrors.phone = phoneError;

    const companyError = validateCompany(formData.company);
    if (companyError) newErrors.company = companyError;

    const messageError = validateMessage(formData.message);
    if (messageError) newErrors.message = messageError;

    return newErrors;
  };

  // Handle field change
  const handleChange = (name: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Handle field blur (validate on blur)
  const handleBlur = (name: keyof FormData) => {
    setTouched(prev => ({ ...prev, [name]: true }));

    const error = validateField(name, formData[name]);
    if (error) {
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitAttempted(true);

    // Check if user is online
    if (!isOnline) {
      setErrors({
        general: 'You are offline. Please check your internet connection and try again.',
      });
      return;
    }

    // Validate all fields
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);

      // Scroll to first error
      const firstErrorField = Object.keys(validationErrors)[0];
      const element = document.getElementById(firstErrorField);
      element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      element?.focus();

      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      // Get reCAPTCHA token (only if configured)
      let captchaToken: string | null = null;
      if (isRecaptchaConfigured) {
        captchaToken = await recaptchaRef.current?.executeAsync() || null;
        if (!captchaToken) {
          throw new Error('Captcha verification failed');
        }
      }

      // Submit to API
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, captchaToken }),
      });

      const result = await response.json();

      if (!response.ok) {
        // Handle field-specific errors
        if (result.details) {
          setErrors(result.details);
        } else {
          setErrors({ general: result.error || 'Failed to send message' });
        }

        return;
      }

      // Success! Trigger success animation
      setTimeout(() => {
        onSuccess();
      }, 500);

    } catch (error) {
      setErrors({
        general: 'Network error. Please check your connection and try again.',
      });
    } finally {
      setIsSubmitting(false);
      recaptchaRef.current?.reset();
    }
  };

  return (
    <div className="relative">
      {/* Outer soft shadow glow */}
      <div className="absolute -inset-2 bg-gradient-to-br from-[#00e92c]/10 via-transparent to-[#00b8a0]/10 rounded-3xl blur-2xl" />

      {/* Form Container — Liquid Glass on light bg */}
      <div className="relative p-8 md:p-10 rounded-3xl bg-white/80 backdrop-blur-2xl border border-gray-100 shadow-2xl shadow-black/8">

        {/* Subtle inner shimmer */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-transparent to-gray-50/50 rounded-3xl pointer-events-none" />

        {/* Form Header */}
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Send a Message
          </h2>
          <p className="text-gray-400 text-sm">
            All fields marked <span className="text-red-500">*</span> are required
          </p>
        </div>

        {/* Form */}
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          aria-label="Contact form"
          role="form"
          className="space-y-6"
        >
          {/* Name & Email Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              name="name"
              type="text"
              label="Name"
              value={formData.name}
              error={touched.name || submitAttempted ? errors.name : undefined}
              required
              placeholder="John Doe"
              onChange={(value) => handleChange('name', value)}
              onBlur={() => handleBlur('name')}
              autoComplete="name"
            />

            <FormField
              name="email"
              type="email"
              label="Email"
              value={formData.email}
              error={touched.email || submitAttempted ? errors.email : undefined}
              required
              placeholder="john@example.com"
              onChange={(value) => handleChange('email', value)}
              onBlur={() => handleBlur('email')}
              autoComplete="email"
            />
          </div>

          {/* Phone & Company Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              name="phone"
              type="tel"
              label="Phone"
              value={formData.phone}
              error={touched.phone || submitAttempted ? errors.phone : undefined}
              placeholder="+1 (555) 123-4567"
              onChange={(value) => handleChange('phone', value)}
              onBlur={() => handleBlur('phone')}
              autoComplete="tel"
            />

            <FormField
              name="company"
              type="text"
              label="Company"
              value={formData.company}
              error={touched.company || submitAttempted ? errors.company : undefined}
              placeholder="Acme Inc."
              onChange={(value) => handleChange('company', value)}
              onBlur={() => handleBlur('company')}
              autoComplete="organization"
            />
          </div>

          {/* Message */}
          <FormTextarea
            name="message"
            label="Message"
            value={formData.message}
            error={touched.message || submitAttempted ? errors.message : undefined}
            required
            placeholder="Tell us about your project..."
            maxLength={1000}
            onChange={(value) => handleChange('message', value)}
            onBlur={() => handleBlur('message')}
          />

          {/* General Error Message */}
          {errors.general && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 flex items-start gap-3">
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span>{errors.general}</span>
            </div>
          )}

          {/* Invisible reCAPTCHA — only rendered when configured */}
          {isRecaptchaConfigured && (
            <ReCAPTCHA
              ref={recaptchaRef}
              size="invisible"
              sitekey={recaptchaSiteKey!}
            />
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`
              relative w-full overflow-hidden rounded-2xl
              px-8 py-4 font-semibold text-white text-lg
              transition-all duration-300
              ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-cyan-500 to-green-500 hover:shadow-lg hover:shadow-cyan-500/50 hover:scale-[1.02]'}
            `}
            style={{ minHeight: '56px' }} // Touch-friendly
          >
            {/* Hover Gradient Animation */}
            {!isSubmitting && (
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-green-400 opacity-0 hover:opacity-100 transition-opacity duration-300" />
            )}

            <span className="relative z-10 flex items-center justify-center gap-2">
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Sending...
                </>
              ) : (
                <>
                  Send Message
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              )}
            </span>
          </button>

          {/* Privacy Note */}
          <p className="text-xs text-gray-400 text-center">
            Your information is secure and will never be shared.
          </p>
        </form>

        {/* Screen Reader Announcements */}
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          {isSubmitting && 'Sending your message...'}
        </div>
      </div>
    </div>
  );
}
