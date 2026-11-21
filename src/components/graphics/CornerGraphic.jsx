import React from 'react';

export const CornerGraphic = ({ size = 24, className = '', color = 'var(--thread-green)' }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path d="M2 22V2H22" stroke={color} strokeWidth="2" strokeLinecap="square" />
      <rect x="2" y="2" width="4" height="4" fill={color} />
    </svg>
  );
};
