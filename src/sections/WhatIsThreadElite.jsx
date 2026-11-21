import React, { useState } from 'react';
import { Eyebrow } from '../components/Eyebrow';
import { ShieldMark } from '../components/graphics/ShieldMark';
import { PIPELINE_STAGES } from '../data/programData';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export const WhatIsThreadElite = () => {
  const [activePipelineIndex, setActivePipelineIndex] = useState(2);

  return (
    <section className="section-padding bg-white border-b-2 border-[#111111] relative">
      <div className="container">
        {/* Split Layout Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-16">
          <div className="lg:col-span-5">
            <Eyebrow>CORE TRANSFORMATION</Eyebrow>
            <h2 className="graffiti-heading text-4xl sm:text-5xl lg:text-6xl font-black text-[#111111] leading-tight">
              WHAT IS <span className="text-[#8BAF00]">THREAD ELITE?</span>
            </h2>
            <div className="w-24 h-2 bg-[#8BAF00] border-2 border-[#111111] shadow-[2px_2px_0px_#111111] mt-6 rounded-full" />
          </div>
          
          <div className="lg:col-span-7">
            <p className="text-lg sm:text-xl text-[#111111] font-bold leading-relaxed mb-4">
              Thread Elite is the dedicated leadership accelerator for high-performing students associated with Thread Security Education.
            </p>
            <p className="text-base text-[#5D5D59] leading-relaxed font-medium">
              We bridge the gap between academic theory and high-stakes executive leadership, giving members direct exposure to real-world risk management, hands-on vulnerability analysis, peer mentorship, and institutional recognition.
            </p>
          </div>
        </div>

        {/* Theory -> Practice Tactical Pipeline Banner */}
        <div className="bg-[#11110F] text-white rounded-3xl p-8 sm:p-12 border-2 border-[#111111] shadow-[6px_6px_0px_#8BAF00] relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10 pb-6 border-b-2 border-white/10">
              <div>
                <span className="graffiti-tag-pill mb-2">
                  THEORY → PRACTICE METHODOLOGY
                </span>
                <h3 className="graffiti-heading-dark text-3xl sm:text-4xl font-black mt-2">
                  THE LEADERSHIP <span className="text-[#8BAF00]">PIPELINE</span>
                </h3>
              </div>
              <ShieldMark width={36} height={42} color="#8BAF00" />
            </div>

            {/* Desktop Pipeline Cards */}
            <div className="hidden md:grid grid-cols-5 gap-4">
              {PIPELINE_STAGES.map((stage, idx) => {
                const isActive = idx === activePipelineIndex;
                const isCompleted = idx < activePipelineIndex;

                return (
                  <div
                    key={stage.id}
                    onClick={() => setActivePipelineIndex(idx)}
                    className={`cursor-pointer p-5 rounded-2xl border-2 transition-all duration-200 flex flex-col justify-between h-48 ${
                      isActive 
                        ? 'bg-[#8BAF00] text-[#11110F] border-[#111111] shadow-[4px_4px_0px_#FFFFFF] scale-105' 
                        : isCompleted 
                        ? 'bg-white/10 text-white border-white/20 hover:bg-white/15' 
                        : 'bg-white/5 text-gray-400 border-white/10 hover:border-white/25'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`font-mono text-xs font-bold ${isActive ? 'text-[#11110F]' : 'text-[#8BAF00]'}`}>
                        0{idx + 1}
                      </span>
                      {isActive ? (
                        <CheckCircle2 size={18} className="text-[#11110F]" />
                      ) : (
                        <ArrowRight size={14} className="opacity-60" />
                      )}
                    </div>

                    <div>
                      <h4 className="font-display text-xl font-bold tracking-tight mb-1">
                        {stage.title}
                      </h4>
                      <p className={`text-[11px] font-mono font-bold leading-tight ${isActive ? 'text-[#35165F]' : 'text-gray-400'}`}>
                        {stage.label}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Stage Description Panel */}
            <div className="mt-8 pt-6 border-t-2 border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-[#8BAF00] animate-pulse border border-[#11110F]" />
                <span className="font-tech text-sm font-bold text-[#A6D300] uppercase tracking-wider">
                  ACTIVE PHASE: {PIPELINE_STAGES[activePipelineIndex].title}
                </span>
              </div>
              <p className="text-sm text-gray-300 font-medium max-w-xl">
                {PIPELINE_STAGES[activePipelineIndex].desc}
              </p>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
