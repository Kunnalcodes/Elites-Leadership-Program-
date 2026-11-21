import React from 'react';
import * as Icons from 'lucide-react';

export const PillarCard = ({ pillar }) => {
  const { number, title, subtitle, description, iconName } = pillar;
  const IconComponent = Icons[iconName] || Icons.Shield;

  return (
    <div className="group relative bg-white border-2 border-[#111111] rounded-2xl p-8 shadow-[4px_4px_0px_#111111] hover:shadow-[7px_7px_0px_#111111] hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between min-h-[320px]">
      {/* Large Watermark Number */}
      <span className="absolute -right-2 -bottom-6 font-display text-9xl font-bold text-[#111111]/5 group-hover:text-[#8BAF00]/15 transition-colors pointer-events-none select-none">
        {number}
      </span>

      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="w-12 h-12 rounded-xl bg-[#8BAF00] border-2 border-[#111111] shadow-[2px_2px_0px_#111111] flex items-center justify-center text-[#111111] group-hover:bg-[#A6D300]">
            <IconComponent size={24} className="stroke-[2.5]" />
          </div>
          <span className="badge-pill bg-[#4B238A] text-white border-2 border-[#111111]">
            PILLAR {number}
          </span>
        </div>

        <h3 className="font-display text-3xl font-bold text-[#111111] mb-1 group-hover:text-[#4B238A] transition-colors">
          {title}
        </h3>
        <p className="font-tech text-xs font-bold uppercase tracking-wider text-[#4B238A] mb-4">
          {subtitle}
        </p>
        <p className="text-sm text-[#5D5D59] leading-relaxed font-medium">
          {description}
        </p>
      </div>

      <div className="mt-8 pt-4 border-t-2 border-gray-100 flex items-center justify-between">
        <span className="font-mono text-[11px] font-bold text-[#111111] uppercase tracking-wider">
          THREAD ELITE MODULE
        </span>
        <span className="w-2.5 h-2.5 rounded-full bg-[#8BAF00] border border-[#111111]" />
      </div>
    </div>
  );
};
