import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, Shield, ChevronRight, Zap, CheckCircle2, ArrowRight, Sparkles, Maximize2, X } from 'lucide-react';
import Particles from '../components/Particles';

export function ProgressionSection() {
  const [activeStage, setActiveStage] = useState(1);
  const [showLightbox, setShowLightbox] = useState(false);

  const stages = [
    {
      level: 1,
      number: '01',
      name: 'FOUNDATION',
      focus: 'Responsibility & Knowledge Baseline',
      shortDesc: 'Build the foundations of responsibility, knowledge and participation.',
      description:
        'Establish core cybersecurity principles, threat modeling essentials, communication standards, and cohort synchronization. Candidates master fundamental security mechanics and develop personal accountability.',
      milestones: [
        'Security Defense Fundamentals',
        'Cohort Communications Protocol',
        'Threat Modeling Baseline',
        'Personal Ownership Commitment',
      ],
      gate: 'Foundational Rubric Assessment',
      dashboardRoute: '/elite/foundation',
      elevation: 'translate-y-0',
    },
    {
      level: 2,
      number: '02',
      name: 'CATALYST',
      focus: 'Initiative & Contribution',
      shortDesc: 'Turn learning into initiative and meaningful contribution.',
      description:
        'Engage in hands-on simulated attack scenarios, collaborative sprint initiatives, and rapid technical execution challenges. Candidates transform theoretical mastery into decisive mission actions.',
      milestones: [
        'Offensive/Defensive Lab Simulations',
        'High-Velocity Sprint Deliverables',
        'Peer Code & Policy Reviews',
        'Active Cohort Collaboration',
      ],
      gate: 'Sprint Execution Deliverables',
      dashboardRoute: '/elite/catalyst',
      elevation: '-translate-y-2',
    },
    {
      level: 3,
      number: '03',
      name: 'PIONEER',
      focus: 'Ownership & Advanced Research',
      shortDesc: 'Take greater ownership and contribute to collaborative initiatives.',
      description:
        'Lead independent vulnerability research, publish technical whitepapers, and spearhead specialized security workgroups. Pioneers formulate original methodologies that expand organizational knowledge.',
      milestones: [
        'Vulnerability Analysis & Disclosure',
        'Security Architecture Prototyping',
        'Technical Whitepaper Delivery',
        'Workgroup Team Leadership',
      ],
      gate: 'Original Research Publication',
      dashboardRoute: '/elite/pioneer',
      elevation: '-translate-y-4',
    },
    {
      level: 4,
      number: '04',
      name: 'APEX',
      focus: 'Leadership & Mentorship',
      shortDesc: 'Demonstrate leadership, consistency and the ability to guide others.',
      description:
        'Drive high-impact enterprise architecture reviews, mentor incoming Foundation cohorts, and contribute to organizational policy. Apex leaders embody consistent, verified execution and guidance.',
      milestones: [
        'Enterprise Threat Advisory',
        'Direct Cohort Mentorship',
        'Incident Response Orchestration',
        'Cross-Functional Security Strategy',
      ],
      gate: 'Cohort Mentorship Review',
      dashboardRoute: '/elite/apex',
      elevation: '-translate-y-6',
    },
    {
      level: 5,
      number: '05',
      name: 'LEGACY',
      focus: 'Lasting Impact & Alumni Advisory',
      shortDesc: 'Create lasting impact and contribute to the development of future leaders.',
      description:
        'Deliver signature capstone defense, transition to the alumni advisory council, and guide Thread Security strategic program governance for future generations of student leaders.',
      milestones: [
        'Signature Capstone Defense',
        'Alumni Advisory Transition',
        'Institutional Policy Governance',
        'Enduring Community Legacy',
      ],
      gate: 'Capstone Defense Board Review',
      dashboardRoute: '/elite/legacy',
      elevation: '-translate-y-8',
    },
  ];

  const currentStage = stages[activeStage - 1];

  return (
    <section
      id="journey"
      className="relative w-full bg-[#F7F7FB] text-[#171321] section-vertical-space border-t border-b border-[#E3DDEA] overflow-hidden isolate select-none"
    >
      {/* ── 1. Official React Bits Particles Background Integration ── */}
      <div className="absolute inset-0 z-0 pointer-events-auto" style={{ width: '100%', height: '100%' }}>
        <Particles
          particleColors={['#5227FF', '#8000FF', '#A78BFA']}
          particleCount={180}
          particleSpread={12}
          speed={0.08}
          particleBaseSize={85}
          glow={0.4}
          twinkle={0.25}
          moveParticlesOnHover
          hoverEffect="parallax"
          lightMode={true}
        />
      </div>

      {/* ── 2. Foreground Progression Content ── */}
      <div className="elite-container relative z-10 pointer-events-none">
        
        {/* Section Heading: Space Grotesk Editorial */}
        <div className="max-w-3xl mb-14 pointer-events-auto">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 mb-4 px-3.5 py-1.5 rounded-full bg-white border border-[#E3DDEA] text-xs font-mono font-bold tracking-widest text-[#8000FF] uppercase shadow-sm">
            <Layers size={13} className="text-[#8000FF]" />
            <span>THE ELITE PROGRESSION SYSTEM</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#75B83B]" />
          </div>

          {/* Main Headline */}
          <h2 className="text-4xl sm:text-6xl lg:text-7xl font-black text-[#171321] tracking-tight leading-[0.96] mb-5 font-heading">
            <span className="block">FIVE LEVELS.</span>
            <span className="block text-[#8000FF]">ONE CONTINUOUS JOURNEY.</span>
          </h2>

          {/* Supporting Copy */}
          <p className="text-base sm:text-lg text-[#625B70] font-normal leading-relaxed mb-4 max-w-2xl">
            Growth is not a destination. It is a continuous process of learning, contribution and responsibility.
            Every stage represents an opportunity to demonstrate progress, take on greater responsibility and create meaningful impact.
          </p>

          {/* Decorative Progress Indicator */}
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-[#938CA0] uppercase">
            <span>LEVEL 01</span>
            <ArrowRight size={13} className="text-[#8000FF]" />
            <span>LEVEL 05</span>
          </div>
        </div>

        {/* ── 3. Five Progression Stages: Interactive Dimensional Journey (Desktop) ── */}
        <div className="hidden lg:block mb-12 pointer-events-auto">
          {/* Connecting Pathway Line */}
          <div className="relative">
            <div className="absolute top-1/2 left-10 right-10 -translate-y-1/2 h-1 bg-[#E3DDEA] rounded-full z-0">
              <div
                className="h-full bg-[#8000FF] rounded-full transition-all duration-500 ease-out shadow-[0_0_12px_rgba(128,0,255,0.4)]"
                style={{ width: `${((activeStage - 1) / (stages.length - 1)) * 100}%` }}
              />
            </div>

            {/* Five Dimensional Stage Platforms */}
            <div className="relative z-10 grid grid-cols-5 gap-4 items-end pt-12 pb-4">
              {stages.map((stage) => {
                const isActive = activeStage === stage.level;
                const isPassed = activeStage > stage.level;

                return (
                  <button
                    key={stage.level}
                    type="button"
                    onClick={() => setActiveStage(stage.level)}
                    className={`group relative text-left p-5 rounded-[22px] transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                      isActive
                        ? 'bg-white border-2 border-[#8000FF] shadow-2xl shadow-[#8000FF]/20 -translate-y-4 ring-4 ring-[#8000FF]/10'
                        : 'bg-white/90 backdrop-blur-sm border-2 border-[#E3DDEA] hover:border-[#8000FF]/50 hover:-translate-y-2 hover:bg-white shadow-md'
                    }`}
                  >
                    {/* Top Connecting Node Pip */}
                    <div className="flex items-center justify-between mb-4">
                      <span
                        className={`font-mono text-xs font-black px-2.5 py-1 rounded-md transition-colors ${
                          isActive
                            ? 'bg-[#8000FF] text-white shadow-sm'
                            : isPassed
                            ? 'bg-[#F0EDF7] text-[#8000FF]'
                            : 'bg-[#F0EDF7] text-[#625B70]'
                        }`}
                      >
                        {stage.number}
                      </span>

                      {/* Milestone Checkmark or Active Indicator */}
                      {isPassed ? (
                        <CheckCircle2 size={16} className="text-[#75B83B]" />
                      ) : isActive ? (
                        <span className="w-2.5 h-2.5 rounded-full bg-[#8000FF] animate-ping" />
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-[#D8D6E0] group-hover:bg-[#A78BFA] transition-colors" />
                      )}
                    </div>

                    {/* Stage Name */}
                    <div className="font-heading text-lg font-black text-[#171321] tracking-tight mb-1">
                      {stage.name}
                    </div>

                    {/* Short Description */}
                    <p className="text-xs text-[#625B70] leading-snug line-clamp-2 mb-3">
                      {stage.shortDesc}
                    </p>

                    {/* Platform Base Indicator */}
                    <div className="pt-2.5 border-t border-[#E3DDEA] flex items-center justify-between text-[10px] font-mono">
                      <span className={isActive ? 'text-[#8000FF] font-bold' : 'text-[#938CA0]'}>
                        {isActive ? 'ACTIVE STAGE' : `STAGE 0${stage.level}`}
                      </span>
                      <ChevronRight size={12} className={isActive ? 'text-[#8000FF] translate-x-0.5' : 'text-[#938CA0]'} />
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

            return (
              <button
                key={stage.level}
                type="button"
                onClick={() => setActiveStage(stage.level)}
                className={`w-full text-left p-4 sm:p-5 rounded-[20px] border-2 transition-all flex items-start gap-4 ${
                  isActive
                    ? 'bg-white border-[#8000FF] shadow-lg shadow-[#8000FF]/15'
                    : 'bg-white/90 border-[#E3DDEA]'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center font-mono font-black text-sm shrink-0 ${
                    isActive
                      ? 'bg-[#8000FF] text-white shadow'
                      : isPassed
                      ? 'bg-[#F0EDF7] text-[#8000FF]'
                      : 'bg-[#F0EDF7] text-[#625B70]'
                  }`}
                >
                  {stage.number}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-heading font-black text-base text-[#171321]">
                      {stage.name}
                    </span>
                    <span className="text-[10px] font-mono text-[#8000FF] font-bold uppercase">
                      {isActive ? '● SELECTED' : isPassed ? 'VERIFIED' : `STAGE 0${stage.level}`}
                    </span>
                  </div>
                  <p className="text-xs text-[#625B70] leading-relaxed">
                    {stage.shortDesc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* ── 4. Progression Detail Panel & Neon Leadership Emblem Showcase ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white border-2 border-[#E3DDEA] rounded-[28px] p-6 sm:p-10 shadow-xl pointer-events-auto">
          
          {/* Left Column: Stage Detail Breakdown */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3.5 py-1 bg-[#F0EDF7] border border-[#A78BFA] rounded-full text-xs font-mono font-bold text-[#8000FF] uppercase shadow-sm">
                STAGE {currentStage.number} // {currentStage.name}
              </span>
              <span className="font-mono text-xs text-[#938CA0] uppercase tracking-wider font-semibold">
                STAGE 0{activeStage} OF 05
              </span>
            </div>

            <h3 className="text-2xl sm:text-4xl font-black text-[#171321] mb-2 font-heading">
              Level 0{activeStage} — <span className="text-[#8000FF]">{currentStage.name}</span>
            </h3>

            <div className="text-sm sm:text-base font-bold text-[#5227FF] mb-4">
              Focus: {currentStage.focus}
            </div>

            <p className="text-sm sm:text-base text-[#625B70] leading-relaxed mb-6 font-sans">
              {currentStage.description}
            </p>

            {/* Stage Milestones Checklist */}
            <div className="mb-6 p-5 bg-[#F7F7FB] border border-[#E3DDEA] rounded-[18px]">
              <span className="text-xs font-mono text-[#171321] uppercase font-bold tracking-wider block mb-3">
                Key Development Themes &amp; Milestones:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {currentStage.milestones.map((m, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-[#625B70]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#8000FF] shrink-0" />
                    <span>{m}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Telemetry Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 bg-[#F0EDF7] border border-[#E3DDEA] rounded-xl">
                <span className="text-[10px] font-mono text-[#938CA0] uppercase block mb-0.5">Progression Gate</span>
                <span className="text-xs font-bold text-[#171321]">{currentStage.gate}</span>
              </div>
              <div className="p-3.5 bg-[#F0EDF7] border border-[#E3DDEA] rounded-xl">
                <span className="text-[10px] font-mono text-[#938CA0] uppercase block mb-0.5">Authorized Route</span>
                <span className="text-xs font-mono font-bold text-[#8000FF]">{currentStage.dashboardRoute}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Official Neon Thread Elite Leadership Program Emblem Card */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStage}
                initial={{ opacity: 0, scale: 0.94, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.94, y: -12 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                onClick={() => setShowLightbox(true)}
                className="group relative w-full cursor-pointer bg-[#08070C] border-2 border-[#8000FF] rounded-[24px] p-4 sm:p-5 shadow-2xl shadow-[#8000FF]/25 transition-all duration-300 hover:scale-[1.02] hover:shadow-[#8000FF]/40 overflow-hidden"
              >
                {/* Header Tag */}
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#292132]">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#75B83B] animate-pulse" />
                    <span className="font-mono text-[10px] font-bold text-white tracking-widest uppercase">
                      OFFICIAL EMBLEM // {currentStage.name}
                    </span>
                  </div>
                  <Maximize2 size={13} className="text-[#A78BFA] group-hover:scale-125 transition-transform" />
                </div>

                {/* The Neon Image */}
                <div className="relative rounded-[16px] overflow-hidden bg-black flex items-center justify-center">
                  <img
                    src="/neon-thread-elite.jpg"
                    alt="Neon Thread Elite Leadership Program Emblem"
                    className="w-full h-auto object-contain transition-transform duration-500 group-hover:scale-105"
                  />
                  
                  {/* Subtle Ambient Violet Glow */}
                  <div className="absolute inset-0 bg-[#8000FF]/10 pointer-events-none group-hover:bg-transparent transition-colors" />
                </div>

                {/* Footer Tag */}
                <div className="mt-3 pt-2 border-t border-[#292132] flex items-center justify-between text-[10px] font-mono text-[#898293]">
                  <span className="text-[#BD7AFF] font-bold">CLICK TO EXPAND FULLSCREEN</span>
                  <span className="text-white font-mono">STAGE 0{activeStage} // AUTHENTICATED</span>
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
              className="relative max-w-4xl w-full bg-[#08070C] border-2 border-[#8000FF] rounded-[28px] p-4 sm:p-6 shadow-[0_0_60px_rgba(128,0,255,0.5)] flex flex-col items-center"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setShowLightbox(false)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#15111F] border border-[#8000FF] text-white flex items-center justify-center hover:bg-[#8000FF] transition-colors"
                aria-label="Close modal"
              >
                <X size={18} />
              </button>

              <div className="w-full mb-3 pb-2 border-b border-[#292132] flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#75B83B]" />
                <span className="font-mono text-xs font-bold text-white tracking-widest uppercase">
                  THREAD ELITE STUDENT LEADERSHIP PROGRAM // {currentStage.name}
                </span>
              </div>

              <img
                src="/neon-thread-elite.jpg"
                alt="Neon Thread Elite Leadership Program"
                className="max-h-[75vh] w-auto object-contain rounded-xl shadow-2xl"
              />

              <div className="w-full mt-4 pt-3 border-t border-[#292132] flex items-center justify-between text-xs font-mono text-[#898293]">
                <span className="text-[#BD7AFF] font-bold">OFFICIAL NEON EMBLEM</span>
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
