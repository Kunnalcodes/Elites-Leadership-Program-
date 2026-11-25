import React from 'react';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

export function HeroHeading({
  eyebrow = 'Thread Security · Student Leadership Program',
  titleLine1 = 'Thread Elite Cadets',
  titleLine2 = '& Future Leaders',
  subtitle = 'A year-long journey designed to turn ambition into action. Learn continuously, take on meaningful challenges, and lead with verified impact.',
  ctaText = 'Explore The Experience',
  ctaLink = '#program',
}) {
  return (
    <div className="relative z-20 flex flex-col items-center text-center px-4 max-w-4xl mx-auto pt-6 pb-2">
      {/* Eyebrow badge */}
      {eyebrow && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-4"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#15111F] border border-[#8000FF]/50 font-mono text-[11px] font-bold text-[#BD7AFF] uppercase tracking-widest shadow-[0_0_15px_rgba(128,0,255,0.2)]">
            <Zap size={11} className="text-[#8CCF42]" />
            {eyebrow}
            <Zap size={11} className="text-[#8CCF42]" />
          </span>
        </motion.div>
      )}

      {/* Main heading - Large, lightweight modern typography */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="font-sans font-light tracking-tight text-white text-4xl sm:text-6xl md:text-7xl lg:text-[74px] leading-[1.08] mb-4 select-none"
      >
        <span className="block">{titleLine1}</span>
        <span className="block font-semibold bg-gradient-to-r from-white via-[#F3F4F4] to-[#BD7AFF] bg-clip-text text-transparent">
          {titleLine2}
        </span>
      </motion.h1>

      {/* Subtitle - Muted gray, centered, constrained comfortable width */}
      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        className="text-[#8A9094] text-sm sm:text-base md:text-[17px] font-normal leading-relaxed max-w-xl mx-auto mb-7 select-none"
      >
        {subtitle}
      </motion.p>

      {/* CTA Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="flex items-center gap-3 flex-wrap justify-center"
      >
        <a
          href={ctaLink}
          className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full bg-[#8000FF] hover:bg-[#9333EA] text-white text-xs sm:text-sm font-mono font-bold tracking-wider uppercase border border-[#BD7AFF]/60 shadow-[0_0_25px_rgba(128,0,255,0.45)] transition-all duration-200 hover:-translate-y-0.5 group select-none"
        >
          <span>{ctaText}</span>
          <span className="text-[#8CCF42] group-hover:translate-x-1 transition-transform duration-200">
            →
          </span>
        </a>

        <a
          href="/login"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#15111F] hover:bg-[#1C1729] text-white text-xs sm:text-sm font-mono font-bold tracking-wider uppercase border border-[#38264F] hover:border-[#8000FF]/80 transition-all duration-200 hover:-translate-y-0.5 select-none"
        >
          <span>Elite Login</span>
        </a>
      </motion.div>
    </div>
  );
}

export default HeroHeading;
