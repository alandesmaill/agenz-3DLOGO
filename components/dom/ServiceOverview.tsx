'use client';

import AnimatedText from '@/components/dom/AnimatedText';

interface ServiceOverviewProps {
  heading: string;
  paragraphs: string[];
  benefits: string[];
  accentColor: string;
}

export default function ServiceOverview({
  heading,
  paragraphs,
  benefits,
  accentColor,
}: ServiceOverviewProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
      {/* Left column: Heading */}
      <div className="lg:sticky lg:top-32">
        <AnimatedText
          className="text-3xl md:text-4xl lg:text-5xl font-['Gibson'] font-bold text-gray-900 leading-tight"
          splitBy="words"
          stagger={0.03}
          duration={0.6}
          y={40}
        >
          {heading}
        </AnimatedText>
      </div>

      {/* Right column: Content */}
      <div className="space-y-8">
        {/* Paragraphs */}
        <div className="space-y-6">
          {paragraphs.map((paragraph, index) => (
            <p
              key={index}
              className="text-lg font-['Gibson'] text-gray-700 leading-relaxed"
            >
              {paragraph}
            </p>
          ))}
        </div>

        {/* Benefits list */}
        <div className="pt-4">
          <h4
            className="text-xl font-['Gibson'] font-bold text-gray-900 mb-6"
            style={{ color: accentColor }}
          >
            What's Included:
          </h4>
          <ul className="space-y-4">
            {benefits.map((benefit, index) => (
              <li
                key={index}
                className="flex items-start gap-4 font-['Gibson'] text-gray-700"
              >
                <span
                  className="
                    mt-1 flex-shrink-0
                    w-6 h-6
                    rounded-full
                    flex items-center justify-center
                    text-white text-sm font-bold
                  "
                  style={{ backgroundColor: accentColor }}
                >
                  ✓
                </span>
                <span className="leading-relaxed">{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
