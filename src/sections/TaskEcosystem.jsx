import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Clock, FileCode, Layers, ArrowRight, Lock } from 'lucide-react';

export function TaskEcosystem() {
  const lifecycle = [
    { step: '01', title: 'ASSIGNED', desc: 'Targeted to tier or cohort', color: 'text-[#898293]' },
    { step: '02', title: 'IN PROGRESS', desc: 'Active execution & testing', color: 'text-[#F59E0B]' },
    { step: '03', title: 'SUBMITTED', desc: 'Receipt reference confirmed', color: 'text-[#3B82F6]' },
    { step: '04', title: 'REVIEWED', desc: 'Rubric criteria evaluation', color: 'text-[#8000FF]' },
    { step: '05', title: 'RECOGNIZED', desc: 'XP ledger & standing updated', color: 'text-[#8CCF42]' },
  ];

  const sampleTasks = [
    {
      code: 'TASK-SEC-042',
      title: 'Zero-Trust Network Perimeter Audit',
      category: 'TECHNICAL ARCHITECTURE',
      difficulty: 'ADVANCED',
      maxXP: 250,
      status: 'UNDER_REVIEW',
      deadline: 'Nov 28, 2026',
    },
    {
      code: 'TASK-RES-019',
      title: 'Post-Quantum Cryptography Impact Assessment',
      category: 'RESEARCH & ANALYSIS',
      difficulty: 'EXPERT',
      maxXP: 300,
      status: 'ACTIVE',
      deadline: 'Dec 05, 2026',
    },
    {
      code: 'TASK-LDR-008',
      title: 'Foundation Peer Cohort Security Briefing',
      category: 'LEADERSHIP & MENTORSHIP',
      difficulty: 'INTERMEDIATE',
      maxXP: 180,
      status: 'PUBLISHED',
      deadline: 'Dec 12, 2026',
    },
  ];

  return (
    <section id="tasks" className="w-full bg-[#08070C] section-vertical-space border-t border-[#1D1729]">
      <div className="elite-container">
        {/* Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 mb-4 text-xs font-mono tracking-widest text-[#8CCF42] uppercase">
            <Layers className="w-3.5 h-3.5" />
            <span>The Execution Engine // 06</span>
          </div>
          <h2 className="text-4xl sm:text-6xl font-bold text-white tracking-tight leading-[1.02] mb-6">
            IDEAS ARE THE START. <br />
            <span className="text-[#8000FF]">EXECUTION MAKES THE DIFFERENCE.</span>
          </h2>
          <p className="text-base sm:text-lg text-[#C5BED0] font-normal leading-relaxed">
            Thread Elite does not rely on hypothetical assignments. Every task reflects real-world engineering, 
            threat modeling, policy formulation, and peer collaboration across 23 supported submission formats.
          </p>
        </div>

        {/* Task Lifecycle Flow */}
        <div className="mb-14 p-6 sm:p-8 bg-[#15111F] border border-[#38264F] rounded-[24px]">
          <div className="text-xs font-mono text-[#898293] uppercase tracking-wider mb-6">
            EXECUTION LIFECYCLE PIPELINE
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {lifecycle.map((item, idx) => (
              <div key={item.step} className="p-4 bg-[#100D17] border border-[#292132] rounded-[16px]">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs text-[#898293]">{item.step}</span>
                  <span className={`text-[11px] font-mono font-bold ${item.color}`}>●</span>
                </div>
                <div className="font-heading text-sm font-bold text-white mb-1">{item.title}</div>
                <div className="text-xs text-[#898293] leading-snug">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Operational Task Dashboard Preview (Marketing Preview) */}
        <div className="bg-[#100D17] border border-[#38264F] rounded-[24px] p-6 sm:p-8 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#292132] mb-6">
            <div>
              <span className="text-xs font-mono text-[#BD7AFF] tracking-wider uppercase block mb-1">
                DEMO PREVIEW // AUTHORITATIVE DATA CONTRACTS
              </span>
              <h3 className="text-xl font-bold text-white">Live Task Ecosystem Sample</h3>
            </div>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-xs font-heading font-semibold text-white bg-[#15111F] hover:bg-[#1D1729] px-4 py-2 border border-[#38264F] rounded-md transition-colors"
            >
              <Lock className="w-3.5 h-3.5 text-[#8000FF]" />
              View Your Assigned Tasks
            </Link>
          </div>

          <div className="flex flex-col gap-3">
            {sampleTasks.map((t) => (
              <div
                key={t.code}
                className="p-5 bg-[#15111F] border border-[#292132] hover:border-[#8000FF] rounded-[16px] flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-200"
              >
                <div className="flex items-start sm:items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#100D17] border border-[#38264F] flex items-center justify-center text-[#8000FF] shrink-0">
                    <FileCode className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs text-[#8CCF42]">{t.code}</span>
                      <span className="text-[10px] font-mono text-[#898293] uppercase px-2 py-0.5 bg-[#100D17] rounded border border-[#292132]">
                        {t.category}
                      </span>
                    </div>
                    <div className="font-heading text-base font-bold text-white">{t.title}</div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-left sm:text-right">
                    <div className="text-xs font-mono text-[#898293]">MAX VALUE</div>
                    <div className="text-sm font-bold text-[#8000FF]">+{t.maxXP} XP</div>
                  </div>
                  <div className="text-left sm:text-right">
                    <div className="text-xs font-mono text-[#898293]">DEADLINE</div>
                    <div className="text-xs text-white font-medium">{t.deadline}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
