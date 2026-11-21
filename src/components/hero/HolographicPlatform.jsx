import React from 'react';
import { motion } from 'framer-motion';

export function HolographicPlatform() {
  return (
    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-44 sm:h-56 pointer-events-none overflow-hidden flex items-end justify-center z-0">
      {/* 1. Reflective Floor Horizon */}
      <div 
        className="absolute bottom-0 inset-x-0 h-28"
        style={{
          background: 'radial-gradient(ellipse at 50% 100%, rgba(128, 0, 255, 0.28) 0%, rgba(16, 13, 23, 0.8) 50%, transparent 80%)',
        }}
      />

      {/* 2. Concentric Holographic Rings Container (Perspective 3D Tilted Ellipse) */}
      <div 
        className="relative w-[580px] sm:w-[740px] md:w-[860px] h-[220px] sm:h-[260px] flex items-center justify-center"
        style={{
          transform: 'perspective(600px) rotateX(68deg)',
          transformOrigin: 'bottom center',
        }}
      >
        {/* Outermost Ring with Cyber Ticks */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 rounded-full border border-[#8000FF]/40 border-dashed shadow-[0_0_20px_rgba(128,0,255,0.3)]"
          style={{ borderWidth: '1.5px' }}
        />

        {/* Counter-Rotating Mid Ring with Segment Markers */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-8 sm:inset-12 rounded-full border border-[#BD7AFF]/60 shadow-[0_0_15px_rgba(189,122,255,0.4)]"
          style={{ borderWidth: '1.5px', borderStyle: 'solid' }}
        >
          {/* Degree Tick Accents */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#8CCF42] shadow-[0_0_8px_#8CCF42]" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#8CCF42] shadow-[0_0_8px_#8CCF42]" />
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#BD7AFF]" />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#BD7AFF]" />
        </motion.div>

        {/* Inner Dais Core Ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-20 sm:inset-28 rounded-full border-2 border-[#8000FF] bg-[#15111F]/60 backdrop-blur-sm shadow-[0_0_25px_rgba(128,0,255,0.6)] flex items-center justify-center"
        >
          <div className="w-16 h-16 rounded-full border border-[#8CCF42]/80 bg-[#8CCF42]/10" />
        </motion.div>
      </div>

      {/* 3. Vertical Light Beams Emerging from Center Dais */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-end justify-center gap-6 sm:gap-10 pointer-events-none">
        <div className="w-[1.5px] h-28 sm:h-36 bg-gradient-to-t from-[#8000FF] to-transparent opacity-70 animate-pulse" />
        <div className="w-[2px] h-36 sm:h-48 bg-gradient-to-t from-[#BD7AFF] via-[#8CCF42]/50 to-transparent opacity-80" />
        <div className="w-[1.5px] h-24 sm:h-32 bg-gradient-to-t from-[#8000FF] to-transparent opacity-70 animate-pulse" />
      </div>
    </div>
  );
}

export default HolographicPlatform;
