import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Target, Users, Award, Lock, Sparkles, Activity } from 'lucide-react';

export function FloatingSidePanels() {
  const rightPillars = [
    {
      title: 'LEADERSHIP',
      subtitle: 'Executive Direction',
      icon: Target,
      highlight: '#8000FF',
    },
    {
      title: 'MENTORSHIP',
      subtitle: '1:1 Practitioner Guild',
      icon: Users,
      highlight: '#8CCF42',
    },
    {
      title: 'ACHIEVEMENT',
      subtitle: 'Vetted Accreditation',
      icon: Award,
      highlight: '#BD7AFF',
    },
  ];

  return (
    <>
      {/* LEFT SIDE PANEL: Thread Security Directorate & Governance Telemetry */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.9, delay: 0.3, ease: 'easeOut' }}
        className="hidden xl:flex flex-col gap-3.5 absolute left-8 top-1/2 -translate-y-1/2 z-20 w-64 pointer-events-auto"
      >
        {/* Main Branding Card */}
        <div className="p-4 rounded-xl bg-[#15111F]/80 backdrop-blur-md border border-[#38264F] hover:border-[#8000FF] transition-all shadow-[0_0_20px_rgba(128,0,255,0.15)] group">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-lg bg-[#100D17] border border-[#8CCF42] flex items-center justify-center text-[#8CCF42] shadow-[0_0_10px_rgba(140,207,66,0.3)]">
              <Shield size={18} />
            </div>
            <div>
              <span className="font-mono text-[9px] text-[#8CCF42] font-bold tracking-widest uppercase block">
                PARENT AUTHORITY
              </span>
              <h3 className="font-display text-sm font-bold text-white tracking-wide">
                THREAD SECURITY
              </h3>
            </div>
          </div>

          <p className="text-[11px] text-[#C5BED0] font-sans leading-relaxed">
            Defense-grade student leadership directorate and practical cyber systems operations.
          </p>

          <div className="mt-3 pt-2.5 border-t border-[#292132] flex items-center justify-between font-mono text-[10px]">
            <span className="text-[#898293] flex items-center gap-1.5">
              <Activity size={12} className="text-[#8CCF42] animate-pulse" />
              SYSTEM ACTIVE
            </span>
            <span className="text-[#BD7AFF] font-bold">L5_SECURE</span>
          </div>
        </div>

        {/* Access Specification Micro Card */}
        <div className="px-3.5 py-2.5 rounded-lg bg-[#100D17]/80 backdrop-blur-sm border border-[#292132] flex items-center justify-between font-mono text-[10px]">
          <span className="text-[#898293]">ACCESS TIER:</span>
          <span className="text-white font-bold tracking-wider">ELITE_COMMAND</span>
        </div>
      </motion.div>

      {/* RIGHT SIDE PANEL: 3 Floating Holographic Mission Cards */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.9, delay: 0.4, ease: 'easeOut' }}
        className="hidden xl:flex flex-col gap-3 absolute right-8 top-1/2 -translate-y-1/2 z-20 w-64 pointer-events-auto"
      >
        <div className="flex items-center gap-2 mb-1 px-1">
          <Sparkles size={12} className="text-[#8CCF42]" />
          <span className="font-mono text-[10px] text-[#898293] font-bold tracking-widest uppercase">
            HOLOGRAPHIC TIERS
          </span>
        </div>

        {rightPillars.map((pillar, idx) => {
          const Icon = pillar.icon;
          return (
            <motion.div
              key={pillar.title}
              whileHover={{ x: -4, borderColor: '#8000FF' }}
              transition={{ duration: 0.2 }}
              className="p-3.5 rounded-xl bg-[#15111F]/80 backdrop-blur-md border border-[#38264F] flex items-center gap-3 shadow-[0_0_15px_rgba(128,0,255,0.12)] cursor-default"
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border border-current"
                style={{
                  backgroundColor: `${pillar.highlight}18`,
                  color: pillar.highlight,
                }}
              >
                <Icon size={16} />
              </div>

              <div className="flex flex-col overflow-hidden">
                <span className="font-display text-xs font-bold text-white tracking-wide">
                  {pillar.title}
                </span>
                <span className="font-mono text-[10px] text-[#898293] truncate">
                  {pillar.subtitle}
                </span>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </>
  );
}

export default FloatingSidePanels;
