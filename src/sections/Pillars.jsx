import React from 'react';
import { SectionHeading } from '../components/SectionHeading';
import { PillarCard } from '../components/PillarCard';
import { PILLARS } from '../data/programData';

export const Pillars = () => {
  return (
    <section className="section-padding bg-[#F8F8F4] border-t border-b border-[rgba(17,17,17,0.08)] relative">
      <div className="container">
        <SectionHeading 
          eyebrow="THREAD ELITE / 02"
          title="THE FOUR PILLARS"
          subtitle="A comprehensive framework designed to cultivate technical excellence, strategic judgment, and peer mentorship."
        />

        {/* 4 Pillars Grid: Desktop 4 columns, Mobile 1 column */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {PILLARS.map((pillar) => (
            <PillarCard key={pillar.number} pillar={pillar} />
          ))}
        </div>
      </div>
    </section>
  );
};
