import React from 'react';

export const ImageFrame = ({ 
  src, 
  alt = 'Thread Elite Program Photography', 
  className = '',
  aspect = 'aspect-4/3',
  badgeText,
  accentColor = 'var(--thread-green)'
}) => {
  return (
    <div className={`relative group overflow-hidden rounded-lg border border-[rgba(17,17,17,0.12)] bg-[#ECECE6] ${className}`}>
      {/* Background Subtle Tech Grid Motif */}
      <div className="absolute inset-0 bg-tech-pattern opacity-10" />
      
      {/* Image with smooth zoom transition */}
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${aspect}`}
        loading="lazy"
        onError={(e) => {
          // Fallback SVG graphic if image URL is unreachable
          e.target.style.display = 'none';
        }}
      />

      {/* Fallback Editorial Placeholder Block when image is missing or loading */}
      <div className="absolute inset-0 flex flex-col justify-between p-6 pointer-events-none opacity-90 mix-blend-multiply bg-[#15111F]/40">
        <div className="flex justify-between items-start">
          <div className="w-8 h-8 border-t-2 border-l-2 border-[#8000FF]" />
          {badgeText && (
            <span className="text-[11px] font-mono tracking-widest uppercase px-3 py-1 bg-[#100D17] text-[#8CCF42] font-bold rounded-sm shadow-sm">
              {badgeText}
            </span>
          )}
        </div>
        <div className="flex justify-between items-end">
          <div className="w-4 h-4 rounded-full bg-[#8CCF42]" />
          <div className="w-8 h-8 border-b-2 border-r-2 border-[#8000FF]" />
        </div>
      </div>

      {/* Solid Corner Accent */}
      <div 
        className="absolute top-0 right-0 w-3 h-3 bg-[#8000FF] pointer-events-none"
      />
    </div>
  );
};
