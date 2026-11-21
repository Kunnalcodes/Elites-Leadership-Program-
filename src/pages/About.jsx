import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Target, Award, Users, ArrowRight, CheckCircle2, ChevronRight } from 'lucide-react';
import { Button } from '../components/Button';

export function About() {
  const values = [
    {
      title: 'SELECTIVITY',
      tagline: 'Cohort Excellence',
      description: 'Admitting candidates committed to rigorous ethical integrity, proactive learning, and relentless discipline.',
      icon: Target,
      highlight: '#8000FF',
    },
    {
      title: 'ETHICAL CLARITY',
      tagline: 'Security Principles',
      description: 'Unwavering dedication to safeguarding critical systems, digital sovereignty, and ethical boundaries under all conditions.',
      icon: Shield,
      highlight: '#8CCF42',
    },
    {
      title: 'PEER STEWARDSHIP',
      tagline: 'Collaborative Growth',
      description: 'Elevating entire cohort capabilities through peer code reviews, active mentorship, and shared technical research.',
      icon: Users,
      highlight: '#8000FF',
    },
    {
      title: 'EXECUTIVE IMPACT',
      tagline: 'Leadership Stature',
      description: 'Articulating high-stakes technical vulnerability and operational risk with executive clarity to senior leadership.',
      icon: Award,
      highlight: '#8CCF42',
    },
  ];

  return (
    <main className="w-full bg-[#08070C] text-white pt-28 pb-20">
      {/* Header Section */}
      <section className="section-vertical-space border-b border-[#292132]">
        <div className="elite-container">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#15111F] border border-[#38264F] mb-6">
              <Shield size={14} className="text-[#8CCF42]" />
              <span className="font-mono text-xs font-bold text-[#8CCF42] tracking-widest uppercase">
                ABOUT THREAD ELITE
              </span>
            </div>
            <h1 className="font-display text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-6">
              DIGITAL LEADERSHIP & <span className="text-[#8000FF]">SECURITY GOVERNANCE</span>
            </h1>
            <p className="text-lg text-[#C5BED0] font-sans leading-relaxed">
              Thread Elite is the selective student leadership and professional development program operated by Thread Security, preparing high-caliber minds to govern the digital future through continuous learning, execution, leadership, and growth.
            </p>
          </div>
        </div>
      </section>

      {/* Purpose & Directorate Mission */}
      <section className="section-vertical-space border-b border-[#292132]">
        <div className="elite-container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-block px-3 py-1 rounded bg-[#8000FF]/20 border border-[#8000FF] font-mono text-xs font-bold text-[#BD7AFF] uppercase">
                MISSION & PURPOSE
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                BRIDGING TECHNICAL RIGOR WITH COMMAND READINESS
              </h2>
              <p className="text-base text-[#C5BED0] leading-relaxed font-sans">
                In an era dominated by escalating cyber threats and complex risk surfaces, technical competency alone is insufficient. Organizations require leaders who can synthesize risk, make sound ethical decisions under pressure, and brief executive boards.
              </p>
              <p className="text-base text-[#C5BED0] leading-relaxed font-sans">
                Thread Elite was established under Thread Security to identify, cultivate, and accredit outstanding student leaders who possess both analytical sharpness and human leadership drive.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#292132]">
                <div className="flex items-center gap-3">
                  <Shield size={20} className="text-[#8CCF42]" />
                  <span className="font-mono text-xs font-bold text-white uppercase">THREAD GOVERNANCE</span>
                </div>
                <div className="flex items-center gap-3">
                  <Award size={20} className="text-[#BD7AFF]" />
                  <span className="font-mono text-xs font-bold text-white uppercase">VERIFIED STANDING</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="bg-[#100D17] border border-[#38264F] rounded-2xl p-8 relative">
                <div className="font-mono text-xs font-bold text-[#8CCF42] uppercase tracking-wider mb-4 flex items-center gap-2">
                  <CheckCircle2 size={16} />
                  CORE OPERATING TENETS
                </div>
                <ul className="space-y-4 font-sans text-sm text-[#C5BED0]">
                  <li className="flex items-start gap-3">
                    <span className="text-[#8000FF] font-bold">01.</span>
                    <span>Direct immersion into cybersecurity paradigms without synthetic sandboxes.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#8000FF] font-bold">02.</span>
                    <span>Authoritative five-stage progression: Foundation, Catalyst, Pioneer, Apex, Legacy.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#8000FF] font-bold">03.</span>
                    <span>Double-entry XP ledger accounting for every verified deliverable and peer evaluation.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#8000FF] font-bold">04.</span>
                    <span>1:1 dedicated industry mentorship with practicing threat defense specialists.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Core Organizational Values */}
      <section className="section-vertical-space border-b border-[#292132]">
        <div className="elite-container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-4">
              ORGANIZATIONAL <span className="text-[#8000FF]">VALUES</span>
            </h2>
            <p className="text-sm sm:text-base text-[#C5BED0]">
              The bedrock standards expected of every Thread Elite participant and leader.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => {
              const Icon = v.icon;
              return (
                <div
                  key={v.title}
                  className="bg-[#100D17] border border-[#38264F] rounded-xl p-6 transition-all hover:border-[#8000FF]"
                >
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                    style={{ backgroundColor: `${v.highlight}20`, color: v.highlight }}
                  >
                    <Icon size={24} />
                  </div>
                  <span className="font-mono text-[11px] font-bold text-[#898293] uppercase tracking-wider block mb-1">
                    {v.tagline}
                  </span>
                  <h3 className="font-display text-xl font-bold text-white mb-2">{v.title}</h3>
                  <p className="text-xs text-[#C5BED0] font-sans leading-relaxed">{v.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="section-vertical-space">
        <div className="elite-container max-w-3xl text-center">
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white mb-4">
            JOIN THE NEXT <span className="text-[#8CCF42]">COHORT</span>
          </h2>
          <p className="text-[#C5BED0] text-sm sm:text-base mb-8 font-sans">
            Admissions are reviewed on a rolling cohort basis. Applications are open to collegiate students globally.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button to="/apply" variant="primary">
              APPLY TO THREAD ELITE
            </Button>
            <Button to="/login" variant="secondary">
              ELITE LOGIN
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}

export default About;
