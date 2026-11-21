import React from 'react';

export const TechGrid = ({ className = '', opacity = 0.05 }) => {
  return (
    <div 
      className={`absolute inset-0 pointer-events-none bg-tech-pattern ${className}`}
      style={{ opacity }}
    />
  );
};
