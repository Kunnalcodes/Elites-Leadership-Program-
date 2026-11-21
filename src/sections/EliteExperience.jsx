import React, { useState } from 'react';
import { Compass, ShieldCheck, Hammer, MessageSquare, LineChart, FastForward } from 'lucide-react';
import GhostFibers from './GhostFibers';

export function EliteExperience() {
  const [selectedStep, setSelectedStep] = useState(0);

  const steps = [
    {
      id: 'learn',
      title: 'LEARN',
      subtitle: 'Knowledge Acquisition',
      summary: 'Develop your technical perspective and leadership acumen.',
      details:
        'Engage in executive masterclasses, vulnerability threat modeling workshops, and foundational curriculum designed by industry practitioners.',
      icon: Compass,
      color: '#8000FF',
    },
    {
      id: 'challenge',
      title: 'CHALLENGE',
      subtitle: 'Structured Assessments',
      summary: 'Take on multi-format assignments and rigorous evaluations.',
      details:
        'Tackle authentic case studies, zero-trust penetration scenarios, and architectural reviews evaluated against strict professional rubrics.',
      icon: ShieldCheck,
      color: '#8CCF42',
    },
    {
      id: 'build',
      title: 'BUILD',
      subtitle: 'Project & Portfolio',
      summary: 'Ship verified deliverables across 23 standardized task formats.',
      details:
        'Produce real security artifacts, tooling, research briefs, and codebases committed to live repositories with immutable cryptographic receipts.',
      icon: Hammer,
      color: '#A020F0',
    },
    {
      id: 'connect',
      title: 'CONNECT',
      subtitle: '1:1 Mentorship',
      summary: 'Collaborate with dedicated senior threat intelligence mentors.',
      details:
        'Direct inquiry threads, real-time feedback loops, code audits, and strategic career governance tailored to your individual leadership trajectory.',
      icon: MessageSquare,
      color: '#BD7AFF',
    },
    {
      id: 'reflect',
      title: 'REFLECT',
      subtitle: 'Constructive Calibration',
      summary: 'Review detailed feedback and calibrate your trajectory.',
      details:
        'Inspect criterion-level scoring, evaluator notes, and performance metrics to identify gaps and accelerate your professional velocity.',
      icon: LineChart,
      color: '#75D69A',
    },
    {
      id: 'advance',
      title: 'ADVANCE',
      subtitle: 'Recognized Progression',
      summary: 'Demonstrate measurable growth and advance to higher levels.',
      details:
        'Earn validated XP, unlock subsequent promotion tiers, gain elevated program responsibilities, and prepare for executive alumni transitions.',
      icon: FastForward,
      color: '#FFFFFF',
    },
  ];

  return (
    <section id="experience" className="relative w-full bg-[#08070C] section-vertical-space border-t border-[#1D1729] overflow-hidden">
      {/* GhostFibers Dynamic WebGL Background */}
      <div className="absolute inset-0 w-full h-full pointer-events-auto opacity-75 z-0">
        <div style={{ width: '100%', height: '100%', minHeight: '600px', position: 'relative' }}>
          <GhostFibers
            glowColor="#8b5cf6"
            layers={3}
            twist={1.2}
            threads={72}
            fiberStyle="dots"
            depthOfField={0.85}
            hoverEffect="focus"
            intro={true}
            mouseInteraction={true}
          />
        </div>
      </div>

      <div className="elite-container relative z-10">
        {/* Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 mb-4 text-xs font-mono tracking-widest text-[#8CCF42] uppercase">
            <span>The One-Year Arc // 04</span>
          </div>
          <h2 className="text-4xl sm:text-6xl font-bold text-white tracking-tight leading-[1.02] mb-6">
            A YEAR THAT <br />
            <span className="text-[#8000FF]">MOVES YOU FORWARD.</span>
          </h2>
          <p className="text-base sm:text-lg text-[#C5BED0] font-normal leading-relaxed">
            The Thread Elite lifecycle is a coherent, continuous progression. From orientation to graduation, 
            each milestone builds upon the last to forge genuine leadership capability.
          </p>
        </div>

        {/* Interactive Journey Milestones (Desktop Horizontal & Mobile Stacked) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-10">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isSelected = selectedStep === idx;
            return (
              <button
                key={step.id}
                onClick={() => setSelectedStep(idx)}
                className={`p-5 rounded-[16px] text-left transition-all duration-200 border cursor-pointer ${
                  isSelected
                    ? 'bg-[#1D1729]/90 backdrop-blur-sm border-[#8000FF] shadow-lg shadow-[#8000FF]/20 -translate-y-1'
                    : 'bg-[#15111F]/90 backdrop-blur-sm border-[#292132] hover:border-[#38264F]'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-xs text-[#898293]">0{idx + 1}</span>
                  <Icon
                    className="w-4 h-4"
                    style={{ color: isSelected ? '#8000FF' : '#898293' }}
                  />
                </div>
                <div className="font-heading text-sm font-bold text-white mb-1">
                  {step.title}
                </div>
                <div className="text-[11px] text-[#898293] truncate">
                  {step.subtitle}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Milestone Detail Card */}
        <div className="bg-[#15111F]/90 backdrop-blur-sm border border-[#38264F] rounded-[24px] p-8 md:p-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 bg-[#100D17] border border-[#292132] rounded-full text-xs font-mono text-[#BD7AFF] uppercase">
              Phase 0{selectedStep + 1} // {steps[selectedStep].title}
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
              {steps[selectedStep].summary}
            </h3>
            <p className="text-sm md:text-base text-[#C5BED0] leading-relaxed">
              {steps[selectedStep].details}
            </p>
          </div>

          <div className="flex flex-col gap-2 p-6 bg-[#100D17] border border-[#292132] rounded-[16px] min-w-[220px]">
            <span className="text-[11px] font-mono text-[#898293] uppercase">Milestone Focus</span>
            <span className="text-sm font-bold text-white">{steps[selectedStep].subtitle}</span>
            <div className="w-full bg-[#1D1729] h-1.5 rounded-full mt-3 overflow-hidden">
              <div
                className="h-full bg-[#8000FF]"
                style={{ width: `${((selectedStep + 1) / 6) * 100}%` }}
              />
            </div>
            <span className="text-[10px] font-mono text-[#898293] text-right mt-1">
              Step {selectedStep + 1} of 6
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default EliteExperience;
