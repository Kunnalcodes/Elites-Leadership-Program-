import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ArrowUp } from 'lucide-react';

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navCommunity = [
    { label: 'GitHub', href: 'https://github.com', external: true },
    { label: 'Discord', href: 'https://discord.gg', external: true },
    { label: 'Twitter / X', href: 'https://x.com', external: true },
    { label: 'LinkedIn', href: 'https://linkedin.com', external: true },
  ];

  const navProgram = [
    { label: 'About Thread Elite', href: '/#about', external: false },
    { label: 'Experience', href: '/#experience', external: false },
    { label: 'Progression', href: '/#journey', external: false },
    { label: 'Tasks', href: '/#tasks', external: false },
    { label: 'Leaderboard', href: '/#leaderboard', external: false },
  ];

  const navResources = [
    { label: 'FAQ', href: '/#faq', external: false },
    { label: 'Mentorship', href: '/#community', external: false },
    { label: 'Guidelines', href: '/#governance', external: false },
    { label: 'Contact', href: '/apply', external: false },
  ];

  return (
    <footer className="w-full bg-[#F7F6FC] py-10 sm:py-14 md:py-20 px-4 sm:px-6 lg:px-8 border-t border-[#E8E3F1]">
      <div className="elite-container max-w-7xl mx-auto">
        {/* Main Footer Container Card */}
        <div className="relative bg-[#FFFFFF] border border-[#E8E3F1] rounded-[26px] sm:rounded-[30px] md:rounded-[32px] p-6 sm:p-10 md:p-14 lg:p-16 shadow-[0_4px_30px_rgba(135,85,255,0.04)] overflow-hidden">
          
          {/* ── Geometric Corner Accents ── */}
          {/* Upper-Left Corner Accent */}
          <div className="absolute top-4 left-4 w-7 h-7 border-t-2 border-l-2 border-[#8755FF] rounded-tl-sm pointer-events-none opacity-80" />
          <div className="absolute top-3 left-3 w-1.5 h-1.5 rounded-full bg-[#8755FF] pointer-events-none" />

          {/* Lower-Right Corner Accent */}
          <div className="absolute bottom-4 right-4 w-7 h-7 border-b-2 border-r-2 border-[#8755FF] rounded-br-sm pointer-events-none opacity-80" />
          <div className="absolute bottom-3 right-3 w-1.5 h-1.5 rounded-full bg-[#8755FF] pointer-events-none" />

          {/* ── Ambient Floating Particles (Sparse, Restrained, Solid Colors) ── */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden select-none" aria-hidden="true">
            <div className="absolute top-12 left-1/4 w-1.5 h-1.5 rounded-full bg-[#C8B2FF] opacity-40" />
            <div className="absolute top-28 right-1/3 w-2 h-2 rounded-full bg-[#8755FF] opacity-30" />
            <div className="absolute top-1/2 left-12 w-1.5 h-1.5 rounded-full bg-[#8755FF] opacity-25" />
            <div className="absolute bottom-32 right-16 w-2 h-2 rounded-full bg-[#C8B2FF] opacity-35" />
            <div className="absolute top-20 right-12 w-1 h-1 rounded-full bg-[#8755FF] opacity-40" />
          </div>

          {/* ── Top Main Layout: Two Main Columns (Brand Left, 3 Nav Cols Right) ── */}
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 pb-12 sm:pb-16">
            
            {/* Left Column: Brand Identity */}
            <div className="lg:col-span-4 flex flex-col items-start justify-between">
              <div>
                <Link to="/" className="flex items-center gap-3.5 group mb-6">
                  <div className="w-11 h-11 rounded-lg bg-[#F4EEFF] border border-[#C8B2FF] flex items-center justify-center text-[#8755FF] group-hover:bg-[#ECE0FF] group-hover:border-[#8755FF] transition-all duration-200 shadow-sm">
                    <Shield className="w-5 h-5 text-[#8755FF]" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-heading text-xl font-black tracking-tight text-[#191525] leading-none">
                      THREAD
                    </span>
                    <span className="font-heading text-xl font-black tracking-tight text-[#8755FF] leading-none mt-1">
                      ELITE
                    </span>
                  </div>
                </Link>

                {/* Brand Description */}
                <div className="space-y-1.5 max-w-sm">
                  <p className="text-sm font-medium text-[#777386] tracking-wide leading-relaxed">
                    Student Leadership Program.
                  </p>
                  <p className="text-sm font-normal text-[#A19BAF] tracking-wider leading-relaxed">
                    Learn. Execute. Lead. Grow.
                  </p>
                </div>
              </div>

              {/* Verified Program Identity Badge */}
              <div className="mt-8 hidden lg:inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#F7F6FC] border border-[#E8E3F1] text-[11px] font-mono font-medium text-[#777386]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8755FF]" />
                <span>THREAD SECURITY // VERIFIED INITIATIVE</span>
              </div>
            </div>

            {/* Right Side: Three Clean Navigation Columns */}
            <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-8 sm:gap-10">
              
              {/* Column 1: Community */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#191525]">
                  Community
                </h3>
                <div className="w-6 h-0.5 bg-[#8755FF] mt-2 mb-4" />
                <ul className="flex flex-col gap-3">
                  {navCommunity.map((item) => (
                    <li key={item.label}>
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-[#777386] hover:text-[#8755FF] transition-all duration-200 inline-block hover:translate-x-0.5 focus:outline-none focus:text-[#8755FF]"
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Column 2: Program */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#191525]">
                  Program
                </h3>
                <div className="w-6 h-0.5 bg-[#8755FF] mt-2 mb-4" />
                <ul className="flex flex-col gap-3">
                  {navProgram.map((item) => (
                    <li key={item.label}>
                      <a
                        href={item.href}
                        className="text-sm font-medium text-[#777386] hover:text-[#8755FF] transition-all duration-200 inline-block hover:translate-x-0.5 focus:outline-none focus:text-[#8755FF]"
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Column 3: Resources */}
              <div className="col-span-2 sm:col-span-1">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#191525]">
                  Resources
                </h3>
                <div className="w-6 h-0.5 bg-[#8755FF] mt-2 mb-4" />
                <ul className="flex flex-col gap-3">
                  {navResources.map((item) => (
                    <li key={item.label}>
                      {item.href.startsWith('/') ? (
                        <a
                          href={item.href}
                          className="text-sm font-medium text-[#777386] hover:text-[#8755FF] transition-all duration-200 inline-block hover:translate-x-0.5 focus:outline-none focus:text-[#8755FF]"
                        >
                          {item.label}
                        </a>
                      ) : (
                        <a
                          href={item.href}
                          className="text-sm font-medium text-[#777386] hover:text-[#8755FF] transition-all duration-200 inline-block hover:translate-x-0.5 focus:outline-none focus:text-[#8755FF]"
                        >
                          {item.label}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          </div>

          {/* ── Horizontal Divider with Violet Accent Segment ── */}
          <div className="relative w-full h-[1px] bg-[#E8E3F1] my-8 sm:my-10">
            <div className="absolute top-0 left-0 w-14 h-[2px] bg-[#8755FF]" />
          </div>

          {/* ── Copyright & Back to Top Strip ── */}
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs font-normal text-[#A19BAF] mb-6 sm:mb-8">
            <div className="leading-relaxed">
              © {new Date().getFullYear()} Thread Elite · Built with passion by Thread Security · License
            </div>

            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-[#8755FF] hover:text-[#191525] transition-colors cursor-pointer group focus:outline-none"
              aria-label="Scroll back to top of page"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
            </button>
          </div>

          {/* ── Signature Bottom Artwork: Dot-Matrix THREAD ELITE ── */}
          {/* Constructed cleanly from an SVG pattern of small circles clipped by oversized typography */}
          <div
            className="w-full relative mt-4 -mb-8 sm:-mb-12 md:-mb-16 pointer-events-none select-none flex items-end justify-center overflow-hidden"
            aria-hidden="true"
          >
            <svg
              viewBox="0 0 1200 180"
              className="w-full h-auto max-h-[120px] sm:max-h-[160px] md:max-h-[190px] block"
              preserveAspectRatio="xMidYMax slice"
            >
              <defs>
                {/* Regular Dot Matrix Pattern */}
                <pattern
                  id="footerDotPattern"
                  x="0"
                  y="0"
                  width="10"
                  height="10"
                  patternUnits="userSpaceOnUse"
                >
                  <circle cx="5" cy="5" r="2.1" fill="#B99AFF" />
                </pattern>

                {/* Dense Glowing Dot Pattern for the bottom region */}
                <pattern
                  id="footerDotPatternDense"
                  x="0"
                  y="0"
                  width="10"
                  height="10"
                  patternUnits="userSpaceOnUse"
                >
                  <circle cx="5" cy="5" r="2.8" fill="#8755FF" />
                </pattern>

                {/* Typography Mask revealing the dots */}
                <mask id="threadEliteTextMask">
                  {/* Black background masks everything out */}
                  <rect width="100%" height="100%" fill="#000000" />
                  {/* White text exposes the dot pattern */}
                  <text
                    x="50%"
                    y="78%"
                    textAnchor="middle"
                    fontFamily="'JetBrains Mono', 'Space Grotesk', system-ui, sans-serif"
                    fontWeight="900"
                    fontSize="130"
                    letterSpacing="16"
                    fill="#FFFFFF"
                  >
                    THREAD ELITE
                  </text>
                </mask>

                {/* Horizontal Clip Bands for Stepped Opacity Fade without gradients */}
                <clipPath id="topFadeBand">
                  <rect x="0" y="0" width="1200" height="65" />
                </clipPath>
                <clipPath id="midFadeBand">
                  <rect x="0" y="65" width="1200" height="55" />
                </clipPath>
                <clipPath id="bottomFadeBand">
                  <rect x="0" y="120" width="1200" height="60" />
                </clipPath>
              </defs>

              {/* Ambient Background Dotted Field (Subtle density) */}
              <rect
                width="100%"
                height="100%"
                fill="url(#footerDotPattern)"
                opacity="0.08"
              />

              {/* Stepped Opacity Bands Creating Natural Upper Fade (Solid Colors Only) */}
              {/* Band 1: Upper letters (faint dot presence) */}
              <g clipPath="url(#topFadeBand)" mask="url(#threadEliteTextMask)">
                <rect
                  width="100%"
                  height="100%"
                  fill="url(#footerDotPattern)"
                  opacity="0.32"
                />
              </g>

              {/* Band 2: Mid letters (rich lavender presence) */}
              <g clipPath="url(#midFadeBand)" mask="url(#threadEliteTextMask)">
                <rect
                  width="100%"
                  height="100%"
                  fill="url(#footerDotPattern)"
                  opacity="0.65"
                />
              </g>

              {/* Band 3: Lower letters (intense violet focal presence, partially cropped by bottom edge) */}
              <g clipPath="url(#bottomFadeBand)" mask="url(#threadEliteTextMask)">
                <rect
                  width="100%"
                  height="100%"
                  fill="url(#footerDotPatternDense)"
                  opacity="0.95"
                />
              </g>
            </svg>
          </div>

        </div>
      </div>
    </footer>
  );
}

export default Footer;
