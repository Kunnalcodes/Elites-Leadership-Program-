import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { X, ArrowRight, Shield } from 'lucide-react';
import { Button } from './Button';

export const MobileMenu = ({ isOpen, onClose }) => {
  const navLinks = [
    { label: 'HOME', path: '/' },
    { label: 'ABOUT', path: '/about' },
    { label: 'EXPERIENCE & PROGRAM', path: '/program' },
    { label: 'APPLY NOW', path: '/apply' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: '-100%' }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: '-100%' }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-50 bg-[#11110F] text-white flex flex-col justify-between p-6 sm:p-10 overflow-y-auto"
        >
          {/* Header Bar inside Mobile Menu */}
          <div className="flex justify-between items-center border-b border-white/10 pb-6">
            <Link to="/" onClick={onClose} className="flex items-center gap-3">
              <img src="/logo.png" alt="Thread Elite" className="h-8 w-auto object-contain" />
            </Link>
            <button 
              onClick={onClose}
              className="p-3 text-white hover:text-[#8BAF00] transition-colors rounded-full border border-white/10"
              aria-label="Close menu"
            >
              <X size={24} />
            </button>
          </div>

          {/* Large Navigation Links */}
          <div className="py-12 flex flex-col gap-6">
            {navLinks.map((link, idx) => (
              <motion.div
                key={link.path}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + idx * 0.08, duration: 0.3 }}
              >
                <Link
                  to={link.path}
                  onClick={onClose}
                  className="group flex items-center justify-between text-3xl sm:text-4xl font-display font-bold text-white hover:text-[#A6D300] transition-colors"
                >
                  <span>{link.label}</span>
                  <ArrowRight className="opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all text-[#8BAF00]" size={28} />
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Footer Call to Action */}
          <div className="pt-8 border-t border-white/10 flex flex-col gap-4">
            <Button to="/apply" onClick={onClose} variant="primary" className="w-full text-center justify-center">
              APPLY TO THREAD ELITE
            </Button>
            <div className="text-center text-xs text-gray-400 font-mono tracking-wider pt-2">
              © 2026 THREAD SECURITY EDUCATION
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
