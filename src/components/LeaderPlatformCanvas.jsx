import React from 'react';
import { Shield, Sparkles } from 'lucide-react';

export function LeaderPlatformCanvas() {
  return (
    <div
      className="group w-full h-full min-h-[520px] md:min-h-[640px] bg-[#08070C] border border-[#38264F] hover:border-[#8000FF] transition-colors duration-500 rounded-[28px] relative overflow-hidden flex flex-col items-center justify-between p-3.5 shadow-2xl"
      aria-label="Archetype Elite Leader Dimensional Stage 01"
    >
      {/* Top Telemetry Header Overlay */}
      <div className="w-full flex items-center justify-between px-3 py-2 z-20 pointer-events-none">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#8CCF42] animate-pulse" />
          <span className="font-mono text-[11px] font-bold text-white tracking-widest uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
            ARCHETYPE // ELITE LEADER
          </span>
        </div>
        <span className="px-2.5 py-0.5 rounded-full bg-[#15111F]/80 backdrop-blur-md border border-[#8000FF]/50 font-mono text-[10px] font-bold text-[#BD7AFF] tracking-wider uppercase">
          OFFICIAL ARTWORK
        </span>
      </div>

      {/* Main Artwork Container with Depth & Subtle Ambient Glow */}
      <div className="relative w-full flex-1 rounded-[22px] overflow-hidden flex items-center justify-center my-1">
        {/* Subtle Ambient Backing Glow */}
        <div className="absolute inset-0 bg-[#8000FF]/15 blur-2xl pointer-events-none opacity-40 group-hover:opacity-70 transition-opacity duration-700" />

        {/* High-Resolution Hero Archetype Poster */}
        <img
          src="/elite-leader-archetype.jpg"
          alt="Thread Elite Leader Archetype - Dimensional Stage 01"
          className="w-full h-full object-cover object-center rounded-[20px] transition-transform duration-700 ease-out group-hover:scale-[1.03] select-none filter drop-shadow-[0_15px_35px_rgba(0,0,0,0.9)]"
          loading="eager"
        />

        {/* Cyber Tech Corner Ticks */}
        <span className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-[#8CCF42] pointer-events-none" />
        <span className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-[#8CCF42] pointer-events-none" />
        <span className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-[#8000FF] pointer-events-none" />
        <span className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-[#8000FF] pointer-events-none" />
      </div>

      {/* Bottom Telemetry Overlay */}
      <div className="w-full flex items-center justify-between px-3 py-2 z-20 pointer-events-none">
        <span className="font-mono text-[10px] text-[#898293] tracking-widest uppercase flex items-center gap-1.5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
          <Shield size={12} className="text-[#8000FF]" />
          ONE LEADER. MANY IMPACTS.
        </span>
        <span className="font-mono text-[11px] font-bold text-[#BD7AFF] tracking-widest uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
          DIMENSIONAL STAGE 01
        </span>
      </div>
    </div>
  );
}

export default LeaderPlatformCanvas;
