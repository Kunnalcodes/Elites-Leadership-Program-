import React from 'react';

export function CircuitEnvironment() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
      {/* 1. Deep Atmospheric Radial Backlight */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at 50% 36%, rgba(128, 0, 255, 0.24) 0%, rgba(75, 19, 133, 0.14) 38%, rgba(8, 7, 12, 0.95) 75%, #08070C 100%)',
        }}
      />

      {/* 2. Cyber Chamber Perspective Wall Grid */}
      <div 
        className="absolute inset-0 opacity-15"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(128, 0, 255, 0.3) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(128, 0, 255, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(ellipse at 50% 40%, black 20%, transparent 70%)',
          WebkitMaskImage: 'radial-gradient(ellipse at 50% 40%, black 20%, transparent 70%)',
        }}
      />

      {/* 3. Perspective Architectural Lines converging to center dais */}
      <svg
        className="absolute inset-0 w-full h-full opacity-30"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        viewBox="0 0 1440 900"
      >
        <defs>
          <linearGradient id="lineV" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#8000FF" stopOpacity="0" />
            <stop offset="50%" stopColor="#BD7AFF" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#8000FF" stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id="lineGreen" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8CCF42" stopOpacity="0" />
            <stop offset="50%" stopColor="#8CCF42" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#8CCF42" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Diagonal Perspective Rays from Vanishing Point (720, 360) */}
        <line x1="0" y1="0" x2="620" y2="330" stroke="url(#lineV)" strokeWidth="1.2" strokeDasharray="6 4" />
        <line x1="1440" y1="0" x2="820" y2="330" stroke="url(#lineV)" strokeWidth="1.2" strokeDasharray="6 4" />
        <line x1="0" y1="900" x2="560" y2="480" stroke="url(#lineV)" strokeWidth="1.5" />
        <line x1="1440" y1="900" x2="880" y2="480" stroke="url(#lineV)" strokeWidth="1.5" />

        {/* Diagonal Neon Struts */}
        <line x1="120" y1="0" x2="260" y2="900" stroke="#8000FF" strokeWidth="1" strokeOpacity="0.25" />
        <line x1="1320" y1="0" x2="1180" y2="900" stroke="#8000FF" strokeWidth="1" strokeOpacity="0.25" />
        <line x1="320" y1="0" x2="440" y2="900" stroke="#8000FF" strokeWidth="0.8" strokeOpacity="0.2" />
        <line x1="1120" y1="0" x2="1000" y2="900" stroke="#8000FF" strokeWidth="0.8" strokeOpacity="0.2" />

        {/* Horizontal Perimeter Laser Guide */}
        <line x1="0" y1="380" x2="1440" y2="380" stroke="url(#lineGreen)" strokeWidth="1" strokeOpacity="0.4" strokeDasharray="8 6" />
      </svg>

      {/* 4. Circuit Board Traces on Flanks with Pulsing Nodes */}
      <svg
        className="absolute left-0 top-0 w-72 md:w-96 h-full opacity-40 hidden sm:block"
        viewBox="0 0 300 800"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M 20 80 L 100 80 L 140 120 L 140 260 L 180 300 L 180 480 L 120 540 L 40 540"
          stroke="#8000FF"
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />
        <path
          d="M 10 200 L 80 200 L 110 230 L 110 380 L 60 430"
          stroke="#BD7AFF"
          strokeWidth="1.2"
        />
        <circle cx="100" cy="80" r="3" fill="#8CCF42" className="animate-pulse" />
        <circle cx="140" cy="120" r="3.5" fill="#8000FF" />
        <circle cx="180" cy="300" r="3" fill="#8CCF42" className="animate-pulse" />
        <circle cx="110" cy="230" r="2.5" fill="#BD7AFF" />
      </svg>

      <svg
        className="absolute right-0 top-0 w-72 md:w-96 h-full opacity-40 hidden sm:block"
        viewBox="0 0 300 800"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M 280 80 L 200 80 L 160 120 L 160 260 L 120 300 L 120 480 L 180 540 L 260 540"
          stroke="#8000FF"
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />
        <path
          d="M 290 200 L 220 200 L 190 230 L 190 380 L 240 430"
          stroke="#BD7AFF"
          strokeWidth="1.2"
        />
        <circle cx="200" cy="80" r="3" fill="#8CCF42" className="animate-pulse" />
        <circle cx="160" cy="120" r="3.5" fill="#8000FF" />
        <circle cx="120" cy="300" r="3" fill="#8CCF42" className="animate-pulse" />
        <circle cx="190" cy="230" r="2.5" fill="#BD7AFF" />
      </svg>

      {/* 5. Volumetric Central Light Halo */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] rounded-full bg-[#8000FF]/15 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] rounded-full bg-[#8CCF42]/10 blur-[80px] pointer-events-none" />
    </div>
  );
}

export default CircuitEnvironment;
