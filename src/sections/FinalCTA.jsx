import React from 'react';
import { Button } from '../components/Button';
import { ShieldMark } from '../components/graphics/ShieldMark';

export const FinalCTA = () => {
  return (
    <section className="section-padding bg-[#11110F] text-white border-b-2 border-[#111111] relative overflow-hidden">
      <div className="container relative z-10 text-center flex flex-col items-center">
        
        <div className="w-16 h-16 rounded-2xl bg-[#8BAF00] border-2 border-white text-[#11110F] shadow-[4px_4px_0px_#FFFFFF] flex items-center justify-center mb-8">
          <ShieldMark width={40} height={46} color="#11110F" />
        </div>

        <span className="graffiti-tag-pill mb-4 text-xs">
          ⚡ ADMISSIONS NOW OPEN FOR 2026
        </span>

        <h2 className="graffiti-heading-dark text-5xl sm:text-6xl md:text-7xl font-black leading-tight mb-4 max-w-4xl">
          READY TO BECOME <span className="text-[#8BAF00]">THREAD ELITE?</span>
        </h2>

        <p className="font-graffiti text-2xl sm:text-3xl font-bold text-[#A6D300] tracking-wider uppercase mb-8">
          Learn. Lead. Impact.
        </p>

        <p className="text-base sm:text-lg text-gray-300 font-medium leading-relaxed max-w-2xl mb-10">
          Take your position among the next generation of digital security leaders. Complete your application to join the Thread Elite Student Directorate.
        </p>

        <Button to="/apply" variant="primary" className="h-14 px-10 text-base">
          APPLY TO THREAD ELITE
        </Button>

      </div>
    </section>
  );
};
