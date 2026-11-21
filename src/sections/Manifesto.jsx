import React from 'react';
import { motion } from 'framer-motion';
import { Eyebrow } from '../components/Eyebrow';
import { MANIFESTO_CONTENT } from '../data/programData';

export const Manifesto = () => {
  return (
    <section id="manifesto" className="section-padding bg-[#F8F8F4] border-t border-b border-[rgba(17,17,17,0.08)] relative">
      <div className="container">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Eyebrow>{MANIFESTO_CONTENT.eyebrow}</Eyebrow>

            <h2 className="graffiti-heading text-5xl sm:text-6xl md:text-7xl font-black text-[#111111] leading-[1.05] mt-4 mb-8">
              {MANIFESTO_CONTENT.heading}
            </h2>

            <p className="font-body text-xl sm:text-2xl md:text-3xl text-[#111111] font-medium leading-snug mb-8 border-l-4 border-[#8BAF00] pl-6">
              {MANIFESTO_CONTENT.leadText}
            </p>

            <p className="text-base sm:text-lg text-[#5D5D59] leading-relaxed max-w-3xl">
              {MANIFESTO_CONTENT.bodyText}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
