'use client';

import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider';
import AnimatedText from '@/components/dom/AnimatedText';

interface BeforeAfterShowcaseProps {
  beforeImage: string;
  afterImage: string;
  description: string;
  accentColor: string;
}

export default function BeforeAfterShowcase({
  beforeImage,
  afterImage,
  description,
  accentColor,
}: BeforeAfterShowcaseProps) {
  return (
    <div className="max-w-6xl mx-auto">
      {/* Section Title */}
      <AnimatedText
        className="text-3xl md:text-4xl font-['Gibson'] font-bold text-gray-900 mb-4 text-center"
        splitBy="words"
        stagger={0.03}
        duration={0.6}
        y={30}
      >
        Before & After
      </AnimatedText>

      {/* Description */}
      <p className="text-lg font-['Gibson'] text-gray-600 mb-12 text-center max-w-3xl mx-auto">
        {description}
      </p>

      {/* Before/After Slider */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl">
        <ReactCompareSlider
          itemOne={
            <ReactCompareSliderImage
              src={beforeImage}
              alt="Before"
              className="h-[400px] md:h-[600px] object-cover"
            />
          }
          itemTwo={
            <ReactCompareSliderImage
              src={afterImage}
              alt="After"
              className="h-[400px] md:h-[600px] object-cover"
            />
          }
          position={50}
          className="h-[400px] md:h-[600px]"
          style={{
            '--handle-color': accentColor,
          } as React.CSSProperties}
        />

        {/* Labels */}
        <div className="absolute top-4 left-4 px-4 py-2 bg-black/60 backdrop-blur-md rounded-full text-white font-['Gibson'] text-sm font-semibold">
          Before
        </div>
        <div className="absolute top-4 right-4 px-4 py-2 bg-black/60 backdrop-blur-md rounded-full text-white font-['Gibson'] text-sm font-semibold">
          After
        </div>
      </div>
    </div>
  );
}
