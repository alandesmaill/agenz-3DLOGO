'use client';

import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';

interface FAQ {
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  faqs: FAQ[];
  accentColor: string;
}

export default function FAQAccordion({ faqs, accentColor }: FAQAccordionProps) {
  const [openItems, setOpenItems] = useState<number[]>([]);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const iconRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Initialize content heights to 0
  useEffect(() => {
    contentRefs.current.forEach((content) => {
      if (content) {
        content.style.height = '0px';
        content.style.opacity = '0';
      }
    });
  }, []);

  const handleToggle = (index: number) => {
    const isOpen = openItems.includes(index);
    const content = contentRefs.current[index];
    const icon = iconRefs.current[index];

    if (!content || !icon) return;

    if (isOpen) {
      // Close the item
      gsap.to(content, {
        height: 0,
        opacity: 0,
        duration: 0.4,
        ease: 'power2.inOut',
      });

      gsap.to(icon, {
        rotation: 0,
        duration: 0.3,
        ease: 'power2.out',
      });

      setOpenItems(openItems.filter((i) => i !== index));
    } else {
      // Open the item
      const fullHeight = content.scrollHeight;

      gsap.to(content, {
        height: fullHeight,
        opacity: 1,
        duration: 0.4,
        ease: 'power2.inOut',
      });

      gsap.to(icon, {
        rotation: 45,
        duration: 0.3,
        ease: 'power2.out',
      });

      setOpenItems([...openItems, index]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Section heading */}
      <h2 className="text-3xl md:text-4xl font-['Gibson'] font-bold text-gray-900 mb-8 text-center">
        Frequently Asked Questions
      </h2>

      {/* FAQ items */}
      <div className="space-y-4">
        {faqs.map((faq, index) => {
          const isOpen = openItems.includes(index);

          return (
            <div
              key={index}
              className="
                rounded-2xl
                bg-white/80 backdrop-blur-xl
                border border-white/30
                shadow-lg
                overflow-hidden
                transition-shadow duration-300
                hover:shadow-2xl
              "
            >
              {/* Question button */}
              <button
                onClick={() => handleToggle(index)}
                className="
                  w-full
                  px-6 md:px-8 py-5 md:py-6
                  flex items-center justify-between gap-4
                  text-left
                  transition-colors duration-200
                  hover:bg-white/50
                "
                aria-expanded={isOpen}
                aria-controls={`faq-answer-${index}`}
              >
                <span
                  className="
                    text-lg md:text-xl
                    font-['Gibson'] font-bold
                    text-gray-900
                    leading-tight
                  "
                >
                  {faq.question}
                </span>

                {/* Plus/X icon */}
                <div
                  ref={(el) => { iconRefs.current[index] = el; }}
                  className="
                    flex-shrink-0
                    w-8 h-8
                    rounded-full
                    flex items-center justify-center
                    transition-colors duration-200
                  "
                  style={{
                    backgroundColor: `${accentColor}20`,
                    border: `2px solid ${accentColor}60`,
                  }}
                >
                  <div className="relative w-4 h-4">
                    {/* Horizontal bar */}
                    <div
                      className="absolute top-1/2 left-0 w-full h-0.5 -translate-y-1/2"
                      style={{ backgroundColor: accentColor }}
                    />
                    {/* Vertical bar */}
                    <div
                      className="absolute left-1/2 top-0 w-0.5 h-full -translate-x-1/2"
                      style={{ backgroundColor: accentColor }}
                    />
                  </div>
                </div>
              </button>

              {/* Answer content (animated) */}
              <div
                ref={(el) => { contentRefs.current[index] = el; }}
                id={`faq-answer-${index}`}
                className="overflow-hidden"
                style={{ height: 0, opacity: 0 }}
              >
                <div className="px-6 md:px-8 pb-5 md:pb-6">
                  <p className="font-['Gibson'] text-gray-700 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
