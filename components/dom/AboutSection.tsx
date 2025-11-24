'use client';

import { useCallback, useMemo, useRef, useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, PerspectiveCamera } from '@react-three/drei';
import { Physics } from '@react-three/rapier';
import { gsap } from 'gsap';
import FloatingSpheres from '@/components/canvas/FloatingSpheres';
import InfiniteText from './InfiniteText';

interface RectPosition {
  index: number;
  x: string;
  y: string;
}

interface AboutSectionProps {
  onBack?: () => void;
}

// Helper functions for rectangle animation
const moveRect = (rect: RectPosition, direction: string, gridWidth: number, gridHeight: number) => {
  const moveMap: { [key: string]: () => void } = {
    left: () => {
      rect.x = `${(parseFloat(rect.x) - gridWidth).toFixed(2)}%`;
    },
    right: () => {
      rect.x = `${(parseFloat(rect.x) + gridWidth).toFixed(2)}%`;
    },
    up: () => {
      rect.y = `${(parseFloat(rect.y) - gridHeight).toFixed(2)}%`;
    },
    down: () => {
      rect.y = `${(parseFloat(rect.y) + gridHeight).toFixed(2)}%`;
    },
  };
  moveMap[direction]?.();
};

const arePositionsEqual = (pos1: RectPosition, pos2: RectPosition) =>
  pos1.x === pos2.x && pos1.y === pos2.y;

const isPositionOccupied = (rects: RectPosition[], pos: RectPosition) =>
  rects.some((rect) => arePositionsEqual(rect, pos));

const performMoves = (rectangles: RectPosition[], gridWidth: number, gridHeight: number) => {
  const totalGroups = Math.floor(Math.random() * 8) + 1;
  const allMovements: { index: number; x: string; y: string }[][] = [];

  for (let i = 0; i < totalGroups; i++) {
    const validMoves: { index: number; x: string; y: string }[] = [];
    const togetherMoves = Math.floor(Math.random() * 3) + 1;

    for (let k = 0; k < togetherMoves; k++) {
      const randomRectIndex =
        k === 0 || validMoves.length === 0
          ? Math.floor(Math.random() * rectangles.length)
          : rectangles.findIndex(
              (_, idx) => !validMoves.some((move) => move.index === idx)
            );

      if (randomRectIndex === -1) break;

      const rect = { ...rectangles[randomRectIndex] };
      const originalPosition = { ...rectangles[randomRectIndex] };
      let validMove = false;

      ['left', 'right', 'up', 'down'].forEach((direction) => {
        if (validMove) return;

        moveRect(rect, direction, gridWidth, gridHeight);
        const newPosition = { ...rect };

        const { x, y } = { x: parseFloat(newPosition.x), y: parseFloat(newPosition.y) };
        if (
          x > -0.5 &&
          x < 90 &&
          y > -0.5 &&
          y < 90 &&
          !isPositionOccupied(rectangles, newPosition)
        ) {
          validMove = true;
          validMoves.push({ index: newPosition.index, x: newPosition.x, y: newPosition.y });
          Object.assign(rectangles[newPosition.index], newPosition);
        } else {
          Object.assign(rect, originalPosition);
        }
      });
    }

    if (validMoves.length > 0) {
      allMovements.push(validMoves);
    }
  }

  return allMovements;
};

