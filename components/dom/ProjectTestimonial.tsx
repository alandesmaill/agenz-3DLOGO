'use client';

interface ProjectTestimonialProps {
  quote: string;
  author: string;
  role: string;
  company: string;
  accentColor: string;
}

export default function ProjectTestimonial({
  quote,
  author,
  role,
  company,
  accentColor,
}: ProjectTestimonialProps) {
  return (
    <div className="max-w-5xl mx-auto">
      <div
        className="
          relative
          p-6 md:p-8
          rounded-3xl
          bg-gray-100/80 backdrop-blur-xl
          border border-white/30
          shadow-2xl
        "
        style={{
          borderLeft: `6px solid ${accentColor}`,
        }}
      >
        {/* Quotation Mark Icon */}
        <div
          className="absolute top-6 left-6 md:top-8 md:left-8 text-5xl md:text-6xl font-serif opacity-10 select-none pointer-events-none"
          style={{ color: accentColor }}
        >
          &ldquo;
        </div>

        {/* Quote */}
        <blockquote className="relative z-10 text-xl md:text-2xl font-['Gibson'] text-gray-800 leading-relaxed mb-8">
          {quote}
        </blockquote>

        {/* Author Info */}
        <div className="flex items-center gap-4">
          {/* Avatar Placeholder */}
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center text-white font-['Gibson'] font-bold text-xl"
            style={{ backgroundColor: accentColor }}
          >
            {author.charAt(0)}
          </div>

          {/* Name & Role */}
          <div>
            <div className="text-lg font-['Gibson'] font-bold text-gray-900">
              {author}
            </div>
            <div className="text-sm font-['Gibson'] text-gray-600">
              {role}, {company}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
