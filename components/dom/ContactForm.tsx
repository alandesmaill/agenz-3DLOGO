'use client';

import { useState, useRef, useEffect } from 'react';
import emailjs from '@emailjs/browser';
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
  services: string[];
  message: string;
}

const SERVICE_OPTIONS = [
  'Camera Rental',
  'Advertising & Social Media',
  'Video Production',
  'Print & Graphic Design',
  'Strategic Media Services',
];

function ServiceMultiSelect({
  value,
  onChange,
}: {
  value: string[];
  onChange: (services: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const toggleService = (service: string) => {
    onChange(
      value.includes(service)
        ? value.filter(s => s !== service)
        : [...value, service]
    );
  };

  const triggerLabel =
    value.length === 0
      ? 'Select services...'
      : value.length === 1
      ? value[0]
      : `${value.length} services selected`;

  return (
    <div ref={containerRef} className="relative">
      <label className="block text-sm font-medium text-white/70 mb-2">
        Services{' '}
        <span className="text-white/40 font-normal text-xs italic">optional</span>
      </label>

      <button
        type="button"
        onClick={() => setOpen(prev => !prev)}
        className={`
          w-full flex items-center justify-between gap-3 px-4 py-3.5 rounded-xl
          bg-white/6 border text-sm text-left transition-all duration-200
          ${open
            ? 'border-[#00ffff]/50 shadow-[0_0_20px_rgba(0,255,255,0.1)]'
            : 'border-white/12 hover:border-white/25'}
        `}
      >
        <span className={value.length === 0 ? 'text-white/40' : 'text-white'}>
          {triggerLabel}
        </span>
        <svg
          className={`w-4 h-4 text-white/40 flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {value.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2.5">
          {value.map(service => (
            <span
              key={service}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-[#00e92c]/15 to-[#00ffff]/15 border border-[#00ffff]/30 text-white/90"
            >
              {service}
              <button
                type="button"
                onClick={() => toggleService(service)}
                aria-label={`Remove ${service}`}
                className="text-white/40 hover:text-white transition-colors"
              >
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </span>
          ))}
        </div>
      )}

      {open && (
        <div className="absolute z-50 mt-2 w-full rounded-2xl backdrop-blur-2xl bg-[#0d0d0d]/95 border border-white/12 shadow-2xl shadow-black/60 overflow-hidden">
          {SERVICE_OPTIONS.map((service, i) => {
            const isSelected = value.includes(service);
            return (
              <button
                key={service}
                type="button"
                onClick={() => toggleService(service)}
                className={`
                  w-full flex items-center gap-3 px-4 py-3.5 text-sm text-left
                  transition-all duration-150
                  ${i !== SERVICE_OPTIONS.length - 1 ? 'border-b border-white/6' : ''}
                  ${isSelected
                    ? 'bg-gradient-to-r from-[#00e92c]/10 to-[#00ffff]/10 text-white'
                    : 'text-white/65 hover:bg-white/5 hover:text-white'}
                `}
              >
                <span className={`
                  w-5 h-5 rounded-md border flex items-center justify-center flex-shrink-0 transition-all duration-150
                  ${isSelected
                    ? 'bg-gradient-to-br from-[#00e92c] to-[#00ffff] border-transparent'
                    : 'border-white/20 bg-transparent'}
                `}>
                  {isSelected && (
                    <svg className="w-3 h-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </span>
                {service}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  services?: string;
  message?: string;
  general?: string;
}

export default function ContactForm({ onSuccess }: ContactFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    services: [],
    message: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    setIsOnline(navigator.onLine);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

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

  const handleServicesChange = (services: string[]) => {
    setFormData(prev => ({ ...prev, services }));
  };

  const handleChange = (name: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleBlur = (name: keyof FormData) => {
    setTouched(prev => ({ ...prev, [name]: true }));

    const fieldValue = formData[name];
    if (typeof fieldValue === 'string') {
      const error = validateField(name, fieldValue);
      if (error) {
        setErrors(prev => ({ ...prev, [name]: error }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitAttempted(true);

    if (!isOnline) {
      setErrors({
        general: 'You are offline. Please check your internet connection and try again.',
      });
      return;
    }

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);

      const firstErrorField = Object.keys(validationErrors)[0];
      const element = document.getElementById(firstErrorField);
      element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      element?.focus();

      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.details) {
          setErrors(result.details);
        } else {
          setErrors({ general: result.error || 'Failed to send message' });
        }
        return;
      }

      const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!;
      const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!;

      const emailParams = {
        from_name: formData.name,
        from_email: formData.email,
        phone: formData.phone || 'Not provided',
        company: formData.company || 'Not provided',
        services: formData.services.length > 0 ? formData.services.join(', ') : 'Not specified',
        message: formData.message,
      };

      await emailjs.send(
        serviceId,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        emailParams,
        publicKey
      );

      try {
        await emailjs.send(
          serviceId,
          process.env.NEXT_PUBLIC_EMAILJS_AUTOREPLY_TEMPLATE_ID!,
          { from_name: formData.name, from_email: formData.email, to_email: formData.email },
          publicKey
        );
      } catch {
        // Auto-reply failure doesn't block success
      }

      setTimeout(() => {
        onSuccess();
      }, 500);

    } catch (error) {
      setErrors({
        general: error instanceof Error
          ? error.message
          : 'Network error. Please check your connection and try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative">
      <div className="absolute -inset-2 bg-gradient-to-br from-[#00e92c]/10 via-transparent to-[#00b8a0]/10 rounded-3xl blur-2xl" />

      <div className="relative p-8 md:p-10 rounded-3xl bg-white/8 backdrop-blur-2xl border border-white/14 shadow-2xl shadow-black/20">

        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/3 rounded-3xl pointer-events-none" />

        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Send a Message
          </h2>
        </div>

        <form
          ref={formRef}
          onSubmit={handleSubmit}
          aria-label="Contact form"
          role="form"
          className="space-y-6"
        >
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

          <ServiceMultiSelect
            value={formData.services}
            onChange={handleServicesChange}
          />

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

          {errors.general && (
            <div className="p-4 rounded-xl bg-red-900/20 border border-red-500/30 text-red-400 flex items-start gap-3">
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span>{errors.general}</span>
            </div>
          )}

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

          <p className="text-xs text-white/60 text-center">
            Your information is secure and will never be shared.
          </p>
        </form>

        <div className="sr-only" aria-live="polite" aria-atomic="true">
          {isSubmitting && 'Sending your message...'}
        </div>
      </div>
    </div>
  );
}
