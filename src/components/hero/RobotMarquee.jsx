import React, { useRef, useEffect, useMemo, useState } from 'react';
import gsap from 'gsap';

// Curated 8 cinematic robot portraits matching the reference design
const ROBOT_IMAGES = [
  {
    src: 'https://images.unsplash.com/photo-1546776310-eef45dd6d63c?w=800&auto=format&fit=crop&q=80',
    alt: 'White AI android operative with beanie',
  },
  {
    src: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
    alt: 'Dark pilot helmet with cyber HUD grid visor',
  },
  {
    src: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=800&auto=format&fit=crop&q=80',
    alt: 'Armored stealth mech warrior in hangar',
  },
  {
    src: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&auto=format&fit=crop&q=80',
    alt: 'Neon core cyber android unit',
  },
  {
    src: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80',
    alt: 'Red industrial combat robotics unit',
  },
  {
    src: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=800&auto=format&fit=crop&q=80',
    alt: 'Cyan and yellow cyber helmet explorer',
  },
  {
    src: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80',
    alt: 'Astronaut telemetry readout visor unit',
  },
  {
    src: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=800&auto=format&fit=crop&q=80',
    alt: 'Futuristic AI cybernetic humanoid',
  },
];

// Subtle floating particle positions
const PARTICLES = [
  { x: 15, y: 25, size: 2.5, opacity: 0.35, duration: 6, delay: 0 },
  { x: 28, y: 70, size: 3, opacity: 0.25, duration: 8, delay: 1 },
  { x: 42, y: 35, size: 2, opacity: 0.4, duration: 7, delay: 2 },
  { x: 58, y: 65, size: 2.5, opacity: 0.3, duration: 9, delay: 0.5 },
  { x: 72, y: 30, size: 3, opacity: 0.35, duration: 6.5, delay: 1.5 },
  { x: 85, y: 75, size: 2, opacity: 0.2, duration: 8.5, delay: 2.5 },
  { x: 50, y: 20, size: 3.5, opacity: 0.45, duration: 7.5, delay: 1.2 },
];

