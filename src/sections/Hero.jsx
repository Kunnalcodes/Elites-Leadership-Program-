import React from 'react';
import { motion } from 'framer-motion';
import heroShieldSvg from '../assets/herofill.svg';
import HeroHeading from '../components/hero/HeroHeading';
import RobotMarquee from '../components/hero/RobotMarquee';
import HeroFeatures from '../components/hero/HeroFeatures';

export function Hero() {
  return (
    <section
      id="hero"
      className="relative w-full min-h-screen bg-[#000000] text-white flex flex-col items-center justify-between overflow-x-hidden pt-28 pb-10 select-none"
    >
      {/* ── AMBIENT BACKGROUND GLOW (Pure Black with Subtle Neon Green) ── */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Subtle radial green ambient spotlight at center */}
        <div className="absolute top-[48%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1100px] h-[600px] bg-[radial-gradient(ellipse_65%_50%_at_50%_50%,rgba(140,207,66,0.22)_0%,rgba(20,60,15,0.08)_40%,transparent_75%)] blur-3xl pointer-events-none" />

        {/* Soft top gradient */}
        <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-black via-black/80 to-transparent pointer-events-none" />
      </div>

      {/* ── 1. HERO HEADING & CALL TO ACTION ── */}
      <HeroHeading />

      {/* ── 2. 3D INFINITE ROBOT MARQUEE WITH CENTER SHIELD ── */}
      <div className="relative z-10 w-full my-2 flex items-center justify-center">
        <RobotMarquee
          speed={11}
          cardWidth="10.8em"
          perspective="60em"
        >
          {/* Centered Floating Thread Elite Shield Emblem */}
          <motion.div
            animate={{
              y: [0, -14, 0],
              scale: [1, 1.025, 1],
            }}
            transition={{
              duration: 5.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="relative flex items-center justify-center"
            style={{
              filter: 'drop-shadow(0 0 50px rgba(140,207,66,0.85)) drop-shadow(0 20px 65px rgba(128,0,255,0.5))',
            }}
          >
            {/* Ambient Pulse Rings */}
            <div className="absolute inset-0 -m-8 rounded-full border border-[#8CCF42]/35 animate-ping opacity-25 pointer-events-none" />
            <div className="absolute inset-0 -m-4 rounded-full border border-[#8000FF]/40 pointer-events-none opacity-30" />

            <img
              src={heroShieldSvg}
              alt="Thread Elite Shield Emblem"
              className="w-56 sm:w-64 md:w-80 lg:w-[350px] h-auto object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.95)]"
              loading="eager"
            />

            {/* Radial Core Glow */}
            <div className="absolute inset-0 bg-radial from-[#8CCF42]/40 via-transparent to-transparent blur-2xl pointer-events-none" />

            {/* Text Layered Directly Over the Shield */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 py-2 pointer-events-none z-30 select-none">
              <span className="font-mono text-[10px] sm:text-xs font-black tracking-[0.3em] text-[#8CCF42] uppercase px-3.5 py-0.5 rounded-full bg-[#050505]/90 border border-[#8CCF42]/70 shadow-[0_0_15px_rgba(140,207,66,0.6)] backdrop-blur-md mb-1 sm:mb-2">
                THREAD SECURITY
              </span>
              <span className="font-display font-black text-3xl sm:text-5xl md:text-6xl text-white tracking-widest drop-shadow-[0_6px_25px_rgba(0,0,0,1)] leading-none my-0.5 sm:my-1">
                ELITE
              </span>
              <span className="font-mono text-[8px] sm:text-[10px] md:text-[11px] font-bold text-[#BD7AFF] tracking-[0.25em] uppercase mt-1 sm:mt-2 px-3 py-0.5 rounded bg-[#100d17]/90 border border-[#8000FF]/50 backdrop-blur-md shadow-[0_0_12px_rgba(128,0,255,0.4)]">
                LEADERSHIP COHORT // 2026
              </span>
            </div>
          </motion.div>
        </RobotMarquee>
      </div>

      {/* ── 3. THREE FEATURE COLUMNS ── */}
      <HeroFeatures />
    </section>
  );
}

export default Hero;
