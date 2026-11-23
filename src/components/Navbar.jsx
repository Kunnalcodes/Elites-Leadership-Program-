import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Menu, X, ArrowUpRight, Lock } from 'lucide-react';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { label: 'Program', href: '/#program' },
    { label: 'Experience', href: '/#experience' },
    { label: 'The Journey', href: '/#journey' },
    { label: 'Community', href: '/#community' },
    { label: 'About', href: '/#about' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white/95 backdrop-blur-md border-b border-gray-200/80 ${
          isScrolled ? 'py-3 shadow-md' : 'py-4 shadow-sm'
        }`}
      >
        <div className="elite-container flex items-center justify-between">
          {/* Brand Emblem & Wordmark in White Tone */}
          <Link to="/" className="flex items-center gap-3 group">
            <img 
              src="/logo-light.png" 
              alt="Thread Elite" 
              className="h-9 sm:h-10 w-auto object-contain transition-transform duration-200 group-hover:scale-105" 
            />
          </Link>

          {/* Desktop Center Navigation in White Tone */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-semibold text-gray-700 hover:text-[#8000FF] transition-colors relative py-1 group"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#8000FF] transition-all duration-200 group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* Desktop Action CTAs */}
          <div className="hidden sm:flex items-center gap-3.5">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-heading font-semibold uppercase tracking-wider text-gray-800 bg-gray-50 hover:bg-gray-100 border border-gray-300 hover:border-[#8000FF] rounded-md transition-all duration-200 shadow-sm hover:shadow"
            >
              <Lock className="w-3.5 h-3.5 text-[#8000FF]" />
              Elite Login
            </Link>
            <Link
              to="/apply"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-heading font-semibold uppercase tracking-wider text-white bg-[#8000FF] hover:bg-[#6D00D9] border border-[#8000FF] rounded-md transition-all duration-200 shadow-sm hover:shadow-md hover:shadow-[#8000FF]/25"
            >
              Apply Now
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex items-center gap-2.5 sm:hidden">
            <Link
              to="/login"
              className="px-3 py-1.5 text-xs font-heading font-semibold text-gray-800 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded"
            >
              Login
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md focus:outline-none transition-colors"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-gray-900" /> : <Menu className="w-6 h-6 text-gray-800" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Full-Screen Overlay Menu in White Tone */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-white flex flex-col justify-between p-8 sm:hidden pt-28 border-t border-gray-200">
          <nav className="flex flex-col gap-6">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="font-heading text-2xl font-bold text-gray-900 hover:text-[#8000FF] transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex flex-col gap-3.5 pb-6">
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full h-12 flex items-center justify-center gap-2 text-sm font-heading font-semibold uppercase text-gray-800 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-md"
            >
              <Lock className="w-4 h-4 text-[#8000FF]" />
              Elite Login
            </Link>
            <Link
              to="/apply"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full h-12 flex items-center justify-center gap-2 text-sm font-heading font-semibold uppercase text-white bg-[#8000FF] hover:bg-[#6D00D9] rounded-md shadow-md"
            >
              Apply / Join Program
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
