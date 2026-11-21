import React from 'react';
import { Eyebrow } from '../components/Eyebrow';
import { ShieldMark } from '../components/graphics/ShieldMark';
import { TSE_NOTE } from '../data/programData';

export const TSEMessage = () => {
  return (
    <section className="section-padding bg-[#F8F8F4] border-t border-b border-[rgba(17,17,17,0.08)] relative overflow-hidden">
      <div className="container relative z-10 max-w-4xl">
        <div className="text-center flex flex-col items-center">
          <ShieldMark width={44} height={50} color="#4B238A" className="mb-6" />
          
          <Eyebrow dark={false} className="justify-center">
            {TSE_NOTE.eyebrow}
          </Eyebrow>

          <blockquote className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-[#111111] leading-tight my-8 italic">
            "{TSE_NOTE.quote}"
          </blockquote>

          <div className="w-12 h-1 bg-[#8BAF00] my-4 rounded-full" />

          <div className="font-tech text-sm font-bold text-[#4B238A] uppercase tracking-wider">
            {TSE_NOTE.author}
          </div>
          <div className="font-mono text-xs text-[#5D5D59] uppercase tracking-widest mt-1">
            {TSE_NOTE.title}
          </div>
        </div>
      </div>
    </section>
  );
};
