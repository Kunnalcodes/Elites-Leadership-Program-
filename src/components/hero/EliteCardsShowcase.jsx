import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Award, Zap, Sparkles, CheckCircle2 } from 'lucide-react';

/**
 * ══════════════════════════════════════════════════════════════════════════
 * 👉 HOW TO PUT PHOTOS OF YOUR ELITES:
 * Simply edit or add items to the DEFAULT_ELITES array below.
 * - photo: Path to your image in the /public folder (e.g. '/my-photo.png') or an external URL
 * - name: Full name of the Elite cadet
 * - role: Specialization / role title
 * - rank: Rank identifier (#01, #02, etc.)
 * - stats: Custom metrics (XP, Missions completed, Rating)
 * ══════════════════════════════════════════════════════════════════════════
 */
export const DEFAULT_ELITES = [
  {
    id: 'elite-1',
    name: 'Dhiraj Roy',
    callsign: 'DHIRAJ',
    role: 'Lead Architect · Security Engineering',
    tier: 'Catalyst Elite',
    rank: '#01',
    badge: 'CHAMPION',
    status: 'ONLINE',
    // 📸 Put Elite #1 photo here:
    photo: '/headshot-dhiraj.png',
    fallbackPhoto: '/dhiraj.jpg',
    stats: {
      xp: '2,980 XP',
      missions: '42 Done',
      score: '9.9/10',
    },
    accentColor: '#FFD700', // Gold
  },
  {
    id: 'elite-2',
    name: 'Kalpana Sharma',
    callsign: 'KALPANA',
    role: 'Defense Systems · Threat Intelligence',
    tier: 'Catalyst Elite',
    rank: '#02',
    badge: 'RED TEAM LEAD',
    status: 'ONLINE',
    // 📸 Put Elite #2 photo here:
    photo: '/headshot-kalpana.png',
    fallbackPhoto: '/kalpana.jpg',
    stats: {
      xp: '2,890 XP',
      missions: '39 Done',
      score: '9.8/10',
    },
    accentColor: '#8CCF42', // Lime Neon
  },
  {
    id: 'elite-3',
    name: 'Piyush Kumar',
    callsign: 'PIYUSH',
    role: 'Core Systems · Cyber Infrastructure',
    tier: 'Catalyst Elite',
    rank: '#03',
    badge: 'SYSTEMS SPECIALIST',
    status: 'ONLINE',
    // 📸 Put Elite #3 photo here:
    photo: '/headshot-piyush.png',
    fallbackPhoto: '/piyush-raster.png',
    stats: {
      xp: '2,750 XP',
      missions: '38 Done',
      score: '9.7/10',
    },
    accentColor: '#BD7AFF', // Violet
  },
  {
    id: 'elite-4',
    name: 'Elite Candidate Seat',
    callsign: 'SEAT #04',
    role: 'Defensive Engineering · Cohort 2026',
    tier: 'Candidate Tier',
    rank: '#04',
    badge: 'OPEN SEAT',
    status: 'APPLYING',
    // 📸 Put Elite #4 photo here:
    photo: '/elite-leader-archetype.jpg',
    fallbackPhoto: 'https://images.unsplash.com/photo-1546776310-eef45dd6d63c?w=800&auto=format&fit=crop&q=80',
    stats: {
      xp: 'Target 3k XP',
      missions: 'Cohort 02',
      score: 'Vetted',
    },
    accentColor: '#8000FF', // Thread Purple
    isSeatSlot: true,
  },
];

