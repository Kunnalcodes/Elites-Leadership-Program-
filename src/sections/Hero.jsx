import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowDown, Lock, Shield, Terminal, Zap, Cpu, Award } from 'lucide-react';
import heroShieldSvg from '../assets/herofill.svg';
import { CircuitEnvironment } from '../components/hero/CircuitEnvironment';
import { FloatingSidePanels } from '../components/hero/FloatingSidePanels';
import ImageSlider3D from '@/components/lightswind/3d-image-slider';

/* Stagger children helper */
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};
const item = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] } },
};

export function Hero() {
  return (
    <section id="hero" className="relative w-full min-h-screen bg-[#08070C] flex flex-col items-center justify-between overflow-hidden pt-28 pb-12 select-none">

      {/* Circuit environment background */}
      <CircuitEnvironment />

      {/* Side panels */}
      <FloatingSidePanels />

      {/* ── ENTIRE BACKGROUND SECTION HIGHLIGHT & SPOTLIGHT ── */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Massive vibrant green & purple spotlight aura filling the entire section backdrop */}
        <div className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1600px] h-[950px] bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,rgba(140,207,66,0.32)_0%,rgba(128,0,255,0.24)_40%,rgba(8,7,12,0.85)_75%,transparent_100%)] blur-3xl pointer-events-none" />

        {/* Dynamic green neon floor horizon beam */}
        <div className="absolute top-[52%] left-0 right-0 h-48 -translate-y-1/2 bg-gradient-to-r from-transparent via-[#8CCF42]/25 to-transparent blur-3xl pointer-events-none" />

        {/* Ambient top energy glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[radial-gradient(ellipse_at_center,rgba(140,207,66,0.18)_0%,transparent_70%)] blur-3xl pointer-events-none" />
      </div>

      {/* ── Top Hero Content (Eyebrow, Headline, Pillars, Copy, CTA) ── */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center text-center px-4 sm:px-6"
      >

        {/* Eyebrow pill */}
        <motion.div variants={item} className="mb-3">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#15111F] border border-[#8000FF]/50 font-mono text-[11px] font-bold text-[#BD7AFF] uppercase tracking-widest shadow-[0_0_15px_rgba(128,0,255,0.2)]">
            <Zap size={11} className="text-[#8CCF42]" />
            Thread Security · Student Leadership Program
            <Zap size={11} className="text-[#8CCF42]" />
          </span>
        </motion.div>

        {/* Main headline */}
        <motion.div variants={item} className="relative w-full flex flex-col items-center justify-center my-2">
          <h1 className="font-display font-black leading-[0.92] tracking-tight text-center">
            <span
              className="block text-white"
              style={{
                fontSize: 'clamp(3.5rem, 10vw, 8rem)',
                textShadow: '0 4px 36px rgba(0,0,0,0.95), 0 2px 12px rgba(0,0,0,0.9)',
              }}
            >
              THREAD <span className="text-[#8000FF] drop-shadow-[0_0_45px_rgba(128,0,255,0.7)]">ELITE</span>
            </span>
          </h1>
        </motion.div>

        {/* Four-pillar tags */}
        <motion.div variants={item} className="flex items-center gap-3 mt-1 mb-4 flex-wrap justify-center relative z-10">
          {['LEARN', 'EXECUTE', 'LEAD', 'GROW'].map((word, i) => (
            <React.Fragment key={word}>
              <span className="font-mono text-xs sm:text-sm font-bold text-white tracking-[0.2em] uppercase">
                {word}
              </span>
              {i < 3 && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#8CCF42]" />
              )}
            </React.Fragment>
          ))}
        </motion.div>

        {/* Supporting copy */}
        <motion.p
          variants={item}
          className="text-sm sm:text-base text-[#C5BED0] max-w-xl leading-relaxed mb-6 font-sans relative z-10"
        >
          A year-long journey designed to turn ambition into action.
          Learn continuously, take on meaningful challenges, and grow
          into a leader who creates real impact.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          variants={item}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto mb-2 relative z-20"
        >
          <a
            href="#program"
            className="w-full sm:w-auto h-12 px-8 rounded-lg bg-[#8000FF] hover:bg-[#9333EA] border border-[#BD7AFF]/60 shadow-[0_0_28px_rgba(128,0,255,0.45)] text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all duration-200 hover:-translate-y-0.5"
          >
            <span>Explore the Experience</span>
            <ArrowDown className="w-4 h-4 text-[#8CCF42]" />
          </a>

          <Link
            to="/login"
            className="w-full sm:w-auto h-12 px-8 rounded-lg bg-transparent hover:bg-[#15111F] border border-[#38264F] hover:border-[#8000FF]/70 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all duration-200 hover:-translate-y-0.5"
          >
            <Lock className="w-4 h-4 text-[#8000FF]" />
            <span>Elite Login</span>
          </Link>
        </motion.div>
      </motion.div>

      {/* ── 3D Image Slider Showcase (Full Width, Centered with Precision Symmetry) ── */}
      <div className="relative z-10 w-full h-[580px] sm:h-[660px] md:h-[720px] flex items-center justify-center my-4 overflow-hidden select-none">
        {/* Panoramic Ambient Radial Glow */}
        <div className="absolute inset-0 bg-radial from-[#8000FF]/25 via-[#8CCF42]/12 to-transparent blur-3xl pointer-events-none" />

        {/* 3D Semi-Circle Photo Marquee */}
        <div className="absolute inset-0 flex items-center justify-center z-0">
          <ImageSlider3D duration={32} cardWidth="13.5em" perspective="62em" />
        </div>

        {/* Centered Shield & Overlaid Typography */}
        <div className="relative z-20 flex flex-col items-center justify-center pointer-events-none select-none">
          {/* Laser beam - strictly centered */}
          <div className="absolute -top-40 bottom-0 left-1/2 -translate-x-1/2 w-1.5 bg-gradient-to-b from-transparent via-[#8CCF42] to-transparent blur-[1px] opacity-95 shadow-[0_0_35px_#8CCF42]" />
          <div className="absolute -top-32 bottom-0 left-1/2 -translate-x-1/2 w-10 bg-gradient-to-b from-transparent via-[#8CCF42]/40 to-transparent blur-xl pointer-events-none" />

          {/* Floating Shield Emblem */}
          <motion.div
            animate={{
              y: [0, -16, 0],
              scale: [1, 1.025, 1],
            }}
            transition={{
              duration: 5.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="relative flex items-center justify-center"
            style={{
              filter: 'drop-shadow(0 0 65px rgba(140,207,66,0.85)) drop-shadow(0 30px 85px rgba(128,0,255,0.6))',
            }}
          >
            {/* Pulse Rings */}
            <div className="absolute inset-0 -m-10 rounded-full border border-[#8CCF42]/40 animate-ping opacity-25 pointer-events-none" />
            <div className="absolute inset-0 -m-5 rounded-full border border-[#8000FF]/50 pointer-events-none opacity-40" />

            <img
              src={heroShieldSvg}
              alt="Thread Elite Shield Emblem"
              className="w-72 sm:w-[400px] md:w-[500px] lg:w-[580px] xl:w-[640px] h-auto object-contain drop-shadow-[0_25px_60px_rgba(0,0,0,0.95)]"
              loading="eager"
            />

            {/* Radial Core Glow */}
            <div className="absolute inset-0 bg-radial from-[#8CCF42]/40 via-transparent to-transparent blur-2xl pointer-events-none" />

            {/* Text Layered Directly Over the Shield */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 py-2 pointer-events-none z-30 select-none">
              <span className="font-mono text-[11px] sm:text-xs md:text-sm font-black tracking-[0.35em] text-[#8CCF42] uppercase px-4 py-1 rounded-full bg-[#08070C]/90 border border-[#8CCF42]/70 shadow-[0_0_20px_rgba(140,207,66,0.6)] backdrop-blur-md mb-1.5 sm:mb-2.5">
                THREAD SECURITY
              </span>
              <span className="font-display font-black text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-white tracking-widest drop-shadow-[0_6px_30px_rgba(0,0,0,1)] leading-none my-1">
                ELITE
              </span>
              <span className="font-mono text-[9px] sm:text-[11px] md:text-xs font-bold text-[#BD7AFF] tracking-[0.25em] uppercase mt-2 sm:mt-3 px-3.5 py-1 rounded bg-[#15111F]/90 border border-[#8000FF]/60 backdrop-blur-md shadow-[0_0_15px_rgba(128,0,255,0.45)]">
                LEADERSHIP COHORT // 2026
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Three Feature Pillars below the 3D showcase ── */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 my-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-center">
          <div className="p-4 rounded-xl bg-[#15111F]/50 border border-[#38264F]/50 backdrop-blur-sm">
            <div className="inline-flex p-2 rounded-lg bg-[#8000FF]/15 text-[#8000FF] mb-2">
              <Zap size={18} className="text-[#8CCF42]" />
            </div>
            <h3 className="font-heading font-bold text-white text-base mb-1">
              Lightning-Fast Security Intelligence
            </h3>
            <p className="text-xs text-[#898293] leading-relaxed">
              Train, automate, and deploy real-world defensive engineering with speed, rigor, and zero-trust precision.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#15111F]/50 border border-[#38264F]/50 backdrop-blur-sm">
            <div className="inline-flex p-2 rounded-lg bg-[#8000FF]/15 text-[#BD7AFF] mb-2">
              <Cpu size={18} className="text-[#BD7AFF]" />
            </div>
            <h3 className="font-heading font-bold text-white text-base mb-1">
              Authoritative Merit &amp; Ledgers
            </h3>
            <p className="text-xs text-[#898293] leading-relaxed">
              Criterion-evaluated technical missions, verified biometric credentials, and live cohort XP progression.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#15111F]/50 border border-[#38264F]/50 backdrop-blur-sm">
            <div className="inline-flex p-2 rounded-lg bg-[#8000FF]/15 text-[#8CCF42] mb-2">
              <Award size={18} className="text-[#8CCF42]" />
            </div>
            <h3 className="font-heading font-bold text-white text-base mb-1">
              Precision Leadership
            </h3>
            <p className="text-xs text-[#898293] leading-relaxed">
              Engineered for student leaders ready to command technical excellence, red-team strategy, and industry impact.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom status bar */}
      <div className="w-full max-w-7xl px-6 flex items-center justify-between text-[10px] font-mono text-[#898293] border-t border-[#1D1729] pt-4 mt-8 z-10 hidden sm:flex">
        <span className="flex items-center gap-2">
          <Shield size={11} className="text-[#8CCF42]" />
          THREAD SECURITY GOVERNANCE
        </span>
        <span className="text-[#8000FF]/60 tracking-wider">SEC_LEVEL // 05_AUTHORIZED</span>
        <span>ONE LEADER. MANY IMPACTS.</span>
      </div>
    </section>
  );
}

export default Hero;