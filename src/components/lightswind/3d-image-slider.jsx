import React, { useState, useRef, useMemo } from 'react';
import { motion, useMotionValue, useTransform, useAnimationControls } from 'framer-motion';

// High-fidelity futuristic cyber, tech, and security leadership portraits
// matching the aesthetic in the reference 3D showcase
const DEFAULT_IMAGES = [
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80', // Abstract futuristic digital structure
  'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=800&auto=format&fit=crop&q=80', // Cybernetic glowing visor
  'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80', // High-tech cybernetic anime warrior
  'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&auto=format&fit=crop&q=80', // Futuristic neon cyberpunk portrait
  'https://images.unsplash.com/photo-1544256718-3bcf237f3974?w=800&auto=format&fit=crop&q=80', // Matrix cyber code / terminal operative
  'https://images.unsplash.com/photo-1563089145-599997674d42?w=800&auto=format&fit=crop&q=80', // Neon futuristic neon beam operative
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80', // Security hacker silhouette / terminal
  'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80', // Futuristic tech interface
  '/card-front-dhiraj.png',                                                                        // Thread Elite Cadet Dhiraj
  '/card-front-piyush.png',                                                                        // Thread Elite Cadet Piyush
  '/card-front-kalpana.png',                                                                       // Thread Elite Cadet Kalpana
];

export function ImageSlider3D({
  images = DEFAULT_IMAGES,
  duration = 32,
  cardWidth = '15em',
  perspective = '35em',
  cardAspectRatio = '7/10',
  withMask = true,
  rotationDirection = 'left',
  pauseOnHover = true,
  radius: customRadius,
  className = '',
}) {
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef(null);

  const cardList = useMemo(() => {
    return images && images.length >= 6 ? images : DEFAULT_IMAGES;
  }, [images]);

  const count = cardList.length;
  const angleStep = 360 / count;

  // Calculate cylinder radius dynamically so cards meet seamlessly on the circumference
  // Formula: R = (width / 2) / tan(PI / count)
  const computedRadius = useMemo(() => {
    if (customRadius) return customRadius;
    const numericWidth = parseFloat(cardWidth) || 15;
    const unit = cardWidth.replace(/[\d.-]/g, '') || 'em';
    const calculated = (numericWidth / (2 * Math.tan(Math.PI / count))).toFixed(1);
    return `${calculated}${unit}`;
  }, [cardWidth, count, customRadius]);

  const directionFactor = rotationDirection === 'right' ? 1 : -1;

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full flex items-center justify-center select-none overflow-hidden ${className}`}
      style={{
        perspective,
        WebkitPerspective: perspective,
      }}
      onMouseEnter={() => pauseOnHover && setIsHovered(true)}
      onMouseLeave={() => pauseOnHover && setIsHovered(false)}
    >
      {/* 3D Rotating Stage / Cylinder */}
      <div
        className="relative flex items-center justify-center"
        style={{
          width: cardWidth,
          aspectRatio: cardAspectRatio,
          transformStyle: 'preserve-3d',
        }}
      >
        <motion.div
          className="relative w-full h-full"
          style={{
            transformStyle: 'preserve-3d',
          }}
          animate={{
            rotateY: [0, 360 * directionFactor],
          }}
          transition={{
            duration: Math.max(10, duration),
            repeat: Infinity,
            ease: 'linear',
            ...(isHovered && { playbackRate: 0 }),
          }}
        >
          {cardList.map((src, index) => {
            const angle = index * angleStep;

            return (
              <div
                key={index}
                className="absolute inset-0 rounded-2xl overflow-hidden border border-white/15 bg-[#15111F]/90 shadow-[0_10px_35px_rgba(0,0,0,0.85)] group cursor-pointer transition-all duration-300 hover:border-[#8CCF42]/80 hover:shadow-[0_0_30px_rgba(140,207,66,0.35)]"
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
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                  onError={(e) => {
                    // Fallback to abstract cyber background if an image fails to load
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80';
                  }}
                />

                {/* Subtle cyber scanlines & gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#08070C] via-transparent to-black/30 pointer-events-none" />

                {/* Corner Technical Bracket Accents */}
                <span className="absolute top-2 left-2 w-2 h-2 border-t border-l border-[#8CCF42]/70 pointer-events-none" />
                <span className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-[#8CCF42]/70 pointer-events-none" />

                {/* Bottom Card Pill Tag */}
                <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[9px] font-mono font-bold text-white/80 px-2 py-1 rounded bg-[#08070C]/85 backdrop-blur-md border border-white/10 pointer-events-none">
                  <span className="text-[#8CCF42]">SEC_ID #{String(index + 1).padStart(2, '0')}</span>
                  <span className="text-[#BD7AFF] tracking-wider uppercase">ACTIVE</span>
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>

      {/* Subtle vignette masks on the left and right edges for smooth background blending */}
      {withMask && (
        <>
          <div className="absolute inset-y-0 left-0 w-24 sm:w-44 bg-gradient-to-r from-[#08070C] via-[#08070C]/80 to-transparent pointer-events-none z-10" />
          <div className="absolute inset-y-0 right-0 w-24 sm:w-44 bg-gradient-to-l from-[#08070C] via-[#08070C]/80 to-transparent pointer-events-none z-10" />
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