export function EliteCardsShowcase({ elites = DEFAULT_ELITES }) {
  const [hoveredCard, setHoveredCard] = useState(null);

  return (
    <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 my-6">
      {/* Background Ambient Spotlight for the Cards Stage */}
      <div className="absolute inset-0 -top-8 -bottom-8 bg-[radial-gradient(ellipse_70%_50%_at_50%_50%,rgba(140,207,66,0.14)_0%,rgba(128,0,255,0.1)_45%,transparent_80%)] blur-3xl pointer-events-none" />

      {/* Grid of Elite Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 relative z-10">
        {elites.map((elite, index) => {
          const isHovered = hoveredCard === elite.id;

          return (
            <motion.div
              key={elite.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              whileHover={{ y: -7 }}
              onMouseEnter={() => setHoveredCard(elite.id)}
              onMouseLeave={() => setHoveredCard(null)}
              className="group relative flex flex-col rounded-2xl overflow-hidden bg-[#0A0810]/90 border border-white/10 hover:border-[#8CCF42]/80 transition-all duration-300 shadow-[0_12px_36px_rgba(0,0,0,0.85)] hover:shadow-[0_0_35px_rgba(140,207,66,0.35)] select-none"
            >
              {/* Top Accent Gradient Border */}
              <div
                className="h-[3px] w-full transition-opacity duration-300"
                style={{
                  background: `linear-gradient(90deg, transparent, ${elite.accentColor || '#8CCF42'}, transparent)`,
                  opacity: isHovered ? 1 : 0.6,
                }}
              />

              {/* ── PHOTO CONTAINER ── */}
              <div className="relative w-full aspect-[4/5] overflow-hidden bg-[#050408]">
                {/* Elite Photo */}
                <img
                  src={elite.photo}
                  alt={elite.name}
                  className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105 pointer-events-none"
                  loading="eager"
                  onError={(e) => {
                    if (elite.fallbackPhoto && e.currentTarget.src !== elite.fallbackPhoto) {
                      e.currentTarget.src = elite.fallbackPhoto;
                    }
                  }}
                />

                {/* Dark Vignette Overlay on the Photo */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0810] via-black/25 to-black/30 pointer-events-none" />

                {/* Cyber HUD Corner Brackets */}
                <span className="absolute top-3 left-3 w-3 h-3 border-t-2 border-l-2 border-[#8CCF42]/80 pointer-events-none" />
                <span className="absolute bottom-3 right-3 w-3 h-3 border-b-2 border-r-2 border-[#8CCF42]/80 pointer-events-none" />

                {/* Top Badges: Rank & Live Status */}
                <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-none">
                  {/* Rank Badge */}
                  <span
                    className="font-mono text-[10px] font-black px-2.5 py-0.5 rounded-full border backdrop-blur-md shadow-md"
                    style={{
                      color: elite.accentColor || '#8CCF42',
                      borderColor: `${elite.accentColor || '#8CCF42'}60`,
                      backgroundColor: '#08070C85',
                    }}
                  >
                    RANK {elite.rank}
                  </span>

                  {/* Status Indicator */}
                  <span className="flex items-center gap-1.5 font-mono text-[9px] font-bold text-white/90 px-2 py-0.5 rounded-full bg-black/75 border border-white/10 backdrop-blur-md">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#8CCF42] animate-ping" />
                    <span>{elite.status}</span>
                  </span>
                </div>

                {/* Overlay Badge at Bottom of Photo */}
                <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between pointer-events-none">
                  <span className="font-mono text-[9px] font-bold text-[#BD7AFF] tracking-wider uppercase px-2 py-0.5 rounded bg-[#15111F]/90 border border-[#8000FF]/40 backdrop-blur-md">
                    {elite.tier}
                  </span>
                  <span className="font-mono text-[9px] font-semibold text-white/70">
                    ID // 0{index + 1}
                  </span>
                </div>
              </div>

              {/* ── CARD CONTENT & BIO ── */}
              <div className="p-4 flex flex-col flex-1 justify-between bg-gradient-to-b from-[#0A0810] to-[#0E0C17]">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-sans font-bold text-white text-base sm:text-lg group-hover:text-[#8CCF42] transition-colors duration-200 truncate">
                      {elite.name}
                    </h3>
                  </div>

                  <p className="text-[#8A9094] text-xs font-normal leading-relaxed line-clamp-2 mb-3">
                    {elite.role}
                  </p>
                </div>

                {/* Stats Metric Strip */}
                <div className="pt-2.5 border-t border-white/10 grid grid-cols-3 gap-1 text-center font-mono text-[10px]">
                  <div className="flex flex-col">
                    <span className="text-zinc-500 text-[8px] uppercase tracking-wider">XP</span>
                    <span className="font-bold text-white truncate">{elite.stats.xp}</span>
                  </div>
                  <div className="flex flex-col border-x border-white/10">
                    <span className="text-zinc-500 text-[8px] uppercase tracking-wider">MISSIONS</span>
                    <span className="font-bold text-[#8CCF42] truncate">{elite.stats.missions}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-zinc-500 text-[8px] uppercase tracking-wider">SCORE</span>
                    <span className="font-bold text-[#BD7AFF] truncate">{elite.stats.score}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export default EliteCardsShowcase;
