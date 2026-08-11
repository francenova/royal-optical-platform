'use client';

import { useEffect, useRef, useState } from 'react';

interface CarouselProps {
  children: React.ReactNode;
  /** Adds left scroll-margin to the first item so it isn't flush against the screen edge. */
  edge?: boolean;
  /** Renders muted dots suited for a dark background. */
  dotsOnDark?: boolean;
  className?: string;
}

export function Carousel({ children, edge = false, dotsOnDark = false, className = '' }: CarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    setCount(track.children.length);

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const first = track.children[0] as HTMLElement | undefined;
        if (first) {
          const style = getComputedStyle(track);
          const gap = parseFloat(style.columnGap || style.gap || '16') || 16;
          const itemW = first.getBoundingClientRect().width + gap;
          const idx = Math.round(track.scrollLeft / itemW);
          const clamped = Math.max(0, Math.min(idx, track.children.length - 1));
          setActiveIndex(clamped);
        }
        ticking = false;
      });
    };
    track.addEventListener('scroll', onScroll, { passive: true });
    return () => track.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div>
      <div ref={trackRef} className={`snap-row ${edge ? 'snap-edge' : ''} ${className}`}>
        {children}
      </div>
      {count > 1 && (
        <div className="carousel-dots mt-4">
          {Array.from({ length: count }).map((_, i) => (
            <span
              key={i}
              className={`carousel-dot ${dotsOnDark ? 'dot-on-dark' : ''} ${i === activeIndex ? 'active' : ''}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
