import React, { useState, useEffect, useRef, useMemo } from 'react';

// Default curated Elite leadership & cybersecurity operative cards
const DEFAULT_RING_IMAGES = [
  {
    src: '/headshot-dhiraj.png',
    title: 'Dhiraj Roy',
    role: 'Lead Architect',
    rank: '#01',
    badge: 'CHAMPION',
  },
  {
    src: '/headshot-kalpana.png',
    title: 'Kalpana Sharma',
    role: 'Threat Intelligence',
    rank: '#02',
    badge: 'RED TEAM',
  },
  {
    src: '/headshot-piyush.png',
    title: 'Piyush Kumar',
    role: 'Cyber Infrastructure',
    rank: '#03',
    badge: 'SYSTEMS',
  },
  {
    src: '/elite-leader-archetype.jpg',
    title: 'Elite Candidate Seat',
    role: 'Cohort 2026',
    rank: '#04',
    badge: 'OPEN SEAT',
  },
  {
    src: '/card-front-dhiraj.png',
    title: 'Dhiraj · Credential',
    role: 'Catalyst Elite',
    rank: 'VERIFIED',
    badge: 'L5 SECURE',
  },
  {
    src: '/card-front-kalpana.png',
    title: 'Kalpana · Credential',
    role: 'Catalyst Elite',
    rank: 'VERIFIED',
    badge: 'L5 SECURE',
  },
  {
    src: '/card-front-piyush.png',
    title: 'Piyush · Credential',
    role: 'Catalyst Elite',
    rank: 'VERIFIED',
    badge: 'L5 SECURE',
  },
  {
    src: 'https://images.unsplash.com/photo-1546776310-eef45dd6d63c?w=800&auto=format&fit=crop&q=80',
    title: 'AI Systems Unit',
    role: 'Defensive Automation',
    rank: 'UNIT // 08',
    badge: 'OPERATIVE',
  },
];

/**
 * ThreeDImageRing - Draggable 3D Image Ring Component (Lightswind-compatible)
 * Features smooth physics, inertial drag, auto-rotation, 3D perspective, and touch controls.
 */
