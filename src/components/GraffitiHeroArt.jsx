import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Volume2, VolumeX, Sparkles, Paintbrush, Flame } from 'lucide-react';

// Web Audio API spray sound synthesizer (zero external dependencies)
const playSprayAudio = (type = 'spray') => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    if (type === 'spray') {
      const bufferSize = Math.floor(ctx.sampleRate * 0.22);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 3400 + Math.random() * 500;
      filter.Q.value = 1.4;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start();
    } else if (type === 'rattle') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(280 + Math.random() * 50, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.09, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    }
  } catch (err) {
    // Audio context may be restricted before user gesture
  }
};

export const GraffitiHeroArt = ({ hideControls = false }) => {
  const [isWriting, setIsWriting] = useState(true);
  const [sprayStep, setSprayStep] = useState(-1);
  const [canState, setCanState] = useState({
    visible: true,
    x: 60,
    y: 80,
    angle: -15,
    spraying: false,
    docked: false,
  });
  const [particles, setParticles] = useState([]);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [fontMode, setFontMode] = useState('wet-paint'); // 'wet-paint' | 'wildstyle' | 'spray-paint' | 'marker'

  // Exact Requested Color Palette: Violet, Magenta & Black
  const palette = {
    violet: '#8000FF',
    violetGlow: 'rgba(128, 0, 255, 0.75)',
    violetLight: '#A855F7',
    magenta: '#FF007A',
    magentaGlow: 'rgba(255, 0, 122, 0.75)',
    magentaLight: '#FF54A5',
    black: '#000000',
    darkBg: '#08070C',
  };

  const containerRef = useRef(null);
  const letterRefs = useRef([]);
  const animTimeouts = useRef([]);

  const firstWord = 'THREAD';
  const secondWord = 'ELITE';
  const totalLetters = firstWord.length + secondWord.length;

  const dripHeightsFirst = [36, 48, 28, 54, 42, 58];
  const dripHeightsSecond = [50, 32, 60, 44, 52];

  const clearTimeouts = () => {
    animTimeouts.current.forEach(clearTimeout);
    animTimeouts.current = [];
  };

  // Helper to emit dynamic aerosol spray particles
  const emitParticles = useCallback((originX, originY, color, count = 16) => {
    const newItems = [];
    for (let i = 0; i < count; i++) {
      const angle = (Math.random() * Math.PI) - (Math.PI / 2) + (Math.random() - 0.5);
      const speed = 25 + Math.random() * 60;
      newItems.push({
        id: Math.random() + Date.now(),
        x: originX + (Math.random() * 16 - 8),
        y: originY + (Math.random() * 16 - 8),
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed + 12,
        size: Math.random() * 7 + 3,
        color,
        opacity: 0.95,
      });
    }
    setParticles((prev) => [...prev.slice(-70), ...newItems]);
  }, []);

  // Main Spray Execution
  const runSpraySequence = useCallback(() => {
    clearTimeouts();
    setIsWriting(true);
    setSprayStep(-1);
    setParticles([]);

    // Step 0: Shake can
    if (soundEnabled) {
      playSprayAudio('rattle');
      setTimeout(() => playSprayAudio('rattle'), 130);
      setTimeout(() => playSprayAudio('rattle'), 260);
    }

    const setupDelay = 300;

    // Sequence each letter with pixel-perfect tracking
    for (let i = 0; i < totalLetters; i++) {
      const letterDelay = setupDelay + i * 200;
      const t = setTimeout(() => {
        setSprayStep(i);

        if (soundEnabled) {
          playSprayAudio('spray');
        }

        // Measure letter location in DOM
        const letterEl = letterRefs.current[i];
        if (letterEl && containerRef.current) {
          const lRect = letterEl.getBoundingClientRect();
          const cRect = containerRef.current.getBoundingClientRect();
          const targetX = lRect.left - cRect.left + lRect.width * 0.5;
          const targetY = lRect.top - cRect.top + lRect.height * 0.45;

          const isSecond = i >= firstWord.length;
          const sprayColor = isSecond ? palette.magenta : palette.violet;

          setCanState({
            visible: true,
            docked: false,
            x: targetX + 16,
            y: targetY - 14,
            angle: -18 + ((i % 2 === 0) ? -8 : 8),
            spraying: true,
          });

          emitParticles(targetX, targetY, sprayColor, 16);
        }
      }, letterDelay);

      animTimeouts.current.push(t);
    }

    // Underline swoosh step
    const underlineTime = setupDelay + totalLetters * 200 + 120;
    const ut = setTimeout(() => {
      setSprayStep(totalLetters);
      if (soundEnabled) playSprayAudio('spray');

      if (containerRef.current) {
        const cRect = containerRef.current.getBoundingClientRect();
        const endX = cRect.width * 0.88;
        const endY = cRect.height * 0.82;

        setCanState({
          visible: true,
          docked: false,
          x: endX + 8,
          y: endY - 18,
          angle: -32,
          spraying: true,
        });

        emitParticles(endX, endY, palette.magenta, 22);
      }
    }, underlineTime);
    animTimeouts.current.push(ut);

    // Complete sequence & dock can on the side
    const finishTime = underlineTime + 500;
    const ft = setTimeout(() => {
      setIsWriting(false);
      if (containerRef.current) {
        const cRect = containerRef.current.getBoundingClientRect();
        setCanState({
          visible: true,
          docked: true,
          x: cRect.width * 0.94,
          y: cRect.height * 0.86,
          angle: 12,
          spraying: false,
        });
      }
    }, finishTime);
    animTimeouts.current.push(ft);
  }, [totalLetters, firstWord.length, palette.violet, palette.magenta, soundEnabled, emitParticles]);

  // Run automatically on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      runSpraySequence();
    }, 120);
    return () => {
      clearTimeout(timer);
      clearTimeouts();
    };
  }, [runSpraySequence]);

  // Particle physics update
  useEffect(() => {
    if (particles.length === 0) return;
    const interval = setInterval(() => {
      setParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx * 0.05,
            y: p.y + p.vy * 0.05 + 0.9,
            opacity: p.opacity - 0.045,
            size: Math.max(0, p.size - 0.14),
          }))
          .filter((p) => p.opacity > 0.05)
      );
    }, 25);
    return () => clearInterval(interval);
  }, [particles]);

  // Interactive mouse spray on the wall
  const handleContainerMouseMove = (e) => {
    if (!containerRef.current || isWriting) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    if (Math.random() > 0.65) {
      const color = x > rect.width * 0.5 ? palette.magenta : palette.violet;
      emitParticles(x, y, color, 4);
    }
  };

  const handleContainerClick = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const color = x > rect.width * 0.5 ? palette.magenta : palette.violet;
    emitParticles(x, y, color, 20);
    if (soundEnabled) playSprayAudio('spray');
  };

  // Font class resolver
  const getFontFamily = () => {
    switch (fontMode) {
      case 'wet-paint':
        return 'font-wet-paint';
      case 'wildstyle':
        return 'font-graffiti';
      case 'marker':
        return 'font-marker';
      case 'spray-paint':
      default:
        return 'font-spray-paint';
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleContainerMouseMove}
      onClick={handleContainerClick}
      className="relative w-full max-w-5xl mx-auto py-10 px-4 sm:px-8 select-none cursor-crosshair overflow-visible"
    >
      {/* Top Street Sticker Tag */}
      <motion.div
        initial={{ opacity: 0, scale: 0, rotate: -25 }}
        animate={{
          opacity: sprayStep >= 1 ? 1 : 0,
          scale: sprayStep >= 1 ? 1 : 0,
          rotate: -12,
        }}
        transition={{ type: 'spring', stiffness: 350, damping: 15 }}
        className="absolute -top-1 left-4 sm:left-12 z-20 pointer-events-none"
      >
        <div className="px-3.5 py-1.5 bg-[#FF007A] border-2 border-black shadow-[4px_4px_0px_#000000] rounded-md font-mono text-[11px] font-black uppercase text-white flex items-center gap-1.5">
          <span>👑 STREET CYPHER // 2026</span>
        </div>
      </motion.div>

      {/* Top-Right Star Sparkle Tag */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{
          opacity: sprayStep >= totalLetters - 1 ? 1 : 0,
          scale: sprayStep >= totalLetters - 1 ? 1 : 0,
        }}
        transition={{ type: 'spring', stiffness: 350, damping: 14 }}
        className="absolute -top-1 right-4 sm:right-12 z-20 pointer-events-none"
      >
        <div className="p-2.5 bg-[#8000FF] border-2 border-black shadow-[4px_4px_0px_#000000] rounded-full text-white transform rotate-12 flex items-center justify-center">
          <Sparkles size={18} className="text-white" />
        </div>
      </motion.div>

      {/* Central Big Graffiti Text Characters */}
      <div className="relative z-10 flex flex-wrap items-center justify-center gap-x-4 sm:gap-x-8 gap-y-2 text-center">
        {/* WORD 1: "THREAD" in Electric Violet */}
        <div className="relative inline-flex items-center justify-center">
          {firstWord.split('').map((char, idx) => {
            const isSprayed = sprayStep >= idx;
            const isCurrentlySpraying = sprayStep === idx;
            const dripHeight = dripHeightsFirst[idx % dripHeightsFirst.length];

            return (
              <div
                key={`first-${idx}`}
                ref={(el) => (letterRefs.current[idx] = el)}
                className="relative inline-block mx-0.5 sm:mx-1.5"
              >
                <span
                  className={`inline-block text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-normal leading-none transition-all duration-200 ${getFontFamily()} ${
                    isSprayed ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
                  }`}
                  style={{
                    color: palette.violet,
                    WebkitTextStroke: '4px #000000',
                    paintOrder: 'stroke fill',
                    filter: isSprayed
                      ? `drop-shadow(6px 6px 0px #000000) drop-shadow(0 0 24px ${palette.violetGlow})`
                      : 'none',
                    transform: isCurrentlySpraying
                      ? 'scale(1.15) rotate(-3deg)'
                      : isSprayed
                      ? 'scale(1) rotate(0deg)'
                      : 'scale(0.75)',
                  }}
                >
                  {char}
                </span>

                {/* Wet Paint Drips */}
                {isSprayed && (
                  <div
                    className="absolute left-1/2 -translate-x-1/2 top-[80%] pointer-events-none animate-drip"
                    style={{ animationDelay: `${idx * 0.14}s` }}
                  >
                    <svg
                      width="14"
                      height={dripHeight}
                      viewBox={`0 0 14 ${dripHeight}`}
                      fill="none"
                      className="overflow-visible"
                    >
                      <path
                        d={`M6 0 L6 ${dripHeight - 6} Q6 ${dripHeight} 7 ${dripHeight} Q8 ${dripHeight} 8 ${dripHeight - 6} L8 0 Z`}
                        fill={palette.violet}
                        stroke="#000000"
                        strokeWidth="1.8"
                      />
                      <circle
                        cx="7"
                        cy={dripHeight - 3}
                        r="3.5"
                        fill={palette.violet}
                        stroke="#000000"
                        strokeWidth="1.8"
                      />
                      <circle cx="5.8" cy={dripHeight - 4.2} r="1" fill="#FFFFFF" opacity="0.85" />
                    </svg>
                  </div>
                )}

                {/* Dynamic Splatter Dot */}
                {isSprayed && idx % 2 === 0 && (
                  <span
                    className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border border-black pointer-events-none"
                    style={{
                      backgroundColor: palette.violet,
                      transform: `translate(${Math.sin(idx) * 8}px, ${Math.cos(idx) * 6}px)`,
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* WORD 2: "ELITE" in Vibrant Magenta */}
        <div className="relative inline-flex items-center justify-center">
          {secondWord.split('').map((char, idx) => {
            const globalIdx = firstWord.length + idx;
            const isSprayed = sprayStep >= globalIdx;
            const isCurrentlySpraying = sprayStep === globalIdx;
            const dripHeight = dripHeightsSecond[idx % dripHeightsSecond.length];

            return (
              <div
                key={`second-${idx}`}
                ref={(el) => (letterRefs.current[globalIdx] = el)}
                className="relative inline-block mx-0.5 sm:mx-1.5"
              >
                <span
                  className={`inline-block text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-normal leading-none transition-all duration-200 ${getFontFamily()} ${
                    isSprayed ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
                  }`}
                  style={{
                    color: palette.magenta,
                    WebkitTextStroke: '4px #000000',
                    paintOrder: 'stroke fill',
                    filter: isSprayed
                      ? `drop-shadow(6px 6px 0px #000000) drop-shadow(0 0 24px ${palette.magentaGlow})`
                      : 'none',
                    transform: isCurrentlySpraying
                      ? 'scale(1.15) rotate(3deg)'
                      : isSprayed
                      ? 'scale(1) rotate(0deg)'
                      : 'scale(0.75)',
                  }}
                >
                  {char}
                </span>

                {/* Wet Paint Drips */}
                {isSprayed && (
                  <div
                    className="absolute left-1/2 -translate-x-1/2 top-[80%] pointer-events-none animate-drip"
                    style={{ animationDelay: `${idx * 0.16}s` }}
                  >
                    <svg
                      width="14"
                      height={dripHeight}
                      viewBox={`0 0 14 ${dripHeight}`}
                      fill="none"
                      className="overflow-visible"
                    >
                      <path
                        d={`M6 0 L6 ${dripHeight - 6} Q6 ${dripHeight} 7 ${dripHeight} Q8 ${dripHeight} 8 ${dripHeight - 6} L8 0 Z`}
                        fill={palette.magenta}
                        stroke="#000000"
                        strokeWidth="1.8"
                      />
                      <circle
                        cx="7"
                        cy={dripHeight - 3}
                        r="3.5"
                        fill={palette.magenta}
                        stroke="#000000"
                        strokeWidth="1.8"
                      />
                      <circle cx="5.8" cy={dripHeight - 4.2} r="1" fill="#FFFFFF" opacity="0.85" />
                    </svg>
                  </div>
                )}

                {/* Splatter Dots */}
                {isSprayed && idx % 2 === 1 && (
                  <span
                    className="absolute -bottom-1 -right-1 w-2.5 h-2.5 rounded-full border border-black pointer-events-none"
                    style={{
                      backgroundColor: palette.magenta,
                      transform: `translate(${Math.cos(idx) * 7}px, ${Math.sin(idx) * 6}px)`,
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Dynamic Street Underline Tag with Graffiti Arrow */}
      <div className="relative w-full max-w-2xl mx-auto mt-4 sm:mt-6 h-8 sm:h-12 pointer-events-none">
        <svg
          className="w-full h-full overflow-visible"
          viewBox="0 0 600 40"
          fill="none"
          preserveAspectRatio="none"
        >
          {/* Bold black shadow stroke */}
          <path
            d="M 20 24 Q 150 36, 300 22 T 560 20 L 575 22 L 565 14"
            stroke="#000000"
            strokeWidth="9"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              strokeDasharray: 600,
              strokeDashoffset: sprayStep >= totalLetters ? 0 : 600,
              transition: 'stroke-dashoffset 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          />
          {/* Vibrant inner spray stroke */}
          <path
            d="M 20 22 Q 150 34, 300 20 T 560 18 L 575 20 L 565 12"
            stroke={palette.magenta}
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              strokeDasharray: 600,
              strokeDashoffset: sprayStep >= totalLetters ? 0 : 600,
              transition: 'stroke-dashoffset 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          />
          {/* Arrowhead at end */}
          <path
            d="M 548 10 L 578 20 L 552 28"
            stroke="#000000"
            strokeWidth="6"
            strokeLinecap="round"
            style={{
              opacity: sprayStep >= totalLetters ? 1 : 0,
              transition: 'opacity 0.2s ease 0.3s',
            }}
          />
          <path
            d="M 548 10 L 578 20 L 552 28"
            stroke={palette.violet}
            strokeWidth="4"
            strokeLinecap="round"
            style={{
              opacity: sprayStep >= totalLetters ? 1 : 0,
              transition: 'opacity 0.2s ease 0.3s',
            }}
          />
        </svg>
      </div>

      {/* Floating Animated Aerosol Spray Can */}
      <AnimatePresence>
        {canState.visible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: 1,
              scale: canState.docked ? 0.9 : 1.1,
              x: canState.x,
              y: canState.y,
              rotate: canState.angle,
            }}
            transition={{
              type: 'spring',
              stiffness: canState.docked ? 120 : 380,
              damping: canState.docked ? 20 : 25,
            }}
            onClick={(e) => {
              e.stopPropagation();
              runSpraySequence();
            }}
            className="absolute top-0 left-0 z-30 pointer-events-auto cursor-pointer filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.85)]"
            title="Click spray can to tag again!"
          >
            {/* The Spray Can SVG Artwork */}
            <div className="relative">
              <svg width="42" height="74" viewBox="0 0 42 74" fill="none">
                {/* Nozzle Cap */}
                <rect x="18" y="0" width="6" height="7" rx="1.5" fill="#FFFFFF" stroke="#000000" strokeWidth="2" />
                <rect x="22" y="2" width="2" height="2" fill="#000000" />
                {/* Top Dome */}
                <path d="M 10 13 Q 21 8, 32 13 L 34 19 L 8 19 Z" fill="#8000FF" stroke="#000000" strokeWidth="2" />
                {/* Can Body in Black with Magenta Stripe */}
                <rect x="8" y="19" width="26" height="50" rx="3" fill="#120F17" stroke="#000000" strokeWidth="2.5" />
                <rect x="8" y="32" width="26" height="18" fill="#FF007A" stroke="#000000" strokeWidth="1.5" />
                {/* White Tag Text on Can */}
                <text x="21" y="44" fill="#FFFFFF" fontSize="7" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                  ELITE
                </text>
                {/* Metallic Base Rim */}
                <rect x="10" y="69" width="22" height="4" rx="1" fill="#4B1385" stroke="#000000" strokeWidth="1.5" />
              </svg>

              {/* Aerosol Mist Nozzle Emission Flare */}
              {canState.spraying && (
                <div className="absolute -top-4 -left-7 pointer-events-none">
                  <div className="w-9 h-9 rounded-full bg-[#FF007A]/40 blur-[4px] animate-ping" />
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dynamic Aerosol Particle Cloud */}
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: `${p.x}px`,
            top: `${p.y}px`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            opacity: p.opacity,
            boxShadow: `0 0 8px ${p.color}`,
          }}
        />
      ))}

      {/* Interactive Control Pill (Audio, Spray Again, Font Mode) */}
      {!hideControls && (
      <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5 relative z-20">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            runSpraySequence();
          }}
          className="px-3.5 py-1.5 rounded-lg bg-[#15111F] hover:bg-[#1D1729] border border-[#8000FF] text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-[2px_2px_0px_#000000]"
        >
          <RotateCcw size={13} className={isWriting ? 'animate-spin' : ''} />
          <span>Spray Again</span>
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setSoundEnabled(!soundEnabled);
          }}
          className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-[2px_2px_0px_#000000] ${
            soundEnabled
              ? 'bg-[#FF007A] border-[#FF007A] text-white'
              : 'bg-[#15111F] border-[#38264F] text-[#898293] hover:text-white'
          }`}
        >
          {soundEnabled ? <Volume2 size={13} /> : <VolumeX size={13} />}
          <span>{soundEnabled ? 'Spray FX: ON' : 'Spray FX: OFF'}</span>
        </button>

        <div className="flex items-center gap-1 bg-[#100D17] border border-[#38264F] p-1 rounded-lg">
          {[
            { id: 'wet-paint', label: 'Wet Paint' },
            { id: 'wildstyle', label: 'Wildstyle' },
            { id: 'marker', label: 'Marker' },
            { id: 'spray-paint', label: 'Spray' },
          ].map((mode) => (
            <button
              key={mode.id}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setFontMode(mode.id);
              }}
              className={`px-2.5 py-1 rounded text-[11px] font-mono font-bold transition-all ${
                fontMode === mode.id
                  ? 'bg-[#8000FF] text-white shadow'
                  : 'text-[#898293] hover:text-white'
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>
      )}
    </div>
  );
};

export default GraffitiHeroArt;
