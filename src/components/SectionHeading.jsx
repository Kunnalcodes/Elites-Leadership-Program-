import React from 'react';
import { Eyebrow } from './Eyebrow';

export const SectionHeading = ({ 
  eyebrow, 
  title, 
  subtitle, 
  dark = false, 
  align = 'left',
  className = '' 
}) => {
  const alignClass = align === 'center' ? 'text-center items-center' : 'text-left items-start';

  return (
    <div className={`flex flex-col ${alignClass} ${className} mb-12`}>
      {eyebrow && <Eyebrow dark={dark}>{eyebrow}</Eyebrow>}
      <div className="relative inline-block">
        <h2 
          className={`text-4xl sm:text-5xl md:text-6xl font-black tracking-normal leading-[1.05] ${
            dark ? 'graffiti-heading-dark' : 'graffiti-heading'
          }`}
          style={{ color: dark ? '#FFFFFF' : '#111111' }}
        >
          {title}
        </h2>
        {/* Subtle street spray underline */}
        <div 
          className={`h-1.5 w-24 rounded-full mt-2 border border-[#111111] shadow-[1.5px_1.5px_0px_#111111] ${
            dark ? 'bg-[#8BAF00]' : 'bg-[#8BAF00]'
          } ${align === 'center' ? 'mx-auto' : ''}`}
        />
      </div>
      {subtitle && (
        <p 
          className="mt-4 text-lg md:text-xl max-w-2xl font-normal leading-relaxed"
          style={{ color: dark ? 'rgba(255,255,255,0.75)' : 'var(--muted)' }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
};
