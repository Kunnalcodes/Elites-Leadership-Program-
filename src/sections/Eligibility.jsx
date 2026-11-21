import React from 'react';
import { SectionHeading } from '../components/SectionHeading';
import { ELIGIBILITY_BLOCKS } from '../data/programData';
import * as Icons from 'lucide-react';

export const Eligibility = () => {
  return (
    <section className="section-padding bg-white border-b-2 border-[#111111] relative">
      <div className="container">
        <SectionHeading 
          eyebrow="ADMISSIONS & REQUIREMENTS"
          title="ELIGIBILITY & SELECTION"
          subtitle="Clear answers for prospective candidates seeking entry into the Thread Elite Student Leadership Directorate."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {ELIGIBILITY_BLOCKS.map((block) => {
            const IconComp = Icons[block.icon] || Icons.HelpCircle;

            return (
              <div 
                key={block.question}
                className="p-8 rounded-2xl bg-[#F8F8F4] border-2 border-[#111111] shadow-[4px_4px_0px_#111111] flex flex-col justify-between hover:shadow-[6px_6px_0px_#111111] transition-all"
              >
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[#8BAF00] border-2 border-[#111111] text-[#111111] flex items-center justify-center shadow-[2px_2px_0px_#111111]">
                      <IconComp size={20} className="stroke-[2.5]" />
                    </div>
                    <h3 className="font-display text-2xl font-bold text-[#111111]">
                      {block.question}
                    </h3>
                  </div>
                  <p className="text-base text-[#5D5D59] font-medium leading-relaxed">
                    {block.answer}
                  </p>
                </div>
                
                <div className="mt-6 pt-4 border-t-2 border-gray-200 flex items-center justify-between">
                  <span className="badge-pill bg-white text-[#111111]">
                    THREAD ELITE CRITERIA
                  </span>
                  <span className="w-2.5 h-2.5 rounded-full bg-[#8BAF00] border border-[#111111]" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
