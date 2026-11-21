import React from 'react';
import { BookOpen, Terminal, Users, TrendingUp, Sparkles } from 'lucide-react';
import { LeaderPlatformCanvas } from '../components/LeaderPlatformCanvas';

export function WhyAreWeHere() {
  const pillars = [
    {
      number: '01',
      title: 'LEARN',
      description:
        'Gain knowledge through expert-led sessions, workshops, continuous learning, and structured professional opportunities.',
      bgColor: 'bg-[#8000FF]',
      borderColor: 'border-[#BD7AFF]',
      textColor: 'text-white',
      descColor: 'text-[#E8D4FF]',
      icon: BookOpen,
      iconColor: 'text-white',
    },
    {
      number: '02',
      title: 'EXECUTE',
      description:
        'Apply your learning by tackling real-world challenges, engineering solutions, organizing initiatives, and solving complex problems.',
      bgColor: 'bg-[#15111F]',
      borderColor: 'border-[#38264F]',
      textColor: 'text-white',
      descColor: 'text-[#C5BED0]',
      icon: Terminal,
      iconColor: 'text-[#8CCF42]',
    },
    {
      number: '03',
      title: 'LEAD',
      description:
        'Take proactive initiative, mentor peers, collaborate across multidisciplinary teams, and grow into an ethical, responsible leader.',
      bgColor: 'bg-[#4B1385]',
      borderColor: 'border-[#8000FF]',
      textColor: 'text-white',
      descColor: 'text-[#E0CCF8]',
      icon: Users,
      iconColor: 'text-white',
    },
    {
      number: '04',
      title: 'GROW',
      description:
        'Develop continuously through consistent effort, constructive evaluator feedback, and progressive promotion milestones.',
      bgColor: 'bg-[#100D17]',
      borderColor: 'border-[#292132]',
      textColor: 'text-white',
      descColor: 'text-[#898293]',
      icon: TrendingUp,
      iconColor: 'text-[#BD7AFF]',
    },
  ];

  return (
    <section id="program" className="w-full bg-[#08070C] section-vertical-space border-t border-[#1D1729]">
      <div className="elite-container">
        {/* Section Header Tag */}
        <div className="flex items-center gap-2 mb-6 text-xs font-mono tracking-widest text-[#8CCF42] uppercase">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Foundational Mission // 02</span>
        </div>

        {/* 3-Column Editorial Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          {/* Column 1: Oversized Headline */}
          <div className="lg:col-span-4 flex flex-col justify-between">
            <div>
              <h2 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white tracking-tighter leading-[0.92] mb-8">
                WHY ARE <br />
                WE HERE <br />
                <span className="text-[#8000FF]">TODAY?</span>
              </h2>
              <p className="text-base sm:text-lg text-[#C5BED0] leading-relaxed mb-6">
                Most programs offer passive lectures. Thread Elite was engineered for those who refuse to sit on the sidelines. 
                We are here to cultivate leaders who execute, take accountability, and turn vision into tangible security and leadership outcomes.
              </p>
            </div>

            <div className="hidden lg:block p-6 bg-[#100D17] border border-[#292132] rounded-[20px]">
              <div className="text-xs font-mono text-[#898293] uppercase tracking-wider mb-2">Program Mandate</div>
              <div className="text-sm font-semibold text-white">One leader. Many impacts.</div>
            </div>
          </div>

          {/* Column 2: 3D Leader Dimensional Visual */}
          <div className="lg:col-span-4 flex items-center justify-center">
            <LeaderPlatformCanvas />
          </div>

          {/* Column 3: Four Stacked Solid Pillars */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            {pillars.map((p) => {
              const IconComponent = p.icon;
              return (
                <div
                  key={p.number}
                  className={`p-6 sm:p-7 rounded-[24px] border ${p.bgColor} ${p.borderColor} transition-all duration-200 hover:-translate-y-1 hover:shadow-xl`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono tracking-widest uppercase opacity-75">
                      PILLAR {p.number}
                    </span>
                    <IconComponent className={`w-5 h-5 ${p.iconColor}`} />
                  </div>
                  <h3 className={`text-xl font-bold tracking-tight mb-2 ${p.textColor}`}>
                    {p.title}
                  </h3>
                  <p className={`text-sm leading-relaxed ${p.descColor}`}>
                    {p.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
