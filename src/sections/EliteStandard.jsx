import React, { useState } from 'react';
import { SectionHeading } from '../components/SectionHeading';
import { StandardItem } from '../components/StandardItem';
import { ELITE_STANDARDS } from '../data/programData';
import { ShieldCheck } from 'lucide-react';

export const EliteStandard = () => {
  const [activeStandardIndex, setActiveStandardIndex] = useState(0);

  return (
    <section className="section-padding bg-[#11110F] text-white relative overflow-hidden">
      {/* Background Tech Grid */}
      <div className="absolute inset-0 bg-tech-pattern-dark opacity-10 pointer-events-none" />

      <div className="container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Sticky Header Panel */}
          <div className="lg:col-span-5 lg:sticky lg:top-28">
            <SectionHeading 
              eyebrow="INSTITUTIONAL CODE"
              title="THE ELITE STANDARD"
              subtitle="Five foundational expectations that govern every Thread Elite cohort, ensuring absolute ethical clarity, rigor, and collective advancement."
              dark={true}
              className="mb-8"
            />

            {/* Active Standard Summary Highlight Box */}
            <div className="p-6 rounded-xl bg-white/5 border border-white/10 hidden lg:block">
              <div className="flex items-center gap-3 mb-2">
                <ShieldCheck className="text-[#8BAF00]" size={20} />
                <span className="font-mono text-xs font-bold text-[#A6D300] uppercase tracking-wider">
                  ACTIVE PRINCIPLE 0{activeStandardIndex + 1} / 05
                </span>
              </div>
              <h4 className="font-display text-2xl font-bold text-white mb-1">
                {ELITE_STANDARDS[activeStandardIndex].title}
              </h4>
              <p className="text-xs font-mono text-gray-400">
                {ELITE_STANDARDS[activeStandardIndex].accentCode}
              </p>
            </div>
          </div>

          {/* Right Column: Principles Selector List */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {ELITE_STANDARDS.map((std, idx) => (
              <StandardItem 
                key={std.number}
                standard={std}
                isActive={idx === activeStandardIndex}
                onClick={() => setActiveStandardIndex(idx)}
              />
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};
