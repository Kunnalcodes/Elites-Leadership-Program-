import React, { useState, useEffect, useRef, useMemo } from 'react';

// Curated high-fidelity futuristic cyber, robotics, and Thread Elite leadership portraits
const DEFAULT_IMAGES = [
  'https://images.unsplash.com/photo-1546776310-eef45dd6d63c?w=800&auto=format&fit=crop&q=80', // White robot helmet with beanie
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80', // Dark pilot HUD grid visor
  'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=800&auto=format&fit=crop&q=80', // Armored mech warrior in hangar
  'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&auto=format&fit=crop&q=80', // Neon green/orange cyber operative
  'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80', // Red industrial combat robot
  'https://images.unsplash.com/photo-1563089145-599997674d42?w=800&auto=format&fit=crop&q=80', // Cyan & yellow cyber helmet explorer
  'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80', // Astronaut telemetry readout visor
  '/card-front-dhiraj.png',                                                                        // Thread Elite Cadet Dhiraj
  '/card-front-piyush.png',                                                                        // Thread Elite Cadet Piyush
  '/card-front-kalpana.png',                                                                       // Thread Elite Cadet Kalpana
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80', // Tactical cybersecurity operator
  'https://images.unsplash.com/photo-1544256718-3bcf237f3974?w=800&auto=format&fit=crop&q=80', // Matrix digital terminal operative
];

