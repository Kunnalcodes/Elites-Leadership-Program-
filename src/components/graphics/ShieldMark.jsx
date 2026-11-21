import React from 'react';

export const ShieldMark = ({ width = 48, height = 54, className = '', color = 'var(--thread-green)' }) => {
  return (
    <svg 
      width={width} 
      height={height} 
      viewBox="0 0 48 54" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Outer Shield Boundary */}
      <path 
        d="M24 2L44 10V26C44 38.5 35.5 48.2 24 52C12.5 48.2 4 38.5 4 26V10L24 2Z" 
        stroke={color} 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
      {/* Inner Technical Grid Lines */}
      <path 
        d="M24 8V46" 
        stroke={color} 
        strokeWidth="1" 
        strokeDasharray="2 2" 
        opacity="0.6" 
      />
      <path 
        d="M10 24H38" 
        stroke={color} 
        strokeWidth="1" 
        strokeDasharray="2 2" 
        opacity="0.6" 
      />
      {/* Center Core Node */}
      <circle cx="24" cy="24" r="4" fill="var(--thread-purple)" stroke={color} strokeWidth="1.5" />
      {/* Corner Nodes */}
      <rect x="22" y="10" width="4" height="4" fill={color} />
      <rect x="22" y="34" width="4" height="4" fill={color} />
    </svg>
  );
};
