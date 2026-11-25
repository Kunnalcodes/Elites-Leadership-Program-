import React from 'react';
import HeroHeading from '../components/hero/HeroHeading';
import EliteCardsShowcase from '../components/hero/EliteCardsShowcase';
import HeroFeatures from '../components/hero/HeroFeatures';

export function Hero() {
  return (
    <section
      id="hero"
      className="relative w-full min-h-screen bg-[#08070C] text-white flex flex-col items-center justify-between overflow-x-hidden pt-28 pb-12 select-none"
    >
      {/* ── AMBIENT BACKGROUND GLOW ── */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Subtle radial green and purple ambient spotlight at center */}
        <div className="absolute top-[38%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1300px] h-[700px] bg-[radial-gradient(ellipse_70%_50%_at_50%_50%,rgba(140,207,66,0.16)_0%,rgba(128,0,255,0.12)_42%,transparent_75%)] blur-3xl pointer-events-none" />

        {/* Soft top gradient */}
        <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-[#08070C] via-[#08070C]/80 to-transparent pointer-events-none" />
      </div>

      {/* ── 1. HERO HEADING & CALL TO ACTION ── */}
      <HeroHeading />

      {/* ── 2. ELITE CADET CARDS SHOWCASE (Grid where photos of Elites are placed) ── */}
      <EliteCardsShowcase />

      {/* ── 3. THREE FEATURE COLUMNS ── */}
      <HeroFeatures />
    </section>
  );
}

export default Hero;
