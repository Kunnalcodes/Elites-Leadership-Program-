import React from 'react';
import { Users, MessagesSquare, Compass, Shield } from 'lucide-react';
import MicroSlats from './MicroSlats';

export function CommunitySection() {
  const pillars = [
    {
      title: '1:1 MENTORSHIP',
      tagline: 'Direct guidance from active security leaders.',
      description:
        'Every Elite is paired with an assigned mentor. Engage through dedicated 1:1 inquiry threads, receive code-level feedback, and navigate career milestones with senior guidance.',
      icon: Compass,
      borderColor: 'border-[#8000FF]',
    },
    {
      title: 'PEER COLLABORATION',
      tagline: 'Cross-functional cohorts executing united missions.',
      description:
        'Participate in multi-tier security research teams. Collaborate with peers across defensive engineering, reverse engineering, vulnerability disclosure, and strategic leadership.',
      icon: MessagesSquare,
      borderColor: 'border-[#BD7AFF]',
    },
    {
      title: 'ALUMNI ECOSYSTEM',
      tagline: 'A perpetual network spanning global industry leaders.',
      description:
        'Graduates of Thread Elite matriculate into the executive alumni council, advising incoming cohorts, reviewing capstone defenses, and expanding the Thread Security network.',
      icon: Users,
      borderColor: 'border-[#8CCF42]',
    },
  ];

  return (
    <section id="community" className="relative w-full bg-[#08070C] section-vertical-space border-t border-[#1D1729] overflow-hidden">
      {/* MicroSlats Dynamic WebGL Background */}
      <div className="absolute inset-0 w-full h-full pointer-events-auto opacity-70 z-0">
        <div style={{ width: '100%', height: '100%', minHeight: '600px', position: 'relative' }}>
          <MicroSlats
            preset="swell"
            color="#A855F7"
            glintColor="#ffffff"
            backgroundColor="#120f17"
            slatWidth={10}
            slatHeight={25}
            gap={3}
            roundness={0.75}
            interactive
            cursorStrength={1}
            cursorSize={40}
            swirl={0}
            trail={1.4}
            lean={0}
            intro
          />
        </div>
      </div>

      <div className="elite-container relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 mb-4 text-xs font-mono tracking-widest text-[#8CCF42] uppercase">
            <Users className="w-3.5 h-3.5" />
            <span>The Human Network // 08</span>
          </div>
          <h2 className="text-4xl sm:text-6xl font-bold text-white tracking-tight leading-[1.02] mb-6">
            LEADERSHIP IS <br />
            <span className="text-[#8000FF]">NEVER BUILT ALONE.</span>
          </h2>
          <p className="text-base sm:text-lg text-[#C5BED0] font-normal leading-relaxed">
            Technical mastery without collective alignment cannot create enduring change. 
            Thread Elite fosters an intentional culture of active mentorship, transparent dialogue, and shared responsibility.
          </p>
        </div>

        {/* 3 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {pillars.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className={`p-8 bg-[#15111F]/90 backdrop-blur-sm border ${item.borderColor} rounded-[24px] flex flex-col justify-between transition-all duration-200 hover:-translate-y-1.5`}
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#100D17] border border-[#292132] flex items-center justify-center text-white mb-6">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-bold text-white tracking-tight mb-2">
                    {item.title}
                  </h3>
                  <div className="text-xs font-semibold text-[#BD7AFF] mb-4">
                    {item.tagline}
                  </div>
                  <p className="text-sm text-[#C5BED0] leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-[#292132] text-xs font-mono text-[#898293] uppercase">
                  COHORT COLLABORATION // 0{idx + 1}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default CommunitySection;
