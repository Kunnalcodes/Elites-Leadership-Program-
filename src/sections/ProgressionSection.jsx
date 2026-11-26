import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Layers,
  Shield,
  Zap,
  Sparkles,
  Award,
  Crown,
  ChevronRight,
  CheckCircle2,
  ArrowRight,
  Maximize2,
  X,
  Lock,
} from 'lucide-react';
import Particles from '../components/Particles';

export function ProgressionSection() {
  const [activeStage, setActiveStage] = useState(1);
  const [showLightbox, setShowLightbox] = useState(false);

  /**
   * ══════════════════════════════════════════════════════════════════════════
   * 5 DISTINCT ECHELON ENTITIES & ASSIGNED COLOR MATRIX
   * - Level 1: FOUNDATION  -> Green   (#10B981)
   * - Level 2: CATALYST    -> Red     (#EF4444)
   * - Level 3: PIONEER     -> Orange  (#F97316)
   * - Level 4: APEX        -> Magenta (#EC4899)
   * - Level 5: LEGACY      -> Violet  (#8B5CF6)
   * ══════════════════════════════════════════════════════════════════════════
   */
  const stages = [
    {
      level: 1,
      number: '01',
      name: 'FOUNDATION',
      entityName: 'The Initiate Sentinel',
      guild: 'Defense Foundation Guild',
      callsign: 'GUILD // SENTINEL-01',
      color: '#10B981', // Green
      colorName: 'Emerald Green',
      glowColor: 'rgba(16, 185, 129, 0.35)',
      bgTint: 'rgba(16, 185, 129, 0.08)',
      borderTint: 'rgba(16, 185, 129, 0.45)',
      icon: Shield,
      focus: 'Responsibility & Knowledge Baseline',
      shortDesc: 'Build the foundations of responsibility, ethical hygiene, and defensive participation.',
      description:
        'Establish core cybersecurity principles, threat modeling essentials, communication standards, and cohort synchronization. Candidates master fundamental security mechanics and develop personal accountability.',
      milestones: [
        'Security Defense Fundamentals & Zero-Trust Core',
        'Cohort Communications Protocol & Crypto Basics',
        'Threat Modeling Baseline & Risk Rubric',
        'Personal Ownership & Ethical Defense Commitment',
      ],
      gate: 'Foundational Rubric Assessment (85%+)',
      xpBand: '0 – 1,000 XP',
      clearance: 'L1 // INITIATE_ACCESS',
      dashboardRoute: '/elite/foundation',
    },
    {
      level: 2,
      number: '02',
      name: 'CATALYST',
      entityName: 'The Strike Specialist',
      guild: 'Tactical Execution Division',
      callsign: 'DIVISION // STRIKE-02',
      color: '#EF4444', // Red
      colorName: 'Tactical Crimson',
      glowColor: 'rgba(239, 68, 68, 0.35)',
      bgTint: 'rgba(239, 68, 68, 0.08)',
      borderTint: 'rgba(239, 68, 68, 0.45)',
      icon: Zap,
      focus: 'Initiative, Attack Labs & Contribution',
      shortDesc: 'Turn learning into decisive initiative, rapid execution, and sprint deliverables.',
      description:
        'Engage in hands-on simulated attack scenarios, collaborative sprint initiatives, and rapid technical execution challenges. Candidates transform theoretical mastery into decisive mission actions.',
      milestones: [
        'Offensive/Defensive Lab Simulations',
        'High-Velocity Sprint Deliverables & Code PRs',
        'Live Threat Triage & Incident Drill Practice',
        'Peer Policy Reviews & Active Collaboration',
      ],
      gate: 'Sprint Execution Deliverables & Time Trials',
      xpBand: '1,000 – 2,500 XP',
      clearance: 'L2 // TACTICAL_SPRINT',
      dashboardRoute: '/elite/catalyst',
    },
    {
      level: 3,
      number: '03',
      name: 'PIONEER',
      entityName: 'The Vanguard Scholar',
      guild: 'Autonomous Research Corps',
      callsign: 'CORPS // VANGUARD-03',
      color: '#F97316', // Orange
      colorName: 'Vanguard Orange',
      glowColor: 'rgba(249, 115, 22, 0.35)',
      bgTint: 'rgba(249, 115, 22, 0.08)',
      borderTint: 'rgba(249, 115, 22, 0.45)',
      icon: Sparkles,
      focus: 'Ownership & Advanced Research',
      shortDesc: 'Lead independent vulnerability discovery and contribute novel methodologies.',
      description:
        'Lead independent vulnerability research, publish technical whitepapers, and spearhead specialized security workgroups. Pioneers formulate original methodologies that expand organizational knowledge.',
      milestones: [
        'Zero-Day Analysis & Responsible Disclosure',
        'Security Architecture Prototyping & Fuzzing',
        'Technical Whitepaper & Case Study Delivery',
        'Specialized Workgroup Team Leadership',
      ],
      gate: 'Original Research Publication Review',
      xpBand: '2,500 – 5,000 XP',
      clearance: 'L3 // AUTONOMOUS_RESEARCH',
      dashboardRoute: '/elite/pioneer',
    },
    {
      level: 4,
      number: '04',
      name: 'APEX',
      entityName: 'The Executive Commander',
      guild: 'Leadership Directorate',
      callsign: 'DIRECTORATE // APEX-04',
      color: '#EC4899', // Magenta
      colorName: 'Cyber Magenta',
      glowColor: 'rgba(236, 72, 153, 0.35)',
      bgTint: 'rgba(236, 72, 153, 0.08)',
      borderTint: 'rgba(236, 72, 153, 0.45)',
      icon: Award,
      focus: 'Leadership, Mentorship & Governance',
      shortDesc: 'Demonstrate enterprise guidance, peer consistency, and incident command.',
      description:
        'Drive high-impact enterprise architecture reviews, mentor incoming Foundation cohorts, and contribute to organizational policy. Apex leaders embody consistent, verified execution and guidance.',
      milestones: [
        'Enterprise Threat Advisory & War Games',
        'Direct Cohort Mentorship & Cadet Reviews',
        'Incident Response Orchestration & Post-Mortem',
        'Cross-Functional Security Strategy & Directives',
      ],
      gate: 'Cohort Mentorship Review & Peer Endorsement',
      xpBand: '5,000 – 8,500 XP',
      clearance: 'L4 // ENTERPRISE_COMMAND',
      dashboardRoute: '/elite/apex',
    },
    {
      level: 5,
      number: '05',
      name: 'LEGACY',
      entityName: 'The Architect Laureate',
      guild: 'Alumni Advisory Council',
      callsign: 'COUNCIL // LEGACY-05',
      color: '#8B5CF6', // Violet
      colorName: 'Royal Violet',
      glowColor: 'rgba(139, 92, 246, 0.35)',
      bgTint: 'rgba(139, 92, 246, 0.08)',
      borderTint: 'rgba(139, 92, 246, 0.45)',
      icon: Crown,
      focus: 'Lasting Impact & Alumni Advisory',
      shortDesc: 'Create lasting institutional impact and guide the future generations of leaders.',
      description:
        'Deliver signature capstone defense, transition to the alumni advisory council, and guide Thread Security strategic program governance for future generations of student leaders.',
      milestones: [
        'Signature Capstone Defense to Industry Board',
        'Alumni Advisory Transition & Guild Stewardship',
        'Institutional Policy Governance & Curricula',
        'Enduring Community Legacy & Endowment Mentorship',
      ],
      gate: 'Capstone Defense Board Review (Unanimous)',
      xpBand: '8,500+ XP · Summit',
      clearance: 'L5 // ENDURING_LEGACY',
      dashboardRoute: '/elite/legacy',
    },
  ];

  const currentStage = stages[activeStage - 1];
  const CurrentIcon = currentStage.icon;

  return (
    <section
      id="journey"
      className="relative w-full bg-[#08070C] text-white section-vertical-space border-t border-b border-[#292132] overflow-hidden isolate select-none"
    >
      {/* ── 1. Dynamic Ambient Colored Spotlight (Shifts color with active entity) ── */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Dynamic primary stage glow */}
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1100px] h-[650px] blur-3xl opacity-40 transition-all duration-700 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 70% 50% at 50% 50%, ${currentStage.color} 0%, transparent 70%)`,
          }}
        />

        {/* Ambient background particles */}
        <div className="absolute inset-0 opacity-40 pointer-events-none" style={{ width: '100%', height: '100%' }}>
          <Particles
            particleColors={[currentStage.color, '#8000FF', '#BD7AFF']}
            particleCount={120}
            particleSpread={15}
            speed={0.06}
            particleBaseSize={80}
            glow={0.3}
            twinkle={0.2}
            moveParticlesOnHover
            hoverEffect="parallax"
            lightMode={false}
          />
        </div>
      </div>

      {/* ── 2. Foreground Progression Content ── */}
      <div className="elite-container relative z-10 pointer-events-none">
        
        {/* Section Heading: Space Grotesk Editorial */}
        <div className="max-w-4xl mb-12 pointer-events-auto">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 mb-4 px-3.5 py-1.5 rounded-full bg-[#15111F]/90 border border-white/10 text-xs font-mono font-bold tracking-widest uppercase shadow-md">
            <Layers size={13} className="text-[#BD7AFF]" />
            <span className="text-zinc-300">THE ELITE PROGRESSION SYSTEM</span>
            <span
              className="w-2 h-2 rounded-full animate-ping"
              style={{ backgroundColor: currentStage.color }}
            />
          </div>

          {/* Main Headline */}
          <h2 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[0.96] mb-5 font-heading">
            <span className="block">FIVE LEVELS.</span>
            <span
              className="block transition-colors duration-500"
              style={{
                color: currentStage.color,
                textShadow: `0 0 45px ${currentStage.glowColor}`,
              }}
            >
              FIVE DISTINCT ENTITIES.
            </span>
          </h2>

          {/* Supporting Copy */}
          <p className="text-base sm:text-lg text-[#C5BED0] font-normal leading-relaxed mb-6 max-w-2xl font-sans">
            Growth is not a generic ladder. Each level operates as an autonomous operational echelon with distinct
            mandates, unique visual identity, rigorous progression gates, and expanding executive authority.
          </p>

          {/* Five Entity Color Quick Navigator */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            {stages.map((s) => (
              <button
                key={s.level}
                onClick={() => setActiveStage(s.level)}
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border font-mono text-[11px] font-bold transition-all duration-300 cursor-pointer ${
                  activeStage === s.level
                    ? 'border-white text-white shadow-lg'
                    : 'border-white/10 text-zinc-400 hover:text-white hover:border-white/20'
                }`}
                style={{
                  backgroundColor: activeStage === s.level ? s.bgTint : '#15111F80',
                  borderColor: activeStage === s.level ? s.color : undefined,
                  boxShadow: activeStage === s.level ? `0 0 20px ${s.glowColor}` : 'none',
                }}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: s.color }}
                />
                <span>L0{s.level} {s.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── 3. Five Progression Stages: Interactive Dimensional Platforms (Desktop) ── */}
        <div className="hidden lg:block mb-12 pointer-events-auto">
          <div className="relative">
            {/* Connecting Pathway Rail */}
            <div className="absolute top-1/2 left-10 right-10 -translate-y-1/2 h-1 bg-[#1D1729] rounded-full z-0">
              <div
                className="h-full rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${((activeStage - 1) / (stages.length - 1)) * 100}%`,
                  backgroundColor: currentStage.color,
                  boxShadow: `0 0 16px ${currentStage.color}`,
                }}
              />
            </div>

            {/* Five Dimensional Stage Cards */}
            <div className="relative z-10 grid grid-cols-5 gap-4 items-end pt-10 pb-4">
              {stages.map((stage) => {
                const isActive = activeStage === stage.level;
                const isPassed = activeStage > stage.level;
                const StageIcon = stage.icon;

                return (
                  <button
                    key={stage.level}
                    type="button"
                    onClick={() => setActiveStage(stage.level)}
                    className={`group relative text-left p-5 rounded-[22px] transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden ${
                      isActive
                        ? '-translate-y-4 shadow-2xl ring-2'
                        : 'bg-[#100D17]/80 backdrop-blur-sm border-2 border-white/10 hover:border-white/30 hover:-translate-y-2 shadow-md'
                    }`}
                    style={{
                      backgroundColor: isActive ? '#140E22' : undefined,
                      borderColor: isActive ? stage.color : undefined,
                      boxShadow: isActive ? `0 14px 40px ${stage.glowColor}` : undefined,
                      ringColor: isActive ? `${stage.color}60` : undefined,
                    }}
                  >
                    {/* Top colored accent line */}
                    <div
                      className="absolute top-0 inset-x-0 h-[3px] transition-opacity duration-300"
                      style={{
                        backgroundColor: stage.color,
                        opacity: isActive ? 1 : 0.4,
                      }}
                    />

                    {/* Top Connecting Node Pip & Entity Icon */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span
                          className="font-mono text-xs font-black px-2.5 py-1 rounded-md transition-colors"
                          style={{
                            backgroundColor: isActive ? stage.color : '#1C162A',
                            color: isActive ? '#08070C' : stage.color,
                          }}
                        >
                          {stage.number}
                        </span>

                        <div
                          className="w-6 h-6 rounded-md flex items-center justify-center transition-colors"
                          style={{
                            backgroundColor: `${stage.color}20`,
                            color: stage.color,
                          }}
                        >
                          <StageIcon size={13} />
                        </div>
                      </div>

                      {/* Status Pip */}
                      {isPassed ? (
                        <CheckCircle2 size={16} className="text-[#10B981]" />
                      ) : isActive ? (
                        <span
                          className="w-2.5 h-2.5 rounded-full animate-ping"
                          style={{ backgroundColor: stage.color }}
                        />
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-white/20 group-hover:bg-white/40 transition-colors" />
                      )}
                    </div>

                    {/* Stage Name */}
                    <div className="font-heading text-lg font-black tracking-tight mb-0.5 text-white">
                      {stage.name}
                    </div>

                    {/* Entity Subtitle */}
                    <div
                      className="font-mono text-[10px] font-bold tracking-wider uppercase mb-2 truncate"
                      style={{ color: stage.color }}
                    >
                      {stage.entityName}
                    </div>

                    {/* Short Description */}
                    <p className="text-xs text-[#A7ADB2] leading-snug line-clamp-2 mb-3 font-sans">
                      {stage.shortDesc}
                    </p>

                    {/* Platform Base Indicator */}
                    <div className="pt-2.5 border-t border-white/10 flex items-center justify-between text-[10px] font-mono">
                      <span
                        className="font-bold"
                        style={{ color: isActive ? stage.color : '#8A9094' }}
                      >
                        {isActive ? 'ACTIVE ENTITY' : `TIER 0${stage.level}`}
                      </span>
                      <ChevronRight
                        size={12}
                        className={isActive ? 'translate-x-0.5' : 'text-[#8A9094]'}
                        style={{ color: isActive ? stage.color : undefined }}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Mobile Vertical Progression Timeline (Below lg screens) ── */}
        <div className="block lg:hidden mb-10 space-y-3 pointer-events-auto">
          {stages.map((stage) => {
            const isActive = activeStage === stage.level;
            const isPassed = activeStage > stage.level;
            const StageIcon = stage.icon;

            return (
              <button
                key={stage.level}
                type="button"
                onClick={() => setActiveStage(stage.level)}
                className={`w-full text-left p-4 sm:p-5 rounded-[20px] border-2 transition-all flex items-start gap-4 ${
                  isActive
                    ? 'bg-[#140E22] shadow-xl'
                    : 'bg-[#100D17]/80 border-white/10'
                }`}
                style={{
                  borderColor: isActive ? stage.color : undefined,
                  boxShadow: isActive ? `0 8px 30px ${stage.glowColor}` : undefined,
                }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center font-mono font-black text-sm shrink-0"
                  style={{
                    backgroundColor: isActive ? stage.color : '#1C162A',
                    color: isActive ? '#08070C' : stage.color,
                  }}
                >
                  {stage.number}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-heading font-black text-base text-white">
                      {stage.name}
                    </span>
                    <span
                      className="text-[10px] font-mono font-bold uppercase"
                      style={{ color: stage.color }}
                    >
                      {isActive ? '● SELECTED' : isPassed ? 'VERIFIED' : `TIER 0${stage.level}`}
                    </span>
                  </div>
                  <div className="text-[11px] font-mono font-semibold text-zinc-400 mb-1">
                    {stage.entityName}
                  </div>
                  <p className="text-xs text-[#A7ADB2] leading-relaxed">
                    {stage.shortDesc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* ── 4. Progression Detail Panel & Neon Leadership Emblem Showcase ── */}
        <div
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#0D0917]/95 border-2 rounded-[28px] p-6 sm:p-10 shadow-2xl pointer-events-auto transition-all duration-500 relative overflow-hidden"
          style={{
            borderColor: `${currentStage.color}60`,
            boxShadow: `0 20px 60px ${currentStage.glowColor}`,
          }}
        >
          {/* Subtle Ambient Inner Glow */}
          <div
            className="absolute top-0 right-0 w-[500px] h-[500px] blur-3xl pointer-events-none opacity-20"
            style={{
              background: `radial-gradient(circle, ${currentStage.color} 0%, transparent 70%)`,
            }}
          />

          {/* Left Column: Entity Detail Breakdown */}
          <div className="lg:col-span-7 flex flex-col justify-between relative z-10">
            {/* Stage Callout & Callsign */}
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <span
                className="px-3.5 py-1 rounded-full text-xs font-mono font-bold uppercase shadow-sm border"
                style={{
                  backgroundColor: currentStage.bgTint,
                  borderColor: currentStage.borderTint,
                  color: currentStage.color,
                }}
              >
                {currentStage.callsign}
              </span>
              <span className="font-mono text-xs text-[#8A9094] uppercase tracking-wider font-semibold">
                TIER 0{activeStage} OF 05 // {currentStage.colorName}
              </span>
            </div>

            {/* Level Title */}
            <h3 className="text-3xl sm:text-5xl font-black text-white mb-2 font-heading tracking-tight">
              Level 0{activeStage} —{' '}
              <span style={{ color: currentStage.color }}>{currentStage.name}</span>
            </h3>

            {/* Entity Name & Focus */}
            <div className="flex items-center gap-2 text-sm sm:text-base font-bold text-white mb-3">
              <span
                className="px-2 py-0.5 rounded text-xs font-mono"
                style={{
                  backgroundColor: `${currentStage.color}25`,
                  color: currentStage.color,
                }}
              >
                ENTITY:
              </span>
              <span>{currentStage.entityName}</span>
              <span className="text-zinc-500">·</span>
              <span className="text-zinc-400 font-normal">{currentStage.guild}</span>
            </div>

            <div
              className="text-xs sm:text-sm font-mono font-semibold mb-4"
              style={{ color: currentStage.color }}
            >
              Core Mandate: {currentStage.focus}
            </div>

            {/* Description */}
            <p className="text-sm sm:text-base text-[#C5BED0] leading-relaxed mb-6 font-sans">
              {currentStage.description}
            </p>

            {/* Key Development Themes & Milestones */}
            <div className="mb-6 p-5 bg-[#140F22] border border-white/10 rounded-[18px]">
              <span className="text-xs font-mono text-white uppercase font-bold tracking-wider block mb-3 flex items-center justify-between">
                <span>Key Development Themes &amp; Milestones:</span>
                <span
                  className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/60"
                  style={{ color: currentStage.color }}
                >
                  4 CRITERIA
                </span>
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentStage.milestones.map((m, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 text-xs text-zinc-300 p-2 rounded-lg bg-black/30 border border-white/5"
                  >
                    <span
                      className="w-2 h-2 rounded-full mt-1 shrink-0"
                      style={{ backgroundColor: currentStage.color }}
                    />
                    <span className="leading-snug">{m}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Telemetry Matrix (4 Blocks) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-3 bg-[#140F22] border border-white/10 rounded-xl">
                <span className="text-[9px] font-mono text-[#8A9094] uppercase block mb-0.5">
                  Progression Gate
                </span>
                <span className="text-xs font-bold text-white leading-tight block truncate">
                  {currentStage.gate}
                </span>
              </div>

              <div className="p-3 bg-[#140F22] border border-white/10 rounded-xl">
                <span className="text-[9px] font-mono text-[#8A9094] uppercase block mb-0.5">
                  XP Threshold
                </span>
                <span
                  className="text-xs font-mono font-bold block truncate"
                  style={{ color: currentStage.color }}
                >
                  {currentStage.xpBand}
                </span>
              </div>

              <div className="p-3 bg-[#140F22] border border-white/10 rounded-xl">
                <span className="text-[9px] font-mono text-[#8A9094] uppercase block mb-0.5">
                  Clearance Echelon
                </span>
                <span className="text-xs font-mono font-bold text-white block truncate">
                  {currentStage.clearance}
                </span>
              </div>

              <div className="p-3 bg-[#140F22] border border-white/10 rounded-xl">
                <span className="text-[9px] font-mono text-[#8A9094] uppercase block mb-0.5">
                  Authorized Route
                </span>
                <span
                  className="text-xs font-mono font-bold block truncate"
                  style={{ color: currentStage.color }}
                >
                  {currentStage.dashboardRoute}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: High-Tech Cyber Holographic Emblem Card */}
          <div className="lg:col-span-5 flex flex-col items-center relative z-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStage}
                initial={{ opacity: 0, scale: 0.94, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.94, y: -12 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                onClick={() => setShowLightbox(true)}
                className="group relative w-full cursor-pointer bg-[#0A0713] border-2 rounded-[24px] p-4 sm:p-5 shadow-2xl transition-all duration-300 hover:scale-[1.02] overflow-hidden"
                style={{
                  borderColor: currentStage.color,
                  boxShadow: `0 0 35px ${currentStage.glowColor}`,
                }}
              >
                {/* Cyber HUD Corner Brackets */}
                <span
                  className="absolute top-2.5 left-2.5 w-3 h-3 border-t-2 border-l-2 pointer-events-none"
                  style={{ borderColor: currentStage.color }}
                />
                <span
                  className="absolute bottom-2.5 right-2.5 w-3 h-3 border-b-2 border-r-2 pointer-events-none"
                  style={{ borderColor: currentStage.color }}
                />

                {/* Header Tag */}
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full animate-pulse"
                      style={{ backgroundColor: currentStage.color }}
                    />
                    <span className="font-mono text-[10px] font-bold text-white tracking-widest uppercase">
                      OFFICIAL EMBLEM // {currentStage.name}
                    </span>
                  </div>
                  <Maximize2
                    size={13}
                    className="group-hover:scale-125 transition-transform"
                    style={{ color: currentStage.color }}
                  />
                </div>

                {/* The Emblem Image with dynamic colored backlight */}
                <div className="relative rounded-[16px] overflow-hidden bg-black flex items-center justify-center p-2">
                  <img
                    src="/neon-thread-elite.jpg"
                    alt={`Neon Emblem for ${currentStage.name}`}
                    className="w-full h-auto object-contain transition-transform duration-500 group-hover:scale-105"
                  />
                  
                  {/* Entity Color Ambient Shading */}
                  <div
                    className="absolute inset-0 pointer-events-none group-hover:opacity-40 transition-opacity"
                    style={{
                      background: `radial-gradient(circle, ${currentStage.color}25 0%, transparent 75%)`,
                    }}
                  />
                </div>

                {/* Footer Tag */}
                <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-[#8A9094]">
                  <span
                    className="font-bold flex items-center gap-1.5"
                    style={{ color: currentStage.color }}
                  >
                    <span>CLICK TO EXPAND FULLSCREEN</span>
                  </span>
                  <span className="text-white font-mono">
                    STAGE 0{activeStage} // AUTHENTICATED
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>

      </div>

      {/* ── Fullscreen Lightbox Modal for Neon Image ── */}
      <AnimatePresence>
        {showLightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowLightbox(false)}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 cursor-zoom-out"
          >
            <motion.div
              initial={{ scale: 0.85, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.85, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full bg-[#08070C] border-2 rounded-[28px] p-4 sm:p-6 flex flex-col items-center"
              style={{
                borderColor: currentStage.color,
                boxShadow: `0 0 60px ${currentStage.glowColor}`,
              }}
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setShowLightbox(false)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#15111F] border text-white flex items-center justify-center hover:bg-white hover:text-black transition-colors"
                style={{ borderColor: currentStage.color }}
                aria-label="Close modal"
              >
                <X size={18} />
              </button>

              <div className="w-full mb-3 pb-2 border-b border-white/10 flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: currentStage.color }}
                />
                <span className="font-mono text-xs font-bold text-white tracking-widest uppercase">
                  THREAD ELITE STUDENT LEADERSHIP PROGRAM // {currentStage.name} ({currentStage.entityName})
                </span>
              </div>

              <img
                src="/neon-thread-elite.jpg"
                alt="Neon Thread Elite Leadership Program Emblem"
                className="max-h-[75vh] w-auto object-contain rounded-xl shadow-2xl"
              />

              <div className="w-full mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono text-[#8A9094]">
                <span style={{ color: currentStage.color }} className="font-bold">
                  COLOR SIGNATURE // {currentStage.colorName} ({currentStage.color})
                </span>
                <span>AUTHENTICATED // STAGE 0{activeStage}</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
}

export default ProgressionSection;