export function ImageSlider3D({
  images = DEFAULT_IMAGES,
  duration = 30,
  cardWidth = '14.5em',
  perspective = '50em',
  cardAspectRatio = '7/10',
  withMask = true,
  rotationDirection = 'left',
  pauseOnHover = true,
  radius: customRadius,
  className = '',
}) {
  const containerRef = useRef(null);
  const stageRef = useRef(null);

  const cardList = useMemo(() => {
    return images && images.length >= 6 ? images : DEFAULT_IMAGES;
  }, [images]);

  const count = cardList.length;
  const angleStep = 360 / count;

  // Semi-circle curved radius: broad panoramic amphitheater arc
  const computedRadius = useMemo(() => {
    if (customRadius) return customRadius;
    const numericWidth = parseFloat(cardWidth) || 14.5;
    const unit = cardWidth.replace(/[\d.-]/g, '') || 'em';
    // Calculate radius to form a broad, sweeping semi-circular amphitheater
    const baseRadius = (numericWidth / (2 * Math.tan(Math.PI / count)));
    const wideRadius = Math.max(42, Math.round(baseRadius * 1.4));
    return `${wideRadius}${unit}`;
  }, [cardWidth, count, customRadius]);

  // High-performance continuous animation & drag rotation loop using RAF
  const rotationRef = useRef(0);
  const velocityRef = useRef(0);
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const lastXRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const isHoveredRef = useRef(false);

  // Direction factor (-1 for left, 1 for right)
  const dirFactor = rotationDirection === 'right' ? 1 : -1;
  const baseSpeed = (360 / Math.max(10, duration)) * dirFactor; // degrees per second

  useEffect(() => {
    let animationFrameId;

    const animate = (currentTime) => {
      const deltaSeconds = Math.min(0.1, (currentTime - lastTimeRef.current) / 1000);
      lastTimeRef.current = currentTime;

      if (!isDraggingRef.current) {
        // Apply inertia if there is lingering drag velocity
        if (Math.abs(velocityRef.current) > 0.05) {
          rotationRef.current += velocityRef.current * deltaSeconds * 60;
          velocityRef.current *= 0.94; // Inertial decay
        } else {
          velocityRef.current = 0;
          // Smooth auto-scroll speed: slow down to 20% on hover for readability
          const currentSpeed = isHoveredRef.current && pauseOnHover
            ? baseSpeed * 0.18
            : baseSpeed;
          rotationRef.current += currentSpeed * deltaSeconds;
        }

        // Keep rotation within 0-360deg bounds for numerical precision
        rotationRef.current = (rotationRef.current % 360 + 360) % 360;

        // Direct hardware-accelerated style update on stage element (zero React re-renders)
        if (stageRef.current) {
          stageRef.current.style.transform = `rotateY(${rotationRef.current.toFixed(2)}deg)`;
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    lastTimeRef.current = performance.now();
    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [baseSpeed, pauseOnHover]);

  // Pointer drag interactions
  const handlePointerDown = (e) => {
    isDraggingRef.current = true;
    dragStartXRef.current = e.clientX;
    lastXRef.current = e.clientX;
    velocityRef.current = 0;
  };

  const handlePointerMove = (e) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - lastXRef.current;
    lastXRef.current = e.clientX;

    // Convert pixel horizontal drag into rotational angle delta
    const angleDelta = deltaX * 0.28;
    rotationRef.current += angleDelta;
    velocityRef.current = angleDelta * 0.6;

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
      className={`relative w-full h-full flex items-center justify-center select-none overflow-hidden cursor-grab active:cursor-grabbing ${className}`}
      style={{
        perspective,
        WebkitPerspective: perspective,
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
      {/* ── ENTIRE BACKGROUND HIGHLIGHT & ILLUMINATION ── */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Massive vibrant green & violet radial spotlight illuminating the entire backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1300px] h-[650px] bg-[radial-gradient(ellipse_75%_55%_at_50%_50%,rgba(140,207,66,0.30)_0%,rgba(128,0,255,0.24)_42%,rgba(8,7,12,0.6)_70%,transparent_100%)] blur-3xl pointer-events-none" />

        {/* Horizontal cyber neon horizon arc */}
        <div className="absolute top-1/2 left-0 right-0 h-40 -translate-y-1/2 bg-gradient-to-r from-transparent via-[#8CCF42]/25 to-transparent blur-2xl pointer-events-none" />

        {/* Ambient lower floor green energy reflection */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-full max-w-4xl h-24 bg-gradient-to-t from-[#8CCF42]/20 to-transparent blur-xl pointer-events-none" />
      </div>

      {/* ── 3D Semi-Circle Curved Stage ── */}
      <div
        ref={stageRef}
        className="relative flex items-center justify-center pointer-events-auto z-10"
        style={{
          width: cardWidth,
          aspectRatio: cardAspectRatio,
          transformStyle: 'preserve-3d',
          willChange: 'transform',
        }}
      >
        {cardList.map((src, index) => {
          const angle = index * angleStep;

          return (
            <div
              key={index}
              className="absolute inset-0 rounded-2xl overflow-hidden border border-white/20 bg-[#15111F]/90 shadow-[0_15px_45px_rgba(0,0,0,0.9)] group transition-all duration-300 hover:border-[#8CCF42] hover:shadow-[0_0_35px_rgba(140,207,66,0.5)]"
              style={{
                transformStyle: 'preserve-3d',
                transform: `rotateY(${angle}deg) translateZ(${computedRadius})`,
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
              }}
            >
              {/* Image */}
              <img
                src={src}
                alt={`Cadet Telemetry ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 pointer-events-none"
                loading="eager"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80';
                }}
              />

              {/* Cyber scanline & gradient shading */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#08070C] via-black/20 to-transparent pointer-events-none" />

              {/* Technical corner brackets */}
              <span className="absolute top-2.5 left-2.5 w-2.5 h-2.5 border-t-2 border-l-2 border-[#8CCF42]/80 pointer-events-none" />
              <span className="absolute bottom-2.5 right-2.5 w-2.5 h-2.5 border-b-2 border-r-2 border-[#8CCF42]/80 pointer-events-none" />

              {/* Bottom Card Monogram Status Badge */}
              <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-[9px] font-mono font-bold text-white/90 px-2.5 py-1 rounded-md bg-[#08070C]/85 backdrop-blur-md border border-white/10 pointer-events-none">
                <span className="text-[#8CCF42] tracking-wider">ELITE OPERATIVE</span>
                <span className="text-[#BD7AFF] tracking-widest uppercase">#{index + 1 < 10 ? `0${index + 1}` : index + 1}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Smooth vignette fade on the left & right edges to soften semi-circle entry/exit */}
      {withMask && (
        <>
          <div className="absolute inset-y-0 left-0 w-32 sm:w-64 md:w-80 bg-gradient-to-r from-[#08070C] via-[#08070C]/80 to-transparent pointer-events-none z-20" />
          <div className="absolute inset-y-0 right-0 w-32 sm:w-64 md:w-80 bg-gradient-to-l from-[#08070C] via-[#08070C]/80 to-transparent pointer-events-none z-20" />
        </>
      )}
    </div>
  );
}

export function ThreeDImageSliderDemo() {
  return (
    <div className="w-full h-[600px] flex items-center justify-center bg-[#fff3ed] dark:bg-black rounded-xl overflow-hidden relative">
      <ImageSlider3D duration={32} cardWidth="15em" />
    </div>
  );
}

export default ImageSlider3D;