'use client';

import { useEffect, useState } from 'react';

const ANIMATION_COOLDOWN_KEY = 'warp-animation-last-shown';
const COOLDOWN_HOURS = 24;

// Generate random star positions
const generateStars = (count: number) => {
  return Array.from({ length: count }, () => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 1,
    speed: Math.random() * 0.5 + 0.5,
  }));
};

export default function WarpAnimation() {
  const [showAnimation, setShowAnimation] = useState(false);
  const [animationPhase, setAnimationPhase] = useState<'hyperdrive' | 'decelerate' | 'reveal'>('hyperdrive');

  useEffect(() => {
    // Check if animation should be shown
    const lastShown = localStorage.getItem(ANIMATION_COOLDOWN_KEY);
    const now = Date.now();
    
    if (!lastShown) {
      // First time visit
      setShowAnimation(true);
      localStorage.setItem(ANIMATION_COOLDOWN_KEY, now.toString());
    } else {
      const hoursSinceLastShown = (now - parseInt(lastShown)) / (1000 * 60 * 60);
      if (hoursSinceLastShown >= COOLDOWN_HOURS) {
        // Cooldown expired, show again
        setShowAnimation(true);
        localStorage.setItem(ANIMATION_COOLDOWN_KEY, now.toString());
      }
    }
  }, []);

  useEffect(() => {
    if (!showAnimation) return;

    // Phase 1: Hyperdrive (1.5s)
    const hyperdriveTimer = setTimeout(() => {
      setAnimationPhase('decelerate');
    }, 1500);

    // Phase 2: Decelerate (1s)
    const decelerateTimer = setTimeout(() => {
      setAnimationPhase('reveal');
    }, 2500);

    // Phase 3: Complete and hide (0.5s fade)
    const completeTimer = setTimeout(() => {
      setShowAnimation(false);
    }, 3500);

    return () => {
      clearTimeout(hyperdriveTimer);
      clearTimeout(decelerateTimer);
      clearTimeout(completeTimer);
    };
  }, [showAnimation]);

  if (!showAnimation) return null;

  const stars = generateStars(100);

  return (
    <div className={`warp-overlay ${animationPhase === 'reveal' ? 'warp-fade-out' : ''}`}>
      {/* Star field layers for parallax effect */}
      <div className={`warp-starfield ${animationPhase === 'hyperdrive' ? 'warp-speed' : animationPhase === 'decelerate' ? 'warp-slow' : ''}`}>
        {stars.map((star, i) => (
          <div
            key={i}
            className="warp-star"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              animationDelay: `${Math.random() * 0.5}s`,
              animationDuration: `${1 / star.speed}s`,
            }}
          />
        ))}
      </div>

      {/* Speed lines for hyperdrive effect */}
      {animationPhase === 'hyperdrive' && (
        <div className="warp-speed-lines">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="warp-speed-line"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 0.3}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Center glow effect */}
      <div className={`warp-center-glow ${animationPhase === 'decelerate' ? 'warp-glow-expand' : ''}`} />
    </div>
  );
}