export function ThreeDImageRing({
  images = DEFAULT_RING_IMAGES,
  width = 240,
  height = 320,
  perspective = 1800,
  imageDistance,
  initialRotation = 0,
  autoRotate = true,
  autoRotateSpeed = 6, // degrees per second
  draggable = true,
  className = '',
  onImageClick,
}) {
  const containerRef = useRef(null);
  const ringRef = useRef(null);

  // Normalize image data
  const normalizedImages = useMemo(() => {
    if (!images || images.length === 0) return DEFAULT_RING_IMAGES;
    return images.map((item, idx) => {
      if (typeof item === 'string') {
        return {
          src: item,
          title: `Elite Member ${idx + 1}`,
          role: 'Cadet Operative',
          rank: `#0${idx + 1}`,
        };
      }
      return item;
    });
  }, [images]);

  const count = normalizedImages.length;
  const angleStep = 360 / count;

  // Calculate cylindrical radius distance based on item width and count
  const radius = useMemo(() => {
    if (imageDistance) return imageDistance;
    const baseRadius = width / (2 * Math.tan(Math.PI / count));
    return Math.max(380, Math.round(baseRadius * 1.35));
  }, [imageDistance, width, count]);

  // Motion and rotation physics refs
  const rotationRef = useRef(initialRotation);
  const velocityRef = useRef(0);
  const isDraggingRef = useRef(false);
  const lastXRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const isHoveredRef = useRef(false);

  useEffect(() => {
    let animationFrameId;

    const animate = (currentTime) => {
      const deltaSeconds = Math.min(0.08, (currentTime - lastTimeRef.current) / 1000);
      lastTimeRef.current = currentTime;

      if (!isDraggingRef.current) {
        if (Math.abs(velocityRef.current) > 0.05) {
          rotationRef.current += velocityRef.current * deltaSeconds * 60;
          velocityRef.current *= 0.94; // Inertial decay
        } else {
          velocityRef.current = 0;
          if (autoRotate) {
            // Gentle ambient rotation; slows down to 25% on hover
            const currentSpeed = isHoveredRef.current
              ? autoRotateSpeed * 0.25
              : autoRotateSpeed;
            rotationRef.current += currentSpeed * deltaSeconds;
          }
        }

        // Keep rotation within 0-360 range
        rotationRef.current = (rotationRef.current % 360 + 360) % 360;

        if (ringRef.current) {
          ringRef.current.style.transform = `rotateY(${rotationRef.current.toFixed(2)}deg)`;
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    lastTimeRef.current = performance.now();
    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [autoRotate, autoRotateSpeed]);

  // Pointer & Drag handlers
  const handlePointerDown = (e) => {
    if (!draggable) return;
    isDraggingRef.current = true;
    lastXRef.current = e.clientX;
    velocityRef.current = 0;
  };

  const handlePointerMove = (e) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - lastXRef.current;
    lastXRef.current = e.clientX;

    // Convert pixel drag into rotational angle
    const angleDelta = deltaX * 0.28;
    rotationRef.current += angleDelta;
    velocityRef.current = angleDelta * 0.6;

    if (ringRef.current) {
      ringRef.current.style.transform = `rotateY(${rotationRef.current.toFixed(2)}deg)`;
    }
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-[460px] sm:h-[520px] md:h-[580px] flex items-center justify-center select-none overflow-visible cursor-grab active:cursor-grabbing ${className}`}
      style={{
        perspective: `${perspective}px`,
        WebkitPerspective: `${perspective}px`,
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
      {/* ── AMBIENT CYBERNETIC BACKDROP GLOW ── */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Central green & purple radial spotlight */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[550px] bg-[radial-gradient(ellipse_70%_50%_at_50%_50%,rgba(140,207,66,0.22)_0%,rgba(128,0,255,0.18)_42%,transparent_75%)] blur-3xl pointer-events-none" />

        {/* Ambient floor horizon beam */}
        <div className="absolute top-1/2 left-0 right-0 h-32 -translate-y-1/2 bg-gradient-to-r from-transparent via-[#8CCF42]/16 to-transparent blur-2xl pointer-events-none" />
      </div>

      {/* ── 3D ROTATING RING STAGE ── */}
      <div
        ref={ringRef}
        className="relative flex items-center justify-center pointer-events-auto z-10"
        style={{
          width: typeof width === 'number' ? `${width}px` : width,
          height: typeof height === 'number' ? `${height}px` : height,
          transformStyle: 'preserve-3d',
          transformOrigin: '50% 50%',
          willChange: 'transform',
        }}
      >
        {normalizedImages.map((item, index) => {
          const angle = index * angleStep;

          return (
            <div
              key={index}
              onClick={() => onImageClick && onImageClick(item, index)}
              className="absolute inset-0 rounded-2xl overflow-hidden border border-white/15 bg-[#0C0914] shadow-[0_16px_45px_rgba(0,0,0,0.85)] group transition-all duration-300 hover:border-[#8CCF42]/90 hover:shadow-[0_0_35px_rgba(140,207,66,0.45)]"
              style={{
                transformStyle: 'preserve-3d',
                transformOrigin: '50% 50%',
                transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
              }}
            >
              {/* Photo */}
              <img
                src={item.src}
                alt={item.title || `Elite ${index + 1}`}
                className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105 pointer-events-none"
                loading="eager"
                onError={(e) => {
                  e.currentTarget.src =
                    'https://images.unsplash.com/photo-1546776310-eef45dd6d63c?w=800&auto=format&fit=crop&q=80';
                }}
              />

              {/* Shading Vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#08070C] via-black/25 to-black/35 pointer-events-none" />

              {/* Cyber HUD Corner Brackets */}
              <span className="absolute top-2.5 left-2.5 w-2.5 h-2.5 border-t-2 border-l-2 border-[#8CCF42]/80 pointer-events-none" />
              <span className="absolute bottom-2.5 right-2.5 w-2.5 h-2.5 border-b-2 border-r-2 border-[#8CCF42]/80 pointer-events-none" />

              {/* Top Badges: Rank & Status */}
              <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between pointer-events-none">
                <span className="font-mono text-[9px] font-black text-[#8CCF42] px-2 py-0.5 rounded-full bg-black/85 border border-[#8CCF42]/60 backdrop-blur-md">
                  {item.rank || `SEAT 0${index + 1}`}
                </span>
                <span className="flex items-center gap-1 font-mono text-[8px] font-bold text-white/80 px-2 py-0.5 rounded-full bg-black/75 border border-white/10 backdrop-blur-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8CCF42] animate-ping" />
                  <span>ONLINE</span>
                </span>
              </div>

              {/* Bottom Card Title & Role Badge */}
              <div className="absolute bottom-2.5 left-2.5 right-2.5 p-2 rounded-lg bg-[#08070C]/90 backdrop-blur-md border border-white/10 pointer-events-none">
                <div className="font-sans font-bold text-white text-xs truncate group-hover:text-[#8CCF42] transition-colors">
                  {item.title}
                </div>
                <div className="font-mono text-[9px] text-[#8A9094] truncate">
                  {item.role || 'Cadet Operative'}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── LEFT & RIGHT EDGE VIGNETTES ── */}
      <div className="absolute inset-y-0 left-0 w-28 sm:w-64 bg-gradient-to-r from-[#08070C] via-[#08070C]/85 to-transparent pointer-events-none z-20" />
      <div className="absolute inset-y-0 right-0 w-28 sm:w-64 bg-gradient-to-l from-[#08070C] via-[#08070C]/85 to-transparent pointer-events-none z-20" />
    </div>
  );
}

export default ThreeDImageRing;