export function RobotMarquee({
  images = ROBOT_IMAGES,
  speed = 10, // degrees per second
  cardWidth = '11em', // smaller card width as requested
  cardAspectRatio = '7/10',
  perspective = '60em',
  className = '',
}) {
  const containerRef = useRef(null);
  const stageRef = useRef(null);

  const count = images.length;
  const angleStep = 360 / count;

  // Semi-circle tunnel radius: proportioned so cards form a gentle amphitheater
  const computedRadius = useMemo(() => {
    const numericWidth = parseFloat(cardWidth) || 11;
    const unit = cardWidth.replace(/[\d.-]/g, '') || 'em';
    // Calculate radius to form a broad, sweeping semi-circular tunnel
    const baseRadius = numericWidth / (2 * Math.tan(Math.PI / count));
    const wideRadius = Math.max(34, Math.round(baseRadius * 1.35));
    return `${wideRadius}${unit}`;
  }, [cardWidth, count]);

  // Motion state
  const rotationRef = useRef(0);
  const velocityRef = useRef(0);
  const isDraggingRef = useRef(false);
  const lastXRef = useRef(0);
  const isHoveredRef = useRef(false);

  // Continuous Right-to-Left movement powered by GSAP ticker
  useEffect(() => {
    // When stage rotates negatively (-deg), front cards (+Z) move from RIGHT to LEFT
    const moveSpeed = -Math.abs(speed); // Negative rotation moves right-to-left

    const onTick = (time, deltaTime) => {
      // deltaTime is in ms from GSAP
      const deltaSeconds = Math.min(0.08, deltaTime / 1000);

      if (!isDraggingRef.current) {
        if (Math.abs(velocityRef.current) > 0.05) {
          rotationRef.current += velocityRef.current * deltaSeconds * 60;
          velocityRef.current *= 0.94; // Inertial decay
        } else {
          velocityRef.current = 0;
          // Slow down to 25% when user hovers over the gallery
          const currentSpeed = isHoveredRef.current ? moveSpeed * 0.22 : moveSpeed;
          rotationRef.current += currentSpeed * deltaSeconds;
        }

        // Keep rotation bounded within 0-360 for numerical stability
        rotationRef.current = (rotationRef.current % 360 + 360) % 360;

        if (stageRef.current) {
          stageRef.current.style.transform = `rotateY(${rotationRef.current.toFixed(2)}deg)`;
        }
      }
    };

    gsap.ticker.add(onTick);
    return () => gsap.ticker.remove(onTick);
  }, [speed]);

  // Pointer drag controls (smooth drag to examine or spin)
  const handlePointerDown = (e) => {
    isDraggingRef.current = true;
    lastXRef.current = e.clientX;
    velocityRef.current = 0;
  };

  const handlePointerMove = (e) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - lastXRef.current;
    lastXRef.current = e.clientX;

    // Convert pixel drag into rotational delta
    const angleDelta = deltaX * 0.26;
    rotationRef.current += angleDelta;
    velocityRef.current = angleDelta * 0.55;

    if (stageRef.current) {
      stageRef.current.style.transform = `rotateY(${rotationRef.current.toFixed(2)}deg)`;
    }
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-[380px] sm:h-[440px] md:h-[500px] flex items-center justify-center select-none overflow-hidden cursor-grab active:cursor-grabbing ${className}`}
      style={{
        perspective,
        WebkitPerspective: perspective,
        perspectiveOrigin: '50% 50%',
        WebkitPerspectiveOrigin: '50% 50%',
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onMouseEnter={() => {
        isHoveredRef.current = true;
      }}
      onMouseLeave={() => {
        isHoveredRef.current = false;
        isDraggingRef.current = false;
      }}
    >
      {/* ── AMBIENT NEON-GREEN GLOW & LIGHTING ── */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Radial neon-green glow behind central robot images */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[460px] bg-[radial-gradient(ellipse_60%_45%_at_50%_50%,rgba(140,207,66,0.32)_0%,rgba(45,120,25,0.12)_45%,transparent_75%)] blur-3xl pointer-events-none" />

        {/* Subtle horizontal green horizon flare */}
        <div className="absolute top-1/2 left-0 right-0 h-32 -translate-y-1/2 bg-gradient-to-r from-transparent via-[#8CCF42]/18 to-transparent blur-2xl pointer-events-none" />

        {/* Floating green ambient particles */}
        {PARTICLES.map((p, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-[#8CCF42] animate-pulse pointer-events-none"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              opacity: p.opacity,
              boxShadow: '0 0 10px #8CCF42',
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}
      </div>

      {/* ── 3D CYLINDRICAL STAGE (Continuous Right-to-Left Infinite Loop) ── */}
      <div
        ref={stageRef}
        className="relative flex items-center justify-center pointer-events-auto z-10"
        style={{
          width: cardWidth,
          aspectRatio: cardAspectRatio,
          transformStyle: 'preserve-3d',
          transformOrigin: '50% 50%',
          willChange: 'transform',
        }}
      >
        {images.map((item, index) => {
          const angle = index * angleStep;

          return (
            <div
              key={index}
              className="absolute inset-0 rounded-2xl overflow-hidden border border-zinc-800/80 bg-[#0d0d0f] shadow-[0_12px_40px_rgba(0,0,0,0.9)] group transition-all duration-300 hover:border-[#8CCF42]/80 hover:shadow-[0_0_30px_rgba(140,207,66,0.45)]"
              style={{
                transformStyle: 'preserve-3d',
                transformOrigin: '50% 50%',
                transform: `rotateY(${angle}deg) translateZ(${computedRadius})`,
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
              }}
            >
              {/* Image */}
              <img
                src={item.src}
                alt={item.alt || `AI Robot ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 pointer-events-none"
                loading="eager"
                onError={(e) => {
                  e.currentTarget.src =
                    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80';
                }}
              />

              {/* Subtle dark gradient overlay to blend into pure black */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-black/35 pointer-events-none" />

              {/* Minimalist fine border line at base */}
              <div className="absolute bottom-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#8CCF42]/50 to-transparent opacity-60 group-hover:opacity-100 transition-opacity" />
            </div>
          );
        })}
      </div>

      {/* ── VERTICAL GREEN LASER LIGHT BEAM NEAR CENTER (From Reference) ── */}
      <div className="absolute top-6 bottom-6 left-1/2 -translate-x-1/2 w-[2px] bg-gradient-to-b from-transparent via-[#8CCF42] to-transparent shadow-[0_0_24px_#8CCF42] z-20 pointer-events-none opacity-90" />
      <div className="absolute top-12 bottom-12 left-1/2 -translate-x-1/2 w-6 bg-gradient-to-b from-transparent via-[#8CCF42]/30 to-transparent blur-md z-20 pointer-events-none" />

      {/* ── SOFT VIGNETTE AROUND THE EDGES (Blending Seamlessly into #000000) ── */}
      <div className="absolute inset-y-0 left-0 w-28 sm:w-56 md:w-72 bg-gradient-to-r from-black via-black/85 to-transparent pointer-events-none z-20" />
      <div className="absolute inset-y-0 right-0 w-28 sm:w-56 md:w-72 bg-gradient-to-l from-black via-black/85 to-transparent pointer-events-none z-20" />
    </div>
  );
}

export default RobotMarquee;