export default function AboutSection({ onBack }: AboutSectionProps) {
  const [timeline, setTimeline] = useState<gsap.core.Timeline | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const rectRefs = useRef<(SVGRectElement | null)[]>([]);
  const svgRef = useRef<SVGSVGElement>(null);
  const divWrapper = useRef<HTMLDivElement>(null);

  // Initial rectangle positions for the mask effect
  const initialPositions = useMemo<RectPosition[]>(
    () => [
      { index: 0, x: '0.00%', y: '50.00%' },
      { index: 1, x: '16.67%', y: '0.00%' },
      { index: 2, x: '33.34%', y: '0.00%' },
      { index: 3, x: '50.01%', y: '0.00%' },
      { index: 4, x: '66.68%', y: '50.00%' },
      { index: 5, x: '83.35%', y: '50.00%' },
      { index: 6, x: '33.34%', y: '50.00%' },
    ],
    []
  );

  const gridWidth = 16.67;
  const gridHeight = 50.0;

  const animateRectangles = useCallback(
    (movements: { index: number; x: string; y: string }[][]) => {
      const tl = gsap.timeline({
        onComplete: () => {
          const newMovements = performMoves([...initialPositions], gridWidth, gridHeight);
          setTimeline(animateRectangles(newMovements));
        },
      });

      movements.forEach((movementGroup, groupIndex) => {
        movementGroup.forEach(({ index, x, y }, rectIndex) => {
          const rect = rectRefs.current[index];
          if (!rect) return;

          if (groupIndex === 0 && rectIndex === 0) {
            tl.to(
              rect,
              {
                ease: 'power2.inOut',
                duration: 1,
                attr: { x, y },
                delay: 2,
              },
              0
            );
          } else if (rectIndex === 0) {
            tl.to(
              rect,
              {
                ease: 'power2.inOut',
                duration: 1,
                attr: { x, y },
                delay: 0,
              },
              '>'
            );
          } else {
            tl.to(
              rect,
              {
                ease: 'power2.inOut',
                duration: 1,
                attr: { x, y },
                delay: 0,
              },
              '<'
            );
          }
        });
      });

      return tl;
    },
    [initialPositions]
  );

  useEffect(() => {
    if (timeline) {
      timeline.kill();
    }

    const newTimeline = animateRectangles(performMoves([...initialPositions], gridWidth, gridHeight));
    setTimeline(newTimeline);

    return () => {
      if (timeline) {
        timeline.kill();
      }
      newTimeline.kill();
    };
  }, [animateRectangles, initialPositions]);

  const onMouseEnter = () => {
    if (svgRef.current) gsap.to(svgRef.current, { autoAlpha: 0, duration: 0.3 });
    if (divWrapper.current) gsap.to(divWrapper.current, { autoAlpha: 0, duration: 0.3 });
  };

  const onMouseLeave = () => {
    if (svgRef.current) gsap.to(svgRef.current, { autoAlpha: 1, duration: 0.3 });
    if (divWrapper.current) gsap.to(divWrapper.current, { autoAlpha: 1, duration: 0.3 });
  };

  const renderRects = useMemo(
    () =>
      initialPositions.map(({ index, x, y }) => (
        <rect
          key={index}
          ref={(ref) => {
            rectRefs.current[index] = ref;
          }}
          x={x}
          y={y}
          width={`${gridWidth}%`}
          height={`${gridHeight}%`}
        />
      )),
    [initialPositions]
  );

  return (
    <section ref={rootRef} className="fixed inset-0 z-50 flex flex-col bg-gray-100">
      {/* Header - matching reference design */}
      <header className="flex-none flex items-center justify-between px-6 md:px-12 py-6 bg-gray-100 z-10">
        {/* Logo - Left */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 hover:opacity-70 transition-opacity"
          aria-label="Go back"
        >
          <img
            src="/Agenz-logo-black.svg"
            alt="Agenz logo"
            className="h-8 w-auto"
          />
        </button>

        {/* Right buttons - matching landing page Header */}
        <div className="flex items-center gap-3">
          <a
            href="mailto:contact@agenz.com"
            className="hidden md:flex px-5 py-2.5 text-sm font-bold text-black bg-transparent border border-gray-300 rounded-full hover:bg-gray-100 hover:border-gray-400 transition-all duration-200"
          >
            GET IN TOUCH
          </a>
          <button
            className="px-6 py-2.5 text-sm font-bold text-white bg-black rounded-full hover:bg-gray-800 transition-all duration-200"
          >
            MENU
          </button>
        </div>
      </header>

      {/* Top content area */}
      <div className="flex-none px-6 md:px-12 pt-4 pb-10 bg-gray-100">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
          {/* Title - Left */}
          <div className="flex flex-col max-w-2xl">
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-800 leading-tight">
              WE CREATE PURPOSEFUL CREATIVE WORK THAT WORKS
            </h2>
          </div>

          {/* Description - Right */}
          <div className="max-w-sm">
            <p className="text-sm md:text-base text-gray-500 leading-relaxed font-medium">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </div>
        </div>
      </div>

      {/* 3D Scene with SVG Mask - flex-1 to fill available space */}
      <div className="flex-1 min-h-0 relative mx-6 md:mx-12 rounded-2xl overflow-hidden">
        {/* Three.js Canvas */}
        <Canvas
          className="absolute inset-0 w-full h-full"
          style={{ backgroundColor: 'transparent', borderRadius: '1rem' }}
        >
          <Suspense fallback={null}>
            <PerspectiveCamera makeDefault position={[0, 0, 20]} fov={20} />
            <Physics interpolate timeStep={1 / 60} gravity={[0, 0, 0]}>
              <FloatingSpheres totalCount={18} transparentCount={5} />
            </Physics>
            <Environment preset="studio" />
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
          </Suspense>
        </Canvas>

        {/* SVG Mask Overlay */}
        <div
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          className="absolute inset-0 w-full h-full"
        >
          <svg
            ref={svgRef}
            width="100%"
            height="100%"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="block"
          >
            {/* Background that gets masked */}
            <rect
              x="0"
              y="0"
              width="100%"
              height="100.3%"
              fill="#f3f4f6"
              style={{ mask: 'url(#aboutMask)' }}
            />
            {/* Mask definition */}
            <mask id="aboutMask" x="0" y="0">
              <rect x="0" y="0" width="100%" height="100.3%" fill="white" />
              {renderRects}
            </mask>
          </svg>
          <div ref={divWrapper} />
        </div>
      </div>

      {/* Infinite "Scroll Down" text at bottom */}
      <div className="flex-none h-16 bg-gray-100 overflow-hidden mx-6 md:mx-12 mt-6 mb-8 flex items-center">
        <InfiniteText text="Scroll Down" length={20} className="h-full" />
      </div>
    </section>
  );
}
