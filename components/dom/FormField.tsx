'use client';

import { useState, useEffect } from 'react';

interface FormFieldProps {
  name: string;
  type: 'text' | 'email' | 'tel';
  label: string;
  value: string;
  error?: string;
  required?: boolean;
  placeholder?: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  autoComplete?: string;
}

export default function FormField({
  name,
  type,
  label,
  value,
  error,
  required = false,
  placeholder,
  onChange,
  onBlur,
  onFocus,
  autoComplete,
}: FormFieldProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  // Trigger shake animation when error appears
  useEffect(() => {
    if (error) {
      setIsShaking(true);
      const timer = setTimeout(() => setIsShaking(false), 500);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleFocus = () => {
    setIsFocused(true);
    onFocus?.();
  };

  const handleBlur = () => {
    setIsFocused(false);
    onBlur?.();
  };

  const isValid = !error && value.length > 0;

  return (
    <div className="relative">
      {/* Gradient border wrapper (visible on focus) */}
      <div
        className={`
          relative rounded-2xl transition-all duration-300
          ${isFocused ? 'bg-gradient-to-r from-cyan-400 to-green-400 p-[2px]' : ''}
          ${isShaking ? 'animate-shake' : ''}
        `}
      >
        {/* Inner container with liquid glass effect */}
        <div
          className={`
            relative rounded-2xl transition-all duration-300
            ${isFocused ? 'bg-[#111111]' : 'bg-white/8'}
            ${error ? 'border-2 border-red-400/60 shadow-sm shadow-red-500/10' : 'border border-white/14'}
          `}
        >
          {/* Floating Label */}
          <label
            htmlFor={name}
            className={`
              absolute left-5 transition-all duration-300 pointer-events-none
              ${isFocused || value ? 'top-2 text-xs' : 'top-4 text-base'}
              ${isFocused ? 'text-[#00e92c]' : error ? 'text-red-400' : 'text-white/60'}
              font-medium
            `}
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>

          {/* Input Field */}
          <input
            id={name}
            name={name}
            type={type}
            value={value}
            placeholder={isFocused ? placeholder : ''}
            onChange={(e) => onChange(e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            autoComplete={autoComplete}
            aria-required={required}
            aria-invalid={!!error}
            aria-describedby={error ? `${name}-error` : undefined}
            className={`
              w-full px-5 pt-6 pb-2 bg-transparent outline-none
              text-white placeholder-white/20 transition-all duration-200
              ${isFocused || value ? 'text-base' : 'text-transparent'}
            `}
            style={{ minHeight: '56px' }} // Touch-friendly height
          />

          {/* Validation Icons */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            {error && (
              <svg
                className="w-5 h-5 text-red-500 animate-bounce-once"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            )}
            {isValid && (
              <svg
                className="w-5 h-5 text-green-500 animate-scale-in"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div
          id={`${name}-error`}
          role="alert"
          aria-live="polite"
          className="mt-2 text-sm text-red-500 flex items-center gap-2 animate-slide-down"
        >
          <svg
            className="w-4 h-4 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          50% { transform: translateX(10px); }
          75% { transform: translateX(-10px); }
        }

        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes bounce-once {
          0%, 100% { transform: translateY(0); }
          25% { transform: translateY(-5px); }
          75% { transform: translateY(-2px); }
        }

        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }

        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }

        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }

        .animate-bounce-once {
          animation: bounce-once 0.4s ease-out;
        }
      `}</style>
    </div>
  );
}
