'use client';

import { forwardRef, useEffect, useRef, useState } from 'react';

const CHAR_SET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&';

interface NavPieceLabelProps {
  label: 'ABOUT' | 'WORKS' | 'SERVICES' | 'CONTACT';
  section: string;
  isVisible: boolean;
  onNavigationClick?: (section: string) => void;
  delay?: number;
}

const NavPieceLabel = forwardRef<HTMLDivElement, NavPieceLabelProps>(function NavPieceLabel({
  label,
  section,
  isVisible,
  onNavigationClick,
  delay = 0,
}, ref) {
  const [displayText, setDisplayText]   = useState<string>(label);
  const [lockedCount, setLockedCount]   = useState(0);
  const [glitchDone, setGlitchDone]     = useState(false);
  const [opacity, setOpacity]           = useState(0);
  const [hovered, setHovered]           = useState(false);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    if (!isVisible) {
      setOpacity(0);
      setDisplayText(label);
      setLockedCount(0);
      setGlitchDone(false);
      hasAnimatedRef.current = false;
      return;
    }

    // Only animate once per visible appearance
    if (hasAnimatedRef.current) return;
    hasAnimatedRef.current = true;

    const startTimer = setTimeout(() => {
      // Fade in as glitch begins
      setOpacity(1);

      let frame = 0;
      // 16 frames × 50ms = 800ms total
      const interval = setInterval(() => {
        frame++;

        if (frame >= 16) {
          setDisplayText(label);
          setLockedCount(label.length);
          setGlitchDone(true);
          clearInterval(interval);
          return;
        }

        if (frame < 8) {
          // Phase 1: all chars scramble
          setDisplayText(
            label.split('').map(() =>
              CHAR_SET[Math.floor(Math.random() * CHAR_SET.length)]
            ).join('')
          );
          setLockedCount(0);
        } else {
          // Phase 2: lock in left-to-right
          const locked = Math.floor((frame - 8) * label.length / 8) + 1;
          setLockedCount(locked);
          setDisplayText(
            label.split('').map((char, i) =>
              i < locked
                ? char
                : CHAR_SET[Math.floor(Math.random() * CHAR_SET.length)]
            ).join('')
          );
        }
      }, 50);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(startTimer);
  }, [isVisible, label, delay]);

  return (
    <div
      ref={ref}
      className="fixed z-50 cursor-pointer select-none"
      style={{
        left: '-9999px',
        top: '-9999px',
        transform: `translate(-50%, -130%) scale(${hovered ? 1.05 : 1.0})`,
        opacity,
        // No transition on left/top — real-time tracking via imperative DOM updates
        transition: 'opacity 800ms ease-out, transform 200ms ease',
        pointerEvents: isVisible ? 'auto' : 'none',
      }}
      onClick={() => onNavigationClick?.(section)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Glass pill */}
      <div
        style={{
          position: 'relative',
          padding: '6px 14px 7px',
          background: 'rgba(5,5,5,0.85)',
          backgroundImage: 'linear-gradient(135deg, rgba(0,233,44,0.06), rgba(0,255,255,0.10))',
          backdropFilter: 'blur(12px) saturate(200%)',
          WebkitBackdropFilter: 'blur(12px) saturate(200%)',
          borderRadius: '4px',
          border: hovered
            ? '1px solid rgba(0,255,255,0.50)'
            : '1px solid rgba(0,255,255,0.20)',
          boxShadow: hovered
            ? '0 0 20px rgba(0,255,255,0.35)'
            : '0 0 12px rgba(0,255,255,0.15)',
          transition: 'border-color 200ms ease, box-shadow 200ms ease',
          overflow: 'hidden',
        }}
      >
        {/* Top highlight line */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
          }}
        />

        {/* Label text */}
        <span
          style={{
            display: 'inline-block',
            fontFamily: 'Gibson, sans-serif',
            fontWeight: 700,
            fontSize: '11px',
            letterSpacing: '0.25em',
            fontVariantNumeric: 'tabular-nums',
            minWidth: `${label.length}ch`,
          }}
        >
          {displayText.split('').map((char, i) => (
            <span
              key={i}
              style={{
                color: i < lockedCount ? '#00ffff' : '#ffffff',
                textShadow: i < lockedCount
                  ? '0 0 8px rgba(0,255,255,0.9)'
                  : '0 0 4px rgba(255,255,255,0.5)',
                transition: 'color 100ms ease',
              }}
            >
              {char}
            </span>
          ))}
        </span>

        {/* Green underline slides in on hover */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: '14px',
            right: '14px',
            height: '1px',
            background: 'linear-gradient(90deg, #00e92c, #00ffff)',
            transform: `scaleX(${hovered ? 1 : 0})`,
            transformOrigin: 'left center',
            transition: 'transform 200ms ease',
          }}
        />
      </div>
    </div>
  );
});

export default NavPieceLabel;
