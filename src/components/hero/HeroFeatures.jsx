import React from 'react';
import { motion } from 'framer-motion';

const FEATURES = [
  {
    titleLine1: 'Lightning-Fast',
    titleLine2: 'Robot Intelligence',
    description: 'Train, automate, and deploy intelligent robots with speed',
  },
  {
    titleLine1: 'Advanced AI &',
    titleLine2: 'Smart Automation',
    description: 'Customize behavior, vision, movement, and decision-making',
  },
  {
    titleLine1: 'Precision',
    titleLine2: 'Performance',
    description: 'Engineered for accuracy, reliability, and real-world tasks',
  },
];

export function HeroFeatures() {
  return (
    <div className="relative z-20 w-full max-w-5xl mx-auto px-6 pt-10 pb-16">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 text-center">
        {FEATURES.map((feature, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 + idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center select-none"
          >
            <h3 className="font-sans font-normal text-white text-base sm:text-lg leading-snug mb-2 tracking-tight">
              <span className="block">{feature.titleLine1}</span>
              <span className="block">{feature.titleLine2}</span>
            </h3>
            <p className="text-[#8A9094] text-xs sm:text-[13px] leading-relaxed max-w-[260px] mx-auto font-normal">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default HeroFeatures;
