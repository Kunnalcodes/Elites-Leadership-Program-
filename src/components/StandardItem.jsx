import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const StandardItem = ({ standard, isActive, onClick }) => {
  const { number, title, tagline, description, accentCode } = standard;

  return (
    <div 
      onClick={onClick}
      className={`cursor-pointer p-6 sm:p-8 rounded-2xl border-2 border-[#111111] transition-all duration-200 ${
        isActive 
          ? 'bg-[#11110F] text-white shadow-[6px_6px_0px_#8BAF00] translate-x-1' 
          : 'bg-white text-[#111111] shadow-[4px_4px_0px_#111111] hover:bg-[#F8F8F4] hover:shadow-[6px_6px_0px_#111111]'
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className={`badge-pill ${isActive ? 'bg-[#8BAF00] text-[#11110F]' : 'bg-gray-100 text-[#111111]'}`}>
            STANDARD {number}
          </span>
          <span className={`font-mono text-xs font-bold tracking-wider ${isActive ? 'text-[#A6D300]' : 'text-[#4B238A]'}`}>
            {accentCode}
          </span>
        </div>
        {isActive && <ShieldCheck className="text-[#8BAF00]" size={24} />}
      </div>

      <h3 className={`font-display text-2xl sm:text-3xl font-bold mb-1 ${isActive ? 'text-white' : 'text-[#111111]'}`}>
        {title}
      </h3>
      <p className={`font-tech text-xs font-bold uppercase tracking-wider mb-3 ${
        isActive ? 'text-[#A6D300]' : 'text-[#4B238A]'
      }`}>
        {tagline}
      </p>

      <p className={`text-sm leading-relaxed font-medium ${isActive ? 'text-gray-300' : 'text-[#5D5D59]'}`}>
        {description}
      </p>
    </div>
  );
};
