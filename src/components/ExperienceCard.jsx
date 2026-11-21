import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export const ExperienceCard = ({ module }) => {
  const { title, category, description, highlight, size } = module;

  const colSpanClass = size === 'large' 
    ? 'col-span-1 md:col-span-8' 
    : size === 'full' 
    ? 'col-span-1 md:col-span-12' 
    : 'col-span-1 md:col-span-4';

  return (
    <div className={`group relative bg-white border-2 border-[#111111] rounded-2xl p-8 shadow-[4px_4px_0px_#111111] hover:shadow-[7px_7px_0px_#111111] hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between ${colSpanClass}`}>
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="badge-pill bg-[#8BAF00] text-[#111111]">
            {category}
          </span>
          <div className="w-8 h-8 rounded-full border-2 border-[#111111] bg-white flex items-center justify-center text-[#111111] group-hover:bg-[#8BAF00] transition-colors shadow-[2px_2px_0px_#111111]">
            <ArrowUpRight size={16} className="stroke-[2.5]" />
          </div>
        </div>

        <h3 className="font-display text-2xl md:text-3xl font-bold text-[#111111] mb-3">
          {title}
        </h3>
        <p className="text-sm md:text-base text-[#5D5D59] leading-relaxed font-medium max-w-2xl">
          {description}
        </p>
      </div>

      <div className="mt-8 pt-4 border-t-2 border-gray-100 flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-[#4B238A] border border-[#111111]" />
        <span className="font-tech text-xs font-bold text-[#111111] tracking-wider uppercase">
          {highlight}
        </span>
      </div>
    </div>
  );
};
