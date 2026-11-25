import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowDown, Lock, Shield, Terminal, Zap } from 'lucide-react';
import heroShieldSvg from '../assets/herofill.svg';
import { CircuitEnvironment } from '../components/hero/CircuitEnvironment';
import { FloatingSidePanels } from '../components/hero/FloatingSidePanels';

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

      {/* ── Central composition ── */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center text-center my-auto px-6"
      >

        {/* Eyebrow pill */}
        <motion.div variants={item} className="mb-4">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#15111F] border border-[#8000FF]/50 font-mono text-[11px] font-bold text-[#BD7AFF] uppercase tracking-widest shadow-[0_0_15px_rgba(128,0,255,0.2)]">
            <Zap size={11} className="text-[#8CCF42]" />
            Thread Security · Student Leadership Program
            <Zap size={11} className="text-[#8CCF42]" />
          </span>
        </motion.div>

        {/* Main headline with herofill.svg overlapping directly at the back */}
        <motion.div variants={item} className="relative w-full flex flex-col items-center justify-center my-4">
          
          {/* Shield emblem positioned at the back of the text, overlapping */}
          <motion.div
            animate={{
              y: [0, -10, 0],
              scale: [1, 1.02, 1],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none select-none"
            style={{
              filter: 'drop-shadow(0 0 45px rgba(140,207,66,0.45)) drop-shadow(0 20px 60px rgba(128,0,255,0.4))',
            }}
          >
            {/* Ambient Pulse Rings behind the Shield */}
            <div className="absolute inset-0 -m-8 rounded-full border border-[#8000FF]/25 animate-ping pointer-events-none opacity-20" />
            <div className="absolute inset-0 -m-4 rounded-full border border-[#8CCF42]/30 pointer-events-none opacity-30" />

            <img
              src={heroShieldSvg}
              alt="Thread Elite Shield Emblem"
              className="w-72 sm:w-96 md:w-[480px] lg:w-[540px] max-w-none h-auto object-contain mx-auto opacity-80"
              loading="eager"
            />
          </motion.div>

          {/* Foreground Title Overlapping the Shield */}
          <h1 className="relative z-10 font-display font-black leading-[0.92] tracking-tight text-center">
            <span
              className="block text-white"
              style={{
                fontSize: 'clamp(4rem, 12vw, 9.2rem)',
                textShadow: '0 4px 36px rgba(0,0,0,0.95), 0 2px 12px rgba(0,0,0,0.9)',
              }}
            >
              THREAD
            </span>
            <span
              className="block text-[#8000FF]"
              style={{
                fontSize: 'clamp(4rem, 12vw, 9.2rem)',
                textShadow: '0 0 65px rgba(128,0,255,0.7), 0 4px 36px rgba(0,0,0,0.95)',
              }}
            >
              ELITE
            </span>
          </h1>
        </motion.div>

        {/* Four-pillar tags */}
        <motion.div variants={item} className="flex items-center gap-3 mt-3 mb-6 flex-wrap justify-center relative z-10">
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
          className="text-sm sm:text-base text-[#C5BED0] max-w-lg leading-relaxed mb-7 font-sans relative z-10"
        >
          A year-long journey designed to turn ambition into action.
          Learn continuously, take on meaningful challenges, and grow
          into a leader who creates real impact.
        </motion.p>

        {/* Access badge */}
        <motion.div variants={item} className="mb-7 relative z-10">
          <div className="relative inline-flex items-center gap-3 px-5 py-2.5 rounded-lg bg-[#15111F]/80 backdrop-blur-md border border-[#8000FF]/50 shadow-[0_0_24px_rgba(128,0,255,0.25)]">
            <span className="absolute -top-px -left-px w-3 h-3 border-t-2 border-l-2 border-[#8CCF42] rounded-tl" />
            <span className="absolute -bottom-px -right-px w-3 h-3 border-b-2 border-r-2 border-[#8CCF42] rounded-br" />
            <Terminal size={13} className="text-[#8CCF42]" />
            <span className="font-mono text-[11px] font-bold text-white tracking-[0.25em] uppercase">
              THE ELITE ROOM{' '}
              <span className="text-[#8CCF42] font-black text-sm">02</span>
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#8CCF42] animate-ping" />
          </div>
        </motion.div>

        {/* CTA buttons */}
        <motion.div
          variants={item}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto relative z-20"
        >
          <a
            href="#program"
            className="w-full sm:w-auto h-12 px-9 rounded-lg bg-[#8000FF] hover:bg-[#9333EA] border border-[#BD7AFF]/60 shadow-[0_0_28px_rgba(128,0,255,0.45)] text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all duration-200 hover:-translate-y-0.5"
          >
            <span>Explore the Experience</span>
            <ArrowDown className="w-4 h-4 text-[#8CCF42]" />
          </a>

          <Link
            to="/login"
            className="w-full sm:w-auto h-12 px-9 rounded-lg bg-transparent hover:bg-[#15111F] border border-[#38264F] hover:border-[#8000FF]/70 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all duration-200 hover:-translate-y-0.5"
          >
            <Lock className="w-4 h-4 text-[#8000FF]" />
            <span>Elite Login</span>
          </Link>
        </motion.div>
      </motion.div>

      {/* Bottom status bar */}
      <div className="w-full max-w-7xl px-6 flex items-center justify-between text-[10px] font-mono text-[#898293] border-t border-[#1D1729] pt-3 z-10 hidden sm:flex">
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
