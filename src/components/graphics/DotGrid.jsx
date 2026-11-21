import React from 'react';

export const DotGrid = ({ rows = 6, cols = 12, className = '', opacity = 0.3 }) => {
  const dots = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      dots.push(
        <circle 
          key={`${r}-${c}`} 
          cx={12 + c * 16} 
          cy={12 + r * 16} 
          r="1.5" 
          fill="currentColor" 
        />
      );
    }
  }

  const width = cols * 16 + 8;
  const height = rows * 16 + 8;

  return (
    <svg 
      width={width} 
      height={height} 
      viewBox={`0 0 ${width} ${height}`} 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ opacity }}
    >
      {dots}
    </svg>
  );
};
