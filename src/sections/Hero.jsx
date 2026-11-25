import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import heroShieldSvg from '../assets/herofill.svg';
import HeroHeading from '../components/hero/HeroHeading';
import { ThreeDImageRing } from "@/components/lightswind/draggable-3d-image-ring";
import HeroFeatures from '../components/hero/HeroFeatures';

// Curated Elite photos and credentials for the 3D Image Ring
const ELITE_RING_ITEMS = [
  {
    src: '/headshot-dhiraj.png',
    title: 'Dhiraj Roy',
    role: 'Lead Architect · Security Engineering',
    rank: 'RANK #01',
    badge: 'CHAMPION',
  },
  {
    src: '/headshot-kalpana.png',
    title: 'Kalpana Sharma',
    role: 'Defense Systems · Threat Intelligence',
    rank: 'RANK #02',
    badge: 'RED TEAM',
  },
  {
    src: '/headshot-piyush.png',
    title: 'Piyush Kumar',
    role: 'Core Systems · Cyber Infrastructure',
    rank: 'RANK #03',
    badge: 'SYSTEMS',
  },
  {
    src: '/elite-leader-archetype.jpg',
    title: 'Cohort 2026 Seat',
    role: 'Defensive Engineering Candidate',
    rank: 'SEAT #04',
    badge: 'OPEN SEAT',
  },
  {
    src: '/card-front-dhiraj.png',
    title: 'Dhiraj · Credential Card',
    role: 'Catalyst Elite · 2,980 XP',
    rank: 'VERIFIED',
    badge: 'L5 SECURE',
  },
  {
    src: '/card-front-kalpana.png',
    title: 'Kalpana · Credential Card',
    role: 'Catalyst Elite · 2,890 XP',
    rank: 'VERIFIED',
    badge: 'L5 SECURE',
  },
  {
    src: '/card-front-piyush.png',
    title: 'Piyush · Credential Card',
    role: 'Catalyst Elite · 2,750 XP',
    rank: 'VERIFIED',
    badge: 'L5 SECURE',
  },
  {
    src: 'https://images.unsplash.com/photo-1546776310-eef45dd6d63c?w=800&auto=format&fit=crop&q=80',
    title: 'Defensive Operative',
    role: 'Autonomous Security Unit',
    rank: 'UNIT // 08',
    badge: 'OPERATIVE',
  },
];

export function Hero() {
  const heroRef = useRef(null);

  // Track scroll position through the hero section
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  // Smooth physics spring for organic, fluid scroll translation
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    restDelta: 0.001,
  });

  // Scroll effect: shield translates from behind the header text (~0px) down into the 3D ring (~480px)
  const shieldY = useTransform(smoothProgress, [0, 0.42], [0, 480]);
  const shieldScale = useTransform(smoothProgress, [0, 0.42], [1.18, 0.94]);
  const shieldOpacity = useTransform(smoothProgress, [0, 0.22, 0.42], [0.75, 0.95, 0.88]);

  return (
    <section
      ref={heroRef}
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

      {/* ── SCROLL-DRIVEN THREAD ELITE SHIELD (Slides from header text into 3D ring) ── */}
      <motion.div
        style={{
          y: shieldY,
          scale: shieldScale,
          opacity: shieldOpacity,
        }}
        className="absolute top-32 sm:top-36 left-1/2 -translate-x-1/2 z-[5] pointer-events-none select-none flex items-center justify-center"
      >
        {/* Gentle breathing animation while scroll drives position */}
        <motion.div
          animate={{
            y: [0, -10, 0],
            scale: [1, 1.02, 1],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="relative flex items-center justify-center"
          style={{
            filter:
              'drop-shadow(0 0 50px rgba(140,207,66,0.65)) drop-shadow(0 20px 70px rgba(128,0,255,0.45))',
          }}
        >
          {/* Ambient Pulse Rings */}
          <div className="absolute inset-0 -m-8 rounded-full border border-[#8CCF42]/30 animate-ping opacity-25 pointer-events-none" />
          <div className="absolute inset-0 -m-4 rounded-full border border-[#8000FF]/35 pointer-events-none opacity-30" />

          {/* Shield Emblem SVG */}
          <img
            src={heroShieldSvg}
            alt="Thread Elite Shield Emblem"
            className="w-72 sm:w-88 md:w-[460px] lg:w-[520px] h-auto object-contain mx-auto"
            loading="eager"
          />

          {/* Core Radial Glow */}
          <div className="absolute inset-0 bg-radial from-[#8CCF42]/30 via-[#8000FF]/15 to-transparent blur-2xl pointer-events-none" />
        </motion.div>
      </motion.div>

      {/* ── 1. HERO HEADING & CALL TO ACTION (Layered above the shield at the top) ── */}
      <HeroHeading />

      {/* ── 2. DRAGGABLE 3D IMAGE RING (Cards orbit in front of the descending shield) ── */}
      <div className="relative z-10 w-full my-4 flex items-center justify-center">
        <ThreeDImageRing
          images={ELITE_RING_ITEMS}
          width={240}
          height={320}
          perspective={1800}
        />
      </div>

      {/* ── 3. THREE FEATURE COLUMNS ── */}
      <HeroFeatures />
    </section>
  );
}

export default Hero;
