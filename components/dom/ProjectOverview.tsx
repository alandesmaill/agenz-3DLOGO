'use client';

import AnimatedText from '@/components/dom/AnimatedText';

interface ProjectOverviewProps {
  challenge: string;
  solution: string;
  approach: string[];
  deliverables: string[];
  accentColor: string;
}

export default function ProjectOverview({
  challenge,
  solution,
  approach,
  deliverables,
  accentColor,
}: ProjectOverviewProps) {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Left column: Sticky Heading */}
        <div className="lg:sticky lg:top-32">
          <AnimatedText
            className="text-3xl md:text-4xl lg:text-5xl font-['Gibson'] font-bold text-gray-900 leading-tight"
            splitBy="words"
            stagger={0.03}
            duration={0.6}
            y={40}
          >
            The Challenge
          </AnimatedText>
        </div>

        {/* Right column: Challenge Description */}
        <div className="space-y-8">
          <p className="text-lg font-['Gibson'] text-gray-700 leading-relaxed">
            {challenge}
          </p>
        </div>
      </div>

      {/* Solution Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mt-16 pt-16 border-t border-gray-200">
        <div className="lg:sticky lg:top-32">
          <AnimatedText
            className="text-3xl md:text-4xl lg:text-5xl font-['Gibson'] font-bold text-gray-900 leading-tight"
            splitBy="words"
            stagger={0.03}
            duration={0.6}
            y={40}
          >
            Our Solution
          </AnimatedText>
        </div>

        <div className="space-y-8">
          <p className="text-lg font-['Gibson'] text-gray-700 leading-relaxed">
            {solution}
          </p>

          {/* Approach */}
          <div>
            <h4 className="text-xl font-['Gibson'] font-bold text-gray-900 mb-4">
              Approach
            </h4>
            <ul className="space-y-3">
              {approach.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span
                    className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ backgroundColor: `${accentColor}20` }}
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke={accentColor}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </span>
                  <span className="text-base font-['Gibson'] text-gray-700">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Deliverables */}
          <div>
            <h4 className="text-xl font-['Gibson'] font-bold text-gray-900 mb-4">
              Deliverables
            </h4>
            <ul className="space-y-3">
              {deliverables.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span
                    className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ backgroundColor: `${accentColor}20` }}
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke={accentColor}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </span>
                  <span className="text-base font-['Gibson'] text-gray-700">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
