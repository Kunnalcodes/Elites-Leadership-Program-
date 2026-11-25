import React from 'react';
import { motion } from 'framer-motion';

export function HeroHeading() {
  return (
    <div className="relative z-20 flex flex-col items-center text-center px-4 max-w-4xl mx-auto pt-6 pb-2">
      {/* Main heading - Large, lightweight white typography with balanced line spacing */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="font-sans font-light tracking-tight text-white text-4xl sm:text-6xl md:text-7xl lg:text-[76px] leading-[1.08] mb-5 select-none"
      >
        <span className="block">Create Intelligent Robots</span>
        <span className="block">with Advanced AI</span>
      </motion.h1>

      {/* Subtitle - Muted gray, centered, constrained comfortable width */}
      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        className="text-[#8A9094] text-sm sm:text-base md:text-[17px] font-normal leading-relaxed max-w-xl mx-auto mb-8 select-none"
      >
        Build smart robotic systems in seconds, powered by cutting-edge artificial intelligence
      </motion.p>

      {/* CTA - Compact black pill-shaped button with a subtle gray border */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
      >
        <a
          href="#explore"
          className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-[#050505] hover:bg-[#121212] text-white text-xs sm:text-sm font-medium border border-[#34383A] hover:border-[#8CCF42]/80 transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.8)] group select-none"
        >
          <span>Explore Robots</span>
          <span className="text-zinc-400 group-hover:translate-x-1 group-hover:text-[#8CCF42] transition-transform duration-200">
            →
          </span>
        </a>
      </motion.div>
    </div>
  );
}

export default HeroHeading;
