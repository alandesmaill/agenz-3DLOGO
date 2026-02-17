'use client';

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
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Challenge */}
      <p className="text-lg font-['Gibson'] text-gray-700 leading-relaxed">
        {challenge}
      </p>

      {/* Solution */}
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
  );
}
