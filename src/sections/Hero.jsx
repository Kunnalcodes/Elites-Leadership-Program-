import React from 'react';
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

      {/* ── 2. DRAGGABLE 3D IMAGE RING (Lightswind 3D Ring with Elite Cadets) ── */}
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
