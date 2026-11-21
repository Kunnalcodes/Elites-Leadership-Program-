import React from 'react';
import { Target, Share2, Award, Zap, Shield, ArrowUpRight } from 'lucide-react';
import WebThreads from '../components/WebThreads';

export function Philosophy() {
  const principles = [
    {
      number: '01',
      title: 'OWNERSHIP',
      tagline: 'Take responsibility for your work, decisions and commitments.',
      description:
        'True leadership begins when you treat every assignment, architecture decision, and deadline as non-negotiable. At Thread Elite, candidates own their outcomes completely with zero excuses.',
      mandate: 'MANDATE // PERSONAL ACCOUNTABILITY',
      accentColor: '#8000FF',
      icon: Target,
    },
    {
      number: '02',
      title: 'COLLABORATION',
      tagline: 'Build with people, share knowledge and contribute to collective progress.',
      description:
        'Individual excellence is only the baseline. Exponential impact happens when you empower peers, mentor newer cohorts, and engineer security solutions that elevate the collective whole.',
      mandate: 'MANDATE // SHARED EXPONENTIAL PROGRESS',
      accentColor: '#BD7AFF',
      icon: Share2,
    },
    {
      number: '03',
      title: 'IMPACT',
      tagline: 'Turn ideas into outcomes that create value beyond yourself.',
      description:
        'The technology landscape does not lack theories—it lacks decisive execution. We measure leaders by tangible vulnerabilities mitigated, systems hardened, and verified value generated.',
      mandate: 'MANDATE // VERIFIED OUTCOMES',
      accentColor: '#8CCF42',
      icon: Award,
    },
  ];

  return (
    <section
      id="about"
      className="relative w-full bg-[#08070C] section-vertical-space border-t border-[#292132] overflow-hidden isolate select-none"
    >
      {/* ── 1. WebThreads Interactive Background Environment ── */}
      <div className="absolute inset-0 z-0 pointer-events-auto" style={{ width: '100%', height: '100%' }}>
        <WebThreads
          colors={['#5227FF', '#FF9FFC']}
          coreColor="#FFFFFF"
          threadCount={6}
          spread={0.18}
        />
      </div>

      {/* ── 2. Foreground Editorial Content ── */}
      <div className="elite-container relative z-10 pointer-events-none">
        
        {/* Section Header: Editorial Typography */}
        <div className="max-w-4xl mb-16 pointer-events-auto">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 mb-4 px-3.5 py-1 rounded-full bg-[#15111F]/80 backdrop-blur-md border border-[#38264F] text-[11px] font-mono tracking-widest text-[#BD7AFF] uppercase shadow-lg">
            <Zap size={11} className="text-[#8CCF42]" />
            <span>THE PHILOSOPHY // 03</span>
          </div>

          {/* Monumental Headline */}
          <h2 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[0.96] mb-6 font-heading">
            <span className="block drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)]">MORE THAN</span>
            <span className="block drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)]">PARTICIPATION.</span>
            <span className="block text-[#8000FF] drop-shadow-[0_0_40px_rgba(128,0,255,0.6)]">
              A COMMITMENT
            </span>
            <span className="block text-[#8000FF] drop-shadow-[0_0_40px_rgba(128,0,255,0.6)]">
              TO IMPACT.
            </span>
          </h2>

          {/* Supporting Copy */}
          <p className="text-base sm:text-xl text-[#C5BED0] font-normal leading-relaxed max-w-2xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
            Thread Elite is built around the belief that leadership is demonstrated through consistent action, 
            accountability and the ability to make a meaningful difference.
          </p>
        </div>

        {/* ── 3. Three Foundational Principles: Editorial Connected Layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {principles.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <div
                key={item.number}
                className="pointer-events-auto group relative bg-[#15111F]/90 backdrop-blur-md border border-[#38264F] hover:border-[#8000FF] rounded-[26px] p-7 sm:p-8 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 shadow-2xl"
              >
                {/* Tech Accent Corners */}
                <span className="absolute top-3 left-3 w-2.5 h-2.5 border-t border-l border-[#898293]/40 group-hover:border-[#8CCF42] transition-colors" />
                <span className="absolute bottom-3 right-3 w-2.5 h-2.5 border-b border-r border-[#898293]/40 group-hover:border-[#8000FF] transition-colors" />

                <div>
                  {/* Card Header: Big Number + Icon */}
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#292132]">
                    <div className="flex items-center gap-3">
                      <span className="font-heading text-4xl sm:text-5xl font-black text-[#38264F] group-hover:text-[#BD7AFF] transition-colors">
                        {item.number}
                      </span>
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.accentColor }} />
                    </div>

                    <div className="w-11 h-11 rounded-xl bg-[#100D17] border border-[#292132] group-hover:border-[#8000FF] flex items-center justify-center transition-colors">
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>
                  </div>

                  {/* Principle Title */}
                  <h3 className="font-heading text-2xl sm:text-3xl font-black text-white tracking-tight mb-2.5">
                    {item.title}
                  </h3>

                  {/* Principle Tagline */}
                  <div className="font-sans text-sm font-semibold text-[#BD7AFF] mb-4 leading-snug">
                    {item.tagline}
                  </div>

                  {/* Principle Narrative Description */}
                  <p className="text-xs sm:text-sm text-[#C5BED0] font-sans leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Card Footer Telemetry */}
                <div className="mt-8 pt-4 border-t border-[#292132] flex items-center justify-between text-[10px] font-mono text-[#898293]">
                  <span className="tracking-wider">{item.mandate}</span>
                  <span
                    className="w-2 h-2 rounded-full transition-transform duration-300 group-hover:scale-125"
                    style={{ backgroundColor: item.accentColor }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* ── 4. Connecting Footnote ── */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#898293] border-t border-[#1D1729] pt-6 pointer-events-auto">
          <span className="flex items-center gap-2 text-[#C5BED0]">
            <Shield size={13} className="text-[#8CCF42]" />
            ONE LEADER. MANY IMPACTS.
          </span>
          <span className="text-[#BD7AFF]">
            INTERCONNECTED LEADERSHIP ARCHITECTURE // WEB_THREADS_ONLINE
          </span>
        </div>

      </div>
    </section>
  );
}

export default Philosophy;
