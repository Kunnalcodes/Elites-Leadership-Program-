import React from 'react';
import { Shield, ArrowUpRight, CheckCircle2 } from 'lucide-react';

export function ThreadSecurityConnection() {
  const points = [
    'Engineered by active cybersecurity practitioners & threat researchers',
    'Rooted in real-world defensive architectures, offensive security & vulnerability research',
    'Direct gateway to specialized security workgroups & industry mentors',
    'Focus on tangible execution, accountability, and ethical responsibility',
  ];

  return (
    <section id="governance" className="w-full bg-[#100D17] section-vertical-space border-t border-[#292132]">
      <div className="elite-container">
        <div className="bg-[#15111F] border border-[#38264F] rounded-[32px] p-8 sm:p-12 lg:p-16 flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Left Content */}
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 mb-4 px-3.5 py-1.5 bg-[#100D17] border border-[#292132] rounded-full text-xs font-mono text-[#8CCF42] uppercase">
              <Shield className="w-3.5 h-3.5" />
              <span>Parent Organization // Threat Intelligence</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight leading-[1.05] mb-6">
              BACKED BY THREAD SECURITY. <br />
              <span className="text-[#8000FF]">BUILT FOR THE NEXT GENERATION.</span>
            </h2>

            <p className="text-base text-[#C5BED0] leading-relaxed mb-8">
              Thread Elite is the dedicated student leadership initiative operated by Thread Security. 
              We bridge the gap between academic theory and high-stakes cybersecurity execution, 
              providing motivated students with the environment, mentorship, and tooling to become impactful leaders.
            </p>

            <div className="flex flex-col gap-3 mb-8">
              {points.map((pt, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-[#C5BED0]">
                  <CheckCircle2 className="w-4 h-4 text-[#8CCF42] shrink-0" />
                  <span>{pt}</span>
                </div>
              ))}
            </div>

            <a
              href="https://threadsecurity.in"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-heading font-semibold text-white bg-[#100D17] hover:bg-[#1D1729] px-6 py-3 border border-[#38264F] hover:border-[#8000FF] rounded-md transition-all duration-200"
            >
              Learn More About Thread Security
              <ArrowUpRight className="w-4 h-4 text-[#8CCF42]" />
            </a>
          </div>

          {/* Right Emblem Showcase */}
          <div className="w-full lg:w-80 h-80 rounded-[28px] bg-[#100D17] border border-[#38264F] flex flex-col items-center justify-center p-8 text-center shrink-0">
            <div className="w-20 h-20 rounded-2xl bg-[#15111F] border border-[#8000FF] flex items-center justify-center text-[#8CCF42] mb-6 shadow-xl shadow-[#8000FF]/20">
              <Shield className="w-10 h-10" />
            </div>
            <span className="font-heading text-xl font-bold text-white tracking-tight mb-1">
              THREAD SECURITY
            </span>
            <span className="text-xs font-mono text-[#898293] uppercase tracking-wider mb-4">
              Defensive & Strategic Research
            </span>
            <div className="w-full py-2 bg-[#1D1729] rounded border border-[#292132] text-[11px] font-mono text-[#8CCF42]">
              PROGRAM PATRON // 2026
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
