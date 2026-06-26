import React, { useEffect, useState } from 'react';

interface Seed {
  id: number;
  left: number; // percentage (0 - 100)
  size: number; // diameter in px
  delay: number; // seconds
  duration: number; // seconds
  opacity: number;
}

export const DandelionSeeds: React.FC = () => {
  const [seeds, setSeeds] = useState<Seed[]>([]);

  useEffect(() => {
    // Dynamically optimize particle count for mobile screens to prevent GPU lag & freezing
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const seedCount = isMobile ? 3 : 14;

    const newSeeds: Seed[] = Array.from({ length: seedCount }).map((_, i) => {
      const left = Math.random() * 100;
      const size = isMobile ? Math.random() * 10 + 6 : Math.random() * 16 + 8; // slightly smaller on mobile
      const delay = Math.random() * -15; // start in different phases
      const duration = Math.random() * 10 + 12; // 12s to 22s
      const opacity = isMobile ? Math.random() * 0.2 + 0.1 : Math.random() * 0.4 + 0.15; // softer on mobile

      return {
        id: i,
        left,
        size,
        delay,
        duration,
        opacity,
      };
    });

    setSeeds(newSeeds);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {seeds.map((seed) => (
        <div
          key={seed.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: `${seed.left}%`,
            width: `${seed.size}px`,
            height: `${seed.size}px`,
            bottom: '-40px',
            opacity: seed.opacity,
            animationName: 'floatUp',
            animationDuration: `${seed.duration}s`,
            animationDelay: `${seed.delay}s`,
            animationIterationCount: 'infinite',
            animationTimingFunction: 'linear',
          }}
        >
          {/* A delicate, hand-drawn look dandelion seed SVG */}
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            className="text-sky-300/40"
            style={{ width: '100%', height: '100%' }}
          >
            {/* Center stem */}
            <line x1="12" y1="24" x2="12" y2="12" strokeWidth="0.8" />
            {/* Fluff seeds radiating from center */}
            <line x1="12" y1="12" x2="6" y2="6" strokeWidth="0.5" />
            <line x1="12" y1="12" x2="18" y2="6" strokeWidth="0.5" />
            <line x1="12" y1="12" x2="4" y2="12" strokeWidth="0.5" />
            <line x1="12" y1="12" x2="20" y2="12" strokeWidth="0.5" />
            <line x1="12" y1="12" x2="8" y2="16" strokeWidth="0.5" />
            <line x1="12" y1="12" x2="16" y2="16" strokeWidth="0.5" />
            <line x1="12" y1="12" x2="12" y2="4" strokeWidth="0.5" strokeWidth-dasharray="1 1" />
            {/* Miniature seed heads */}
            <circle cx="6" cy="6" r="0.5" fill="currentColor" />
            <circle cx="18" cy="6" r="0.5" fill="currentColor" />
            <circle cx="4" cy="12" r="0.5" fill="currentColor" />
            <circle cx="20" cy="12" r="0.5" fill="currentColor" />
            <circle cx="12" cy="4" r="0.6" fill="currentColor" />
          </svg>
        </div>
      ))}
    </div>
  );
};
