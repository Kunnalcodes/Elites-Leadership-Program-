import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, ArrowUpRight } from 'lucide-react';

export function FinalConversion() {
  return (
    <section id="final-cta" className="w-full bg-[#100D17] section-vertical-space border-t border-[#292132] relative overflow-hidden">
      <div className="elite-container text-center flex flex-col items-center">
        {/* Central Shield Graphic Icon */}
        <div className="w-20 h-20 rounded-2xl bg-[#15111F] border border-[#8000FF] flex items-center justify-center text-[#8CCF42] mb-8 shadow-2xl shadow-[#8000FF]/30">
          <Shield className="w-10 h-10" />
        </div>

        {/* Section Headline */}
        <h2 className="text-4xl sm:text-6xl md:text-7xl font-bold text-white tracking-tight leading-[0.98] max-w-4xl mb-6">
          YOUR POTENTIAL IS THE BEGINNING. <br />
          <span className="text-[#8000FF]">YOUR ACTIONS DEFINE THE IMPACT.</span>
        </h2>

        {/* Supporting Copy */}
        <p className="text-base sm:text-lg text-[#C5BED0] max-w-2xl font-normal leading-relaxed mb-10">
          Step into an experience where technical learning meets decisive action, accountability becomes leadership, 
          and every meaningful contribution propels you forward.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Link
            to="/apply"
            className="btn-elite-primary w-full sm:w-auto flex items-center justify-center gap-2.5"
          >
            Explore Thread Elite Application
            <ArrowUpRight className="w-4 h-4" />
          </Link>
          <Link
            to="/login"
            className="btn-elite-secondary w-full sm:w-auto flex items-center justify-center gap-2.5"
          >
            <Lock className="w-4 h-4 text-[#8000FF]" />
            Existing Elite? Login
          </Link>
        </div>
      </div>
    </section>
  );
}
