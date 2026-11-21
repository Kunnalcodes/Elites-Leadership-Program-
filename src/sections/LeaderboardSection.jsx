import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Award, Lock, Sparkles, Shield, Hand, ArrowRight, Zap, CheckCircle2, Star, Users } from 'lucide-react';
import Lanyard from '../components/Lanyard';

// Graceful WebGL capability check for static fallback
function checkWebGLSupport() {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
  } catch {
    return false;
  }
}

export function LeaderboardSection() {
  const [hasWebGL, setHasWebGL] = useState(true);
  const [selectedEliteId, setSelectedEliteId] = useState('dhiraj');

  useEffect(() => {
    setHasWebGL(checkWebGLSupport());
  }, []);

  const highAchievers = [
    {
      id: 'dhiraj',
      rank: 1,
      name: 'Dhiraj',
      title: 'CHAMPION',
      xp: '2,980 XP',
      nextLevelTarget: '3,000 XP',
      nextLevelName: 'Catalyst Sentinel',
      progressPct: 98,
      tier: 'CATALYST',
      promotionStatus: 'PROMOTED TO CATALYST',
      label: '1st Position',
      rankBadge: 'RANK #01',
      badgeIcon: '👑',
      accentColor: '#FFD700', // Gold
      badgeBg: 'bg-[#FFD700]/10 border-[#FFD700]/60 text-[#FFD700]',
      photo: '/headshot-dhiraj.png',
      cardFront: '/card-front-dhiraj.png',
      highlight: 'HIGHEST XP SCORE · COHORT LEADER',
      isTopLeader: true,
      tasksCompleted: 42,
      peerReviewScore: '9.9/10',
    },
    {
      id: 'piyush',
      rank: 2,
      name: 'Piyush',
      title: 'RUNNER-UP',
      xp: '2,750 XP',
      nextLevelTarget: '2,850 XP',
      nextLevelName: 'Catalyst Advanced',
      progressPct: 94,
      tier: 'CATALYST',
      promotionStatus: 'PROMOTED TO CATALYST',
      label: '2nd Position',
      rankBadge: 'RANK #02',
      badgeIcon: '⚡',
      accentColor: '#BD7AFF', // Violet
      badgeBg: 'bg-[#8000FF]/15 border-[#8000FF]/60 text-[#BD7AFF]',
      photo: '/headshot-piyush.png',
      cardFront: '/card-front-piyush.png',
      highlight: 'PROMOTED TO CATALYST',
      isTopLeader: false,
      tasksCompleted: 38,
      peerReviewScore: '9.7/10',
    },
    {
      id: 'kalpana',
      rank: 3,
      name: 'Kalpana',
      title: 'THIRD PLACE',
      xp: '2,620 XP',
      nextLevelTarget: '2,700 XP',
      nextLevelName: 'Catalyst Advanced',
      progressPct: 92,
      tier: 'CATALYST',
      promotionStatus: 'PROMOTED TO CATALYST',
      label: '3rd Position',
      rankBadge: 'RANK #03',
      badgeIcon: '🌟',
      accentColor: '#8CCF42', // Security green
      badgeBg: 'bg-[#8CCF42]/10 border-[#8CCF42]/60 text-[#8CCF42]',
      photo: '/headshot-kalpana.png',
      cardFront: '/card-front-kalpana.png',
      highlight: 'PROMOTED TO CATALYST',
      isTopLeader: false,
      tasksCompleted: 36,
      peerReviewScore: '9.8/10',
    },
  ];

  const activeAchiever = highAchievers.find((e) => e.id === selectedEliteId) || highAchievers[0];

  return (
    <section id="leaderboard" className="w-full bg-[#100D17] section-vertical-space border-t border-[#292132] overflow-hidden select-none">
      <div className="elite-container">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 mb-3 text-xs font-mono tracking-widest text-[#BD7AFF] uppercase">
            <Trophy className="w-3.5 h-3.5 text-[#FFD700]" />
            <span>Merit &amp; Gamification // 07</span>
          </div>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.04] mb-5 font-heading">
            GROWTH SHOULD BE VISIBLE. <br />
            <span className="text-[#8000FF]">EFFORT SHOULD BE RECOGNIZED.</span>
          </h2>
          <p className="text-sm sm:text-base text-[#C5BED0] font-normal leading-relaxed">
            The Thread Elite XP ledger validates technical and leadership contributions in real-time. 
            Inspect the high achievers who have earned promotion to <span className="text-[#BD7AFF] font-bold">CATALYST</span>, with live 3D biometric credentials and verified performance metrics.
          </p>
        </div>

        {/* Main Two-Column Composition */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch mb-14">
          
          {/* Left Column: High Achiever Command Cards & Dossier */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            
            {/* Achiever Header Tag */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-[#898293] uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles size={13} className="text-[#8CCF42]" />
                HIGH ACHIEVERS DIRECTORY // PROMOTED TO CATALYST
              </span>
              <span className="text-[11px] font-mono text-[#BD7AFF] uppercase">
                CLICK CARD TO INSPECT ID
              </span>
            </div>

            {/* Three High Achiever Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {highAchievers.map((achiever) => {
                const isSelected = achiever.id === selectedEliteId;
                return (
                  <button
                    key={achiever.id}
                    type="button"
                    onClick={() => setSelectedEliteId(achiever.id)}
                    className={`p-4 rounded-[22px] border text-left transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${
                      isSelected
                        ? 'bg-[#1D1729] border-[#8000FF] shadow-2xl shadow-[#8000FF]/35 -translate-y-1.5 ring-2 ring-[#8000FF]/60'
                        : 'bg-[#15111F] border-[#38264F] hover:border-[#8000FF]/50 hover:bg-[#181324]'
                    }`}
                  >
                    {/* Top Leader Ribbon for #1 Dhiraj */}
                    {achiever.isTopLeader && (
                      <div className="absolute -top-1 -right-1 px-2.5 py-0.5 bg-[#FFD700] text-black font-mono text-[9px] font-black uppercase rounded-bl-lg tracking-wider flex items-center gap-1 shadow">
                        <span>#1 LEADER</span>
                      </div>
                    )}

                    <div>
                      {/* Photo Thumbnail + Position Pill */}
                      <div className="flex items-center gap-3 mb-3">
                        <div className="relative shrink-0">
                          <img
                            src={achiever.photo}
                            alt={achiever.name}
                            className={`w-14 h-14 rounded-full object-cover border-2 transition-transform duration-300 ${
                              isSelected
                                ? 'border-[#8000FF] scale-105 shadow-lg shadow-[#8000FF]/50 ring-2 ring-white/20'
                                : 'border-[#38264F]'
                            }`}
                          />
                          <span
                            className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black border border-[#08070C]"
                            style={{ backgroundColor: achiever.accentColor, color: '#08070C' }}
                          >
                            {achiever.rank}
                          </span>
                        </div>

                        <div className="min-w-0">
                          <span className={`inline-block text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider truncate mb-0.5 ${achiever.badgeBg}`}>
                            {achiever.title}
                          </span>
                          <div className="font-heading text-lg font-bold text-white truncate">
                            {achiever.name}
                          </div>
                        </div>
                      </div>

                      {/* Promotion Badge: Promoted to Catalyst */}
                      <div className="mb-3 px-2 py-1 rounded-md bg-[#8000FF]/20 border border-[#8000FF]/40 text-center">
                        <span className="font-mono text-[9px] font-bold text-[#BD7AFF] tracking-wider uppercase">
                          ★ PROMOTED TO CATALYST
                        </span>
                      </div>

                      {/* XP Metric Box */}
                      <div className="p-2.5 bg-[#100D17] border border-[#292132] rounded-[14px] mb-3">
                        <div className="flex items-center justify-between text-[10px] font-mono text-[#898293] uppercase mb-0.5">
                          <span>Verified XP</span>
                          <span style={{ color: achiever.accentColor }}>CATALYST</span>
                        </div>
                        <div className="font-heading text-xl font-black text-white">
                          {achiever.xp}
                        </div>
                      </div>

                      {/* Next Horizon Progress */}
                      <div className="space-y-1 mb-2">
                        <div className="flex items-center justify-between text-[9px] font-mono text-[#898293]">
                          <span>Horizon:</span>
                          <span className="text-[#8CCF42] font-bold">{achiever.progressPct}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-[#1D1729] rounded-full overflow-hidden border border-[#38264F]/50">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${achiever.progressPct}%`,
                              backgroundColor: achiever.accentColor,
                            }}
                          />
                        </div>
                        <span className="text-[9px] font-mono text-[#C5BED0] block truncate">
                          ➔ {achiever.nextLevelName}
                        </span>
                      </div>
                    </div>

                    {/* Card Footer Status */}
                    <div className="text-[10px] font-mono flex items-center justify-between pt-2 border-t border-[#292132] text-[#898293]">
                      <span className="truncate">{achiever.highlight}</span>
                      <span className={`text-xs ${isSelected ? 'text-[#8CCF42]' : 'text-transparent'}`}>●</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Selected Achiever Dossier Card (Replaces the dimensional podium platform) */}
            <div className="bg-[#08070C] border border-[#38264F] rounded-[24px] p-6 shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between pb-3 border-b border-[#1D1729] mb-4">
                <span className="text-[11px] font-mono text-[#BD7AFF] uppercase tracking-wider flex items-center gap-2">
                  <Shield size={13} className="text-[#8CCF42]" />
                  EXECUTIVE DOSSIER // {activeAchiever.name.toUpperCase()} (RANK #{activeAchiever.rank})
                </span>
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#8000FF]/20 text-[#BD7AFF] border border-[#8000FF]/50 uppercase font-bold">
                  OFFICIAL PROMOTION: CATALYST
                </span>
              </div>

              {/* Grid Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                <div className="p-3 bg-[#15111F] rounded-xl border border-[#292132]">
                  <span className="text-[10px] font-mono text-[#898293] block mb-1">PROMOTION STATUS</span>
                  <span className="text-sm font-bold text-[#8CCF42] block">CATALYST</span>
                </div>
                <div className="p-3 bg-[#15111F] rounded-xl border border-[#292132]">
                  <span className="text-[10px] font-mono text-[#898293] block mb-1">TOTAL XP EARNED</span>
                  <span className="text-sm font-bold text-white block">{activeAchiever.xp}</span>
                </div>
                <div className="p-3 bg-[#15111F] rounded-xl border border-[#292132]">
                  <span className="text-[10px] font-mono text-[#898293] block mb-1">MISSIONS DELIVERED</span>
                  <span className="text-sm font-bold text-white block">{activeAchiever.tasksCompleted} Tasks</span>
                </div>
                <div className="p-3 bg-[#15111F] rounded-xl border border-[#292132]">
                  <span className="text-[10px] font-mono text-[#898293] block mb-1">PEER RATING</span>
                  <span className="text-sm font-bold text-[#FFD700] block">{activeAchiever.peerReviewScore}</span>
                </div>
              </div>

              {/* Progress Toward Next Command Level */}
              <div className="p-3.5 bg-[#15111F] rounded-xl border border-[#292132] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <Zap size={14} className="text-[#8CCF42]" />
                    <span className="font-heading font-bold text-sm text-white">
                      Heading Towards: {activeAchiever.nextLevelName}
                    </span>
                  </div>
                  <p className="text-xs text-[#898293] font-mono">
                    Target: {activeAchiever.nextLevelTarget} · Current: {activeAchiever.xp} ({activeAchiever.progressPct}% complete)
                  </p>
                </div>

                <div className="w-full sm:w-44 shrink-0">
                  <div className="w-full h-2 bg-[#08070C] rounded-full overflow-hidden border border-[#38264F]">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${activeAchiever.progressPct}%`,
                        backgroundColor: activeAchiever.accentColor,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: 3D Lanyard ID Badge displaying the Selected Achiever's Photo */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="w-full h-full bg-[#08070C] border border-[#38264F] hover:border-[#8000FF] transition-colors rounded-[28px] p-4 sm:p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden">
              
              {/* Badge Header Bar with Selected Achiever Telemetry */}
              <div className="w-full flex items-center justify-between pb-3 border-b border-[#1D1729] mb-3 z-10">
                <div className="flex items-center gap-3">
                  <img
                    src={activeAchiever.photo}
                    alt={activeAchiever.name}
                    className="w-8 h-8 rounded-full object-cover border border-[#8000FF]"
                  />
                  <div>
                    <span className="text-xs font-mono font-bold text-white tracking-wider uppercase block">
                      {activeAchiever.name}'S BIOMETRIC PASS
                    </span>
                    <span className="text-[10px] font-mono text-[#8CCF42] uppercase font-bold">
                      PROMOTED TO CATALYST // {activeAchiever.xp}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono text-[#BD7AFF] tracking-wider uppercase bg-[#15111F] px-2.5 py-1 rounded-md border border-[#38264F]">
                    INTERACTIVE 3D
                  </span>
                </div>
              </div>

              {/* 3D Lanyard Canvas Container */}
              <div 
                className="w-full relative overflow-hidden rounded-[20px] bg-[#0A0810] flex items-center justify-center cursor-grab active:cursor-grabbing"
                style={{ width: '100%', height: '560px' }}
              >
                {hasWebGL ? (
                  <Lanyard
                    key={activeAchiever.id}
                    frontImage={activeAchiever.cardFront}
                    backImage="/card-back.png"
                    strapImage="/band.png"
                    cardColor="#08070C"
                    finish="glossy"
                    size={0.62}
                    strapLength={0.48}
                    strapWidth={0.68}
                  />
                ) : (
                  /* Static Fallback for environments where WebGL is unavailable */
                  <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
                    <img
                      src={activeAchiever.cardFront}
                      alt={`${activeAchiever.name}'s ID Badge`}
                      className="w-56 h-auto rounded-xl border border-[#8000FF] shadow-2xl mb-4"
                    />
                    <span className="text-xs font-mono text-[#898293] uppercase">
                      OFFICIAL THREAD ELITE CREDENTIAL
                    </span>
                  </div>
                )}

                {/* Subtle Ambient Glow behind Card */}
                <div 
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full blur-3xl pointer-events-none opacity-20"
                  style={{ backgroundColor: activeAchiever.accentColor }}
                />
              </div>

              {/* Badge Telemetry & Interaction Instruction Footer */}
              <div className="w-full mt-3 pt-3 border-t border-[#1D1729] flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] font-mono text-[#898293] z-10">
                <div className="flex items-center gap-2 text-[#C5BED0]">
                  <Hand size={13} className="text-[#8CCF42]" />
                  <span>DRAG TO SWING · CLICK TO FLIP</span>
                </div>
                <span className="text-[#BD7AFF] font-semibold tracking-wider">
                  VERIFIED BIOMETRIC PASS
                </span>
              </div>

            </div>
          </div>

        </div>

        {/* Action Link to Login */}
        <div className="bg-[#15111F] border border-[#38264F] rounded-[24px] p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={16} className="text-[#8CCF42]" />
              <h3 className="text-xl sm:text-2xl font-bold text-white font-heading">
                Check Your Official Rank &amp; Standing
              </h3>
            </div>
            <p className="text-sm text-[#C5BED0] max-w-2xl leading-relaxed">
              Log in to your authorized Elite dashboard to inspect criterion scores, awarded XP, peer reviews, and your promotion status to Catalyst.
            </p>
          </div>
          <Link
            to="/login"
            className="w-full sm:w-auto h-12 px-8 rounded-lg bg-[#8000FF] hover:bg-[#9333EA] border border-[#BD7AFF] shadow-[0_0_20px_rgba(128,0,255,0.35)] text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all duration-200 hover:-translate-y-0.5 shrink-0"
          >
            <Lock className="w-4 h-4 text-white" />
            <span>Access Elite Portal</span>
          </Link>
        </div>

      </div>
    </section>
  );
}

export default LeaderboardSection;
