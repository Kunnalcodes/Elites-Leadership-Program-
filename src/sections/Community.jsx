import React from 'react';
import { SectionHeading } from '../components/SectionHeading';
import { ImageFrame } from '../components/ImageFrame';
import { Users, Globe, Network, Award } from 'lucide-react';

export const Community = () => {
  const stats = [
    { label: 'INDIVIDUAL', title: '01 / SELECTIVE ADMIT', desc: 'Rigorous peer screening focusing on high initiative and ethics.' },
    { label: 'COHORT', title: '02 / COLLABORATIVE UNITS', desc: 'Small-group security research labs and crisis briefings.' },
    { label: 'COMMUNITY', title: '03 / CAMPUS LEADERSHIP', desc: 'Directing student workshops and regional security initiatives.' },
    { label: 'NETWORK', title: '04 / ALUMNI & INDUSTRY', desc: 'Lifetime connection with senior CISOs and Thread leaders.' },
  ];

  return (
    <section className="section-padding bg-white relative">
      <div className="container">
        <SectionHeading 
          eyebrow="THREAD NETWORK"
          title="COHORT & COMMUNITY"
          subtitle="Thread Elite extends beyond individual learning. Members join a nationwide network of ambitious digital leaders."
        />

        {/* 4-Step Network Evolution Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((st, idx) => (
            <div key={st.label} className="p-6 rounded-xl bg-[#F8F8F4] border border-[rgba(17,17,17,0.10)] relative">
              <span className="font-mono text-xs font-bold text-[#8BAF00] uppercase block mb-2">
                {st.title}
              </span>
              <h4 className="font-display text-2xl font-bold text-[#111111] mb-2">
                {st.label}
              </h4>
              <p className="text-xs text-[#5D5D59] leading-relaxed">
                {st.desc}
              </p>
              <div className="w-full h-1 bg-gray-200 mt-6 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#4B238A] rounded-full" 
                  style={{ width: `${(idx + 1) * 25}%` }} 
                />
              </div>
            </div>
          ))}
        </div>

        {/* Group Photography Feature Banner */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#11110F] text-white rounded-2xl p-8 sm:p-12">
          <div className="lg:col-span-6">
            <span className="font-mono text-xs font-bold text-[#8BAF00] uppercase tracking-widest block mb-2">
              PEER LEADERSHIP IN ACTION
            </span>
            <h3 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">
              COLLABORATIVE SECURITY SUMMITS
            </h3>
            <p className="text-sm sm:text-base text-gray-300 leading-relaxed mb-6">
              Members organize student workshops, lead vulnerability disclosures, and brief senior stakeholders. Our cohort model fosters lifelong professional trust and shared ambition.
            </p>
            <div className="grid grid-cols-2 gap-4 text-xs font-mono text-[#A6D300]">
              <div className="flex items-center gap-2">
                <Users size={16} />
                <span>ACTIVE STUDENT COHORTS</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe size={16} />
                <span>INTER-COLLEGIATE NETWORK</span>
              </div>
              <div className="flex items-center gap-2">
                <Network size={16} />
                <span>PEER RESEARCH LABS</span>
              </div>
              <div className="flex items-center gap-2">
                <Award size={16} />
                <span>INSTITUTIONAL RECOGNITION</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <ImageFrame 
              src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1000&q=80"
              alt="Thread Elite Student Leadership Cohort"
              aspect="aspect-16/10"
              badgeText="COHORT_COLLABORATION"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
