'use client';

import { useRef } from 'react';
import { TextOpacity } from '@/components/dom/animations';
import styles from '@/styles/sections/aboutQuote.module.css';

export default function AboutQuote() {
  const rootRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);

  return (
    <section ref={rootRef} className={styles.root}>
      <h3 ref={textRef} className={styles.text}>
        <TextOpacity trigger={rootRef.current}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt
          ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
          ullamco laboris.
        </TextOpacity>
      </h3>
    </section>
  );
}
