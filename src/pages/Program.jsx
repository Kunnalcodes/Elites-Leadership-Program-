import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, BookOpen, Terminal, Users, TrendingUp, ArrowRight, Layers, Award } from 'lucide-react';
import { Button } from '../components/Button';
import { ProgressionSection } from '../sections/ProgressionSection';
import { TaskEcosystem } from '../sections/TaskEcosystem';

export function Program() {
  const pillars = [
    {
      title: 'LEARN',
      tagline: 'Continuous Knowledge',
      desc: 'Gain deep systems architecture, defensive engineering, and strategic governance knowledge through masterclasses and workshops.',
      color: '#8000FF',
    },
    {
      title: 'EXECUTE',
      tagline: 'Tangible Output',
      desc: 'Deliver measurable, audited contributions across 23 standardized task formats under strict deadlines.',
      color: '#A020F0',
    },
    {
      title: 'LEAD',
      tagline: 'Ownership & Initiative',
      desc: 'Organize research workgroups, direct cohort challenges, and mentor junior Elites with ethical responsibility.',
      color: '#4B1385',
    },
    {
      title: 'GROW',
      tagline: 'Recognized Advancement',
      desc: 'Progress through five vetted promotion tiers, earning verified XP and executive readiness accreditation.',
      color: '#BD7AFF',
    },
  ];

  return (
    <main className="w-full bg-[#08070C] text-white pt-28 pb-20">
      {/* Program Header */}
      <section className="section-vertical-space border-b border-[#292132]">
        <div className="elite-container">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#15111F] border border-[#38264F] mb-6">
              <Shield size={14} className="text-[#8CCF42]" />
              <span className="font-mono text-xs font-bold text-[#8CCF42] tracking-widest uppercase">
                CURRICULUM & STRUCTURE
              </span>
            </div>
            <h1 className="font-display text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-6">
              PROGRAM <span className="text-[#8000FF]">ARCHITECTURE</span>
            </h1>
            <p className="text-lg text-[#C5BED0] font-sans leading-relaxed">
              Explore the four pillars, leadership methodology, standards, and stage-by-stage progression model of Thread Elite.
            </p>
          </div>
        </div>
      </section>

      {/* 4 Pillars Grid */}
      <section className="section-vertical-space border-b border-[#292132]">
        <div className="elite-container">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.map((p) => (
              <div
                key={p.title}
                className="bg-[#100D17] border border-[#38264F] rounded-xl p-6 transition-all hover:border-[#8000FF]"
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center font-mono font-bold text-white text-sm mb-4"
                  style={{ backgroundColor: p.color }}
                >
                  {p.title[0]}
                </div>
                <span className="font-mono text-[11px] font-bold text-[#898293] uppercase tracking-wider block mb-1">
                  {p.tagline}
                </span>
                <h3 className="font-display text-2xl font-bold text-white mb-2">{p.title}</h3>
                <p className="text-xs text-[#C5BED0] font-sans leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5-Stage Progression Section */}
      <ProgressionSection />

      {/* Task Ecosystem Section */}
      <TaskEcosystem />

      {/* Bottom CTA */}
      <section className="section-vertical-space border-t border-[#292132]">
        <div className="elite-container max-w-3xl text-center">
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white mb-4">
            START YOUR <span className="text-[#8CCF42]">TRAJECTORY</span>
          </h2>
          <p className="text-[#C5BED0] text-sm sm:text-base mb-8 font-sans">
            Review the standards and submit your candidacy for the upcoming cohort.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button to="/apply" variant="primary">
              APPLY TO THREAD ELITE
            </Button>
            <Button to="/login" variant="secondary">
              ELITE LOGIN
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Program;
