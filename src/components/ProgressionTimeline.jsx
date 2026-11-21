import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, ChevronRight } from 'lucide-react';

export const ProgressionTimeline = ({ stages }) => {
  const [activeStageIndex, setActiveStageIndex] = useState(0);

  return (
    <div className="w-full">
      {/* Desktop Horizontal Progression Path */}
      <div className="hidden lg:block relative py-12">
        {/* Drawn Horizontal Connecting Path Line */}
        <div className="absolute top-1/2 left-8 right-8 h-1 bg-[rgba(17,17,17,0.10)] -translate-y-1/2 rounded-full" />
        <motion.div 
          className="absolute top-1/2 left-8 h-1 bg-[#8BAF00] -translate-y-1/2 rounded-full transition-all duration-500"
          style={{ width: `${(activeStageIndex / (stages.length - 1)) * 90}%` }}
        />

        {/* Milestone Nodes */}
        <div className="relative z-10 grid grid-cols-5 gap-4">
          {stages.map((stg, idx) => {
            const isActive = idx === activeStageIndex;
            const isPassed = idx < activeStageIndex;

            return (
              <div 
                key={stg.number}
                onClick={() => setActiveStageIndex(idx)}
                className="cursor-pointer group flex flex-col items-center text-center"
              >
                {/* Node Circle Button */}
                <div 
                  className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isActive 
                      ? 'bg-[#11110F] border-2 border-[#8BAF00] text-[#8BAF00] scale-110 shadow-lg' 
                      : isPassed 
                      ? 'bg-[#8BAF00] text-[#11110F] border-2 border-[#8BAF00]' 
                      : 'bg-white border-2 border-[rgba(17,17,17,0.15)] text-gray-400 group-hover:border-[#8BAF00]'
                  }`}
                >
                  {isActive ? (
                    <Shield size={22} className="animate-pulse" />
                  ) : (
                    <span className="font-mono text-sm font-bold">{stg.number}</span>
                  )}
                </div>

                {/* Stage Title */}
                <h4 className={`font-display text-xl font-bold mt-4 transition-colors ${
                  isActive ? 'text-[#4B238A]' : 'text-[#111111]'
                }`}>
                  {stg.stage}
                </h4>

                <span className="font-mono text-[10px] tracking-widest text-[#5D5D59] uppercase mt-1">
                  {stg.level}
                </span>

                {/* Active Indicator Pulse */}
                {isActive && (
                  <motion.div 
                    layoutId="activeIndicator"
                    className="mt-2 w-2 h-2 rounded-full bg-[#8BAF00]" 
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Stage Detail Panel (Desktop & Mobile) */}
      <div className="mt-8 bg-white border border-[rgba(17,17,17,0.12)] rounded-xl p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-100 pb-6 mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="font-mono text-xs font-bold text-[#8BAF00] px-2.5 py-1 bg-[#8BAF00]/10 rounded-sm">
                STAGE {stages[activeStageIndex].number} / {stages.length}
              </span>
              <span className="font-tech text-xs font-semibold uppercase tracking-wider text-[#4B238A]">
                {stages[activeStageIndex].status}
              </span>
            </div>
            <h3 className="font-display text-4xl font-bold text-[#111111]">
              {stages[activeStageIndex].stage} PROGRESSION
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              disabled={activeStageIndex === 0}
              onClick={() => setActiveStageIndex(prev => Math.max(0, prev - 1))}
              className="px-4 py-2 text-xs font-mono font-bold uppercase rounded border border-gray-200 disabled:opacity-30 hover:bg-gray-50"
            >
              PREV
            </button>
            <button
              disabled={activeStageIndex === stages.length - 1}
              onClick={() => setActiveStageIndex(prev => Math.min(stages.length - 1, prev + 1))}
              className="px-4 py-2 text-xs font-mono font-bold uppercase rounded bg-[#8BAF00] text-[#11110F] disabled:opacity-30 hover:bg-[#A6D300]"
            >
              NEXT
            </button>
          </div>
        </div>

        <p className="text-base sm:text-lg text-[#5D5D59] leading-relaxed max-w-3xl">
          {stages[activeStageIndex].description}
        </p>
      </div>

      {/* Mobile Vertical Sequence Timeline */}
      <div className="lg:hidden mt-8 flex flex-col gap-4">
        {stages.map((stg, idx) => (
          <div
            key={stg.number}
            onClick={() => setActiveStageIndex(idx)}
            className={`cursor-pointer p-5 rounded-lg border flex items-center justify-between transition-colors ${
              idx === activeStageIndex
                ? 'bg-[#11110F] text-white border-[#8BAF00]'
                : 'bg-white text-[#111111] border-gray-200'
            }`}
          >
            <div className="flex items-center gap-4">
              <span className={`w-8 h-8 rounded-full flex items-center justify-center font-mono text-xs font-bold ${
                idx === activeStageIndex ? 'bg-[#8BAF00] text-[#11110F]' : 'bg-gray-100 text-gray-700'
              }`}>
                {stg.number}
              </span>
              <div>
                <h4 className="font-display text-lg font-bold">{stg.stage}</h4>
                <p className="text-xs text-gray-400 font-mono">{stg.level}</p>
              </div>
            </div>
            <ChevronRight size={18} className={idx === activeStageIndex ? 'text-[#8BAF00]' : 'text-gray-400'} />
          </div>
        ))}
      </div>
    </div>
  );
};
