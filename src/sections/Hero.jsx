import React from 'react';
import HeroHeading from '../components/hero/HeroHeading';
import RobotMarquee from '../components/hero/RobotMarquee';
import HeroFeatures from '../components/hero/HeroFeatures';

export function Hero() {
  return (
    <section
      id="hero"
      className="relative w-full min-h-screen bg-[#000000] text-white flex flex-col items-center justify-between overflow-x-hidden pt-28 pb-12 select-none"
    >
      {/* ── AMBIENT BACKGROUND LIGHTING (Pure Black with Subtle Neon Green) ── */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Subtle radial green ambient spotlight at center */}
        <div className="absolute top-[48%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1100px] h-[600px] bg-[radial-gradient(ellipse_65%_50%_at_50%_50%,rgba(140,207,66,0.22)_0%,rgba(20,60,15,0.08)_40%,transparent_75%)] blur-3xl pointer-events-none" />

        {/* Soft top gradient */}
        <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-black via-black/80 to-transparent pointer-events-none" />
      </div>

      {/* ── 1. HERO HEADING & CALL TO ACTION ── */}
      <HeroHeading />

      {/* ── 2. 3D INFINITE ROBOT MARQUEE (Right-to-Left, Curved Tunnel, Seamless Loop) ── */}
      <div className="relative z-10 w-full my-2 flex items-center justify-center">
        <RobotMarquee
          speed={11}
          cardWidth="10.8em"
          perspective="60em"
        />
      </div>

      {/* ── 3. THREE FEATURE COLUMNS ── */}
      <HeroFeatures />
    </section>
  );
}

export default Hero;
