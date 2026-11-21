import React from 'react';

export const Eyebrow = ({ children, dark = false, className = '' }) => {
  return (
    <div 
      className={`inline-flex items-center gap-2 px-3 py-1 mb-3.5 rounded-md border-2 border-[#111111] font-mono text-[11px] font-black uppercase tracking-wider ${
        dark 
          ? 'bg-[#111111] text-[#8BAF00] shadow-[2.5px_2.5px_0px_#8BAF00]' 
          : 'bg-[#8BAF00] text-[#111111] shadow-[2.5px_2.5px_0px_#111111]'
      } ${className}`}
    >
      <span className="w-2 h-2 rounded-full bg-[#111111] border border-white/60 animate-pulse" />
      <span>{children}</span>
    </div>
  );
};
