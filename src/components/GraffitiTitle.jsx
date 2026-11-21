import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Volume2, VolumeX, Sparkles, Paintbrush, Palette, Type, Flame } from 'lucide-react';

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
      filter.frequency.value = 3300 + Math.random() * 600;
      filter.Q.value = 1.3;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.21);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start();
    } else if (type === 'rattle') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(270 + Math.random() * 60, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(70, ctx.currentTime + 0.05);

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

const COLOR_PALETTES = {
  volt: {
    name: 'Volt & Violet',
    primary: '#8BAF00',
    primaryGlow: 'rgba(139, 175, 0, 0.65)',
    primaryLight: '#A6D300',
    secondary: '#8B5CF6',
    secondaryGlow: 'rgba(139, 92, 246, 0.65)',
    secondaryLight: '#A78BFA',
    arrow: '#8BAF00',
  },
  neon: {
    name: 'Cyber Neon',
    primary: '#00E5FF',
    primaryGlow: 'rgba(0, 229, 255, 0.7)',
    primaryLight: '#70F7FF',
    secondary: '#FF007A',
    secondaryGlow: 'rgba(255, 0, 122, 0.7)',
    secondaryLight: '#FF54A5',
    arrow: '#00E5FF',
  },
  solar: {
    name: 'Solar Flare',
    primary: '#F59E0B',
    primaryGlow: 'rgba(245, 158, 11, 0.7)',
    primaryLight: '#FBBF24',
    secondary: '#EF4444',
    secondaryGlow: 'rgba(239, 68, 68, 0.7)',
    secondaryLight: '#F87171',
    arrow: '#F59E0B',
  },
};

export const GraffitiTitle = ({ onComplete }) => {
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
  const [textCase, setTextCase] = useState('title'); // 'title' | 'upper' (Default to "Thread Elite")
  const [paletteKey, setPaletteKey] = useState('volt');

  const palette = COLOR_PALETTES[paletteKey];

  const containerRef = useRef(null);
  const letterRefs = useRef([]);
  const animTimeouts = useRef([]);

  // Word letters based on casing: default "Thread" & "Elite"
  const firstWord = textCase === 'upper' ? 'THREAD' : 'Thread';
  const secondWord = textCase === 'upper' ? 'ELITE' : 'Elite';
  const totalLetters = firstWord.length + secondWord.length;

  const clearTimeouts = () => {
    animTimeouts.current.forEach(clearTimeout);
    animTimeouts.current = [];
  };

  // Helper to emit dynamic aerosol spray particles
  const emitParticles = useCallback((originX, originY, color, count = 14) => {
    const newItems = [];
    for (let i = 0; i < count; i++) {
      const angle = (Math.random() * Math.PI) - (Math.PI / 2) + (Math.random() - 0.5);
      const speed = 25 + Math.random() * 55;
      newItems.push({
        id: Math.random() + Date.now(),
        x: originX + (Math.random() * 16 - 8),
        y: originY + (Math.random() * 16 - 8),
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed + 10,
        size: Math.random() * 7 + 3,
        color,
        opacity: 0.95,
      });
    }
    setParticles((prev) => [...prev.slice(-60), ...newItems]);
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

    const setupDelay = 350;

    // Sequence each letter with pixel-perfect tracking
    for (let i = 0; i < totalLetters; i++) {
      const letterDelay = setupDelay + i * 210;
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
          const sprayColor = isSecond ? palette.secondary : palette.primary;

          setCanState({
            visible: true,
            docked: false,
            x: targetX + 16,
            y: targetY - 14,
            angle: -18 + ((i % 2 === 0) ? -8 : 8),
            spraying: true,
          });

          emitParticles(targetX, targetY, sprayColor, 14);
        }
      }, letterDelay);

      animTimeouts.current.push(t);
    }

    // Underline swoosh step
    const underlineTime = setupDelay + totalLetters * 210 + 120;
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

        emitParticles(endX, endY, palette.arrow, 20);
      }
    }, underlineTime);
    animTimeouts.current.push(ut);

    // Complete sequence & gently dock can
    const finishTime = underlineTime + 550;
    const ft = setTimeout(() => {
      setIsWriting(false);
      if (containerRef.current) {
        const cRect = containerRef.current.getBoundingClientRect();
        setCanState({
          visible: true,
          docked: true,
          x: cRect.width * 0.94,
          y: cRect.height * 0.88,
          angle: 12,
          spraying: false,
        });
      }
      if (onComplete) onComplete();
    }, finishTime);
    animTimeouts.current.push(ft);
  }, [totalLetters, firstWord.length, palette, soundEnabled, emitParticles, onComplete]);

  // Run automatically on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      runSpraySequence();
    }, 150);
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

  // Manual interactive spray
  const handleContainerMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    if (Math.random() > 0.65) {
      const color = x > rect.width * 0.5 ? palette.secondary : palette.primary;
      emitParticles(x, y, color, 4);
    }
  };

  const handleContainerClick = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const color = x > rect.width * 0.5 ? palette.secondary : palette.primary;
    emitParticles(x, y, color, 18);
    if (soundEnabled) playSprayAudio('spray');
  };

  // Click on the docked spray can to shake & spray
  const handleCanClick = (e) => {
    e.stopPropagation();
    runSpraySequence();
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

  // Predefined drip heights
  const dripMapFirst = [38, 20, 36, 16, 28, 44];
  const dripMapSecond = [34, 46, 18, 38, 30];

  return (
    <div className="relative w-full flex flex-col items-center">
      {/* Graffiti Controls Toolbar */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-4 z-20">
        
        {/* Re-Spray Action */}
        <button
          id="btn-respray"
          onClick={runSpraySequence}
          disabled={isWriting}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border-2 border-[#111111] shadow-[2.5px_2.5px_0px_#111111] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#111111] active:translate-x-0 active:translate-y-0 text-xs font-mono font-bold text-[#111111] transition-all cursor-pointer disabled:opacity-50"
          title="Spray paint 'Thread Elite' again"
        >
          <RotateCcw size={13} className={isWriting ? 'animate-spin' : ''} />
          <span>{isWriting ? 'SPRAYING...' : 'RE-SPRAY'}</span>
        </button>

        {/* Audio Toggle */}
        <button
          id="btn-sound-toggle"
          onClick={() => {
            const next = !soundEnabled;
            setSoundEnabled(next);
            if (next) playSprayAudio('rattle');
          }}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border-2 border-[#111111] shadow-[2.5px_2.5px_0px_#111111] text-xs font-mono font-bold transition-all cursor-pointer ${
            soundEnabled
              ? 'bg-[#8BAF00] text-[#111111]'
              : 'bg-white text-gray-600 hover:text-[#111111]'
          }`}
          title="Toggle spray sound effects"
        >
          {soundEnabled ? <Volume2 size={13} /> : <VolumeX size={13} />}
          <span>SOUND: {soundEnabled ? 'ON' : 'OFF'}</span>
        </button>

        {/* Font Style Switcher */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-full border-2 border-[#111111] shadow-[2.5px_2.5px_0px_#111111] text-[11px] font-mono font-bold">
          <button
            id="font-drip"
            onClick={() => setFontMode('wet-paint')}
            className={`px-2.5 py-0.5 rounded-full transition-all cursor-pointer ${
              fontMode === 'wet-paint'
                ? 'bg-[#8BAF00] text-[#111111]'
                : 'text-gray-600 hover:text-black'
            }`}
          >
            DRIP
          </button>
          <button
            id="font-wildstyle"
            onClick={() => setFontMode('wildstyle')}
            className={`px-2.5 py-0.5 rounded-full transition-all cursor-pointer ${
              fontMode === 'wildstyle'
                ? 'bg-[#8BAF00] text-[#111111]'
                : 'text-gray-600 hover:text-black'
            }`}
          >
            WILDSTYLE
          </button>
          <button
            id="font-aerosol"
            onClick={() => setFontMode('spray-paint')}
            className={`px-2.5 py-0.5 rounded-full transition-all cursor-pointer ${
              fontMode === 'spray-paint'
                ? 'bg-[#8BAF00] text-[#111111]'
                : 'text-gray-600 hover:text-black'
            }`}
          >
            AEROSOL
          </button>
          <button
            id="font-marker"
            onClick={() => setFontMode('marker')}
            className={`px-2.5 py-0.5 rounded-full transition-all cursor-pointer ${
              fontMode === 'marker'
                ? 'bg-[#8BAF00] text-[#111111]'
                : 'text-gray-600 hover:text-black'
            }`}
          >
            MARKER
          </button>
        </div>

        {/* Text Casing Toggle: "Thread Elite" vs "THREAD ELITE" */}
        <button
          id="btn-case-toggle"
          onClick={() => {
            setTextCase((c) => (c === 'title' ? 'upper' : 'title'));
          }}
          className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white border-2 border-[#111111] shadow-[2.5px_2.5px_0px_#111111] text-xs font-mono font-bold text-[#111111] transition-all cursor-pointer hover:bg-gray-100"
          title="Toggle between Title Case and All Caps"
        >
          <Type size={13} />
          <span>{textCase === 'title' ? 'Thread Elite' : 'THREAD ELITE'}</span>
        </button>

        {/* Color Palette Switcher */}
        <div className="flex items-center gap-1.5 bg-white px-2.5 py-1.5 rounded-full border-2 border-[#111111] shadow-[2.5px_2.5px_0px_#111111]">
          <Palette size={12} className="text-gray-500" />
          <button
            onClick={() => setPaletteKey('volt')}
            className={`w-4 h-4 rounded-full border border-black cursor-pointer transition-transform ${
              paletteKey === 'volt' ? 'scale-125 ring-2 ring-black' : ''
            }`}
            style={{ background: 'linear-gradient(135deg, #8BAF00 50%, #8B5CF6 50%)' }}
            title="Volt & Violet"
          />
          <button
            onClick={() => setPaletteKey('neon')}
            className={`w-4 h-4 rounded-full border border-black cursor-pointer transition-transform ${
              paletteKey === 'neon' ? 'scale-125 ring-2 ring-black' : ''
            }`}
            style={{ background: 'linear-gradient(135deg, #00E5FF 50%, #FF007A 50%)' }}
            title="Cyber Neon"
          />
          <button
            onClick={() => setPaletteKey('solar')}
            className={`w-4 h-4 rounded-full border border-black cursor-pointer transition-transform ${
              paletteKey === 'solar' ? 'scale-125 ring-2 ring-black' : ''
            }`}
            style={{ background: 'linear-gradient(135deg, #F59E0B 50%, #EF4444 50%)' }}
            title="Solar Flare"
          />
        </div>
      </div>

      {/* Main Interactive Graffiti Wall Box */}
      <div
        ref={containerRef}
        onMouseMove={handleContainerMouseMove}
        onClick={handleContainerClick}
        className="relative w-full max-w-5xl px-4 py-8 select-none cursor-crosshair group overflow-visible"
      >
        {/* Ambient Overspray Aerosol Haze */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute top-1/4 left-1/4 w-80 h-36 rounded-full blur-3xl transform -rotate-12 transition-all duration-500"
            style={{ backgroundColor: `${palette.primary}20` }}
          />
          <div
            className="absolute bottom-1/4 right-1/4 w-80 h-36 rounded-full blur-3xl transform rotate-6 transition-all duration-500"
            style={{ backgroundColor: `${palette.secondary}25` }}
          />

          {/* Permanent Street Splatters */}
          <svg className="absolute inset-0 w-full h-full opacity-65 pointer-events-none overflow-visible">
            <circle cx="6%" cy="25%" r="3.5" fill={palette.primary} />
            <circle cx="8%" cy="20%" r="1.5" fill="#111111" />
            <circle cx="5%" cy="32%" r="2" fill={palette.primary} />
            <circle cx="10%" cy="28%" r="1" fill={palette.secondary} />

            <circle cx="49%" cy="14%" r="3" fill={palette.primary} />
            <circle cx="51%" cy="18%" r="1.8" fill="#111111" />
            <circle cx="53%" cy="84%" r="2.5" fill={palette.secondary} />

            <circle cx="93%" cy="28%" r="4" fill={palette.secondary} />
            <circle cx="91%" cy="22%" r="2" fill="#111111" />
            <circle cx="95%" cy="36%" r="2.5" fill={palette.secondary} />
            <circle cx="89%" cy="40%" r="1.5" fill={palette.primary} />
          </svg>
        </div>

        {/* Dynamic Flying Spray Droplets */}
        <div className="absolute inset-0 pointer-events-none overflow-visible z-30">
          {particles.map((p) => (
            <div
              key={p.id}
              className="absolute rounded-full pointer-events-none"
              style={{
                left: `${p.x}px`,
                top: `${p.y}px`,
                width: `${p.size}px`,
                height: `${p.size}px`,
                backgroundColor: p.color,
                opacity: p.opacity,
                boxShadow: `0 0 6px ${p.color}`,
                transform: 'translate(-50%, -50%)',
              }}
            />
          ))}
        </div>

        {/* Top-Left Street Tag Pill Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0, rotate: -25 }}
          animate={{
            opacity: sprayStep >= 1 ? 1 : 0,
            scale: sprayStep >= 1 ? 1 : 0,
            rotate: -12,
          }}
          transition={{ type: 'spring', stiffness: 350, damping: 15 }}
          className="absolute -top-3 left-4 sm:left-10 z-20 pointer-events-none"
        >
          <div
            className="px-3 py-1 border-2 border-[#111111] shadow-[3px_3px_0px_#111111] rounded-md font-mono text-[11px] font-black uppercase text-[#111111] flex items-center gap-1.5"
            style={{ backgroundColor: palette.primaryLight }}
          >
            <span>👑 STREET TAG</span>
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
          className="absolute -top-2 right-4 sm:right-10 z-20 pointer-events-none"
        >
          <div
            className="p-2 border-2 border-[#111111] shadow-[3px_3px_0px_#111111] rounded-full text-white transform rotate-12"
            style={{ backgroundColor: palette.secondary }}
          >
            <Sparkles size={16} className="text-white" />
          </div>
        </motion.div>

        {/* Graffiti Text Characters */}
        <div className="relative z-10 flex flex-wrap items-center justify-center gap-x-4 sm:gap-x-8 gap-y-2 text-center">
          
          {/* WORD 1: "Thread" (or "THREAD") */}
          <div className="relative inline-flex items-center justify-center">
            {firstWord.split('').map((char, idx) => {
              const isSprayed = sprayStep >= idx;
              const isCurrentlySpraying = sprayStep === idx;
              const dripHeight = dripMapFirst[idx % dripMapFirst.length];

              return (
                <div
                  key={`first-${idx}`}
                  ref={(el) => (letterRefs.current[idx] = el)}
                  className="relative inline-block mx-0.5 sm:mx-1"
                >
                  <span
                    className={`inline-block text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-normal leading-none transition-all duration-200 ${getFontFamily()} ${
                      isSprayed ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
                    }`}
                    style={{
                      color: palette.primary,
                      WebkitTextStroke: '3.5px #111111',
                      paintOrder: 'stroke fill',
                      filter: isSprayed
                        ? `drop-shadow(5px 5px 0px #111111) drop-shadow(0 0 18px ${palette.primaryGlow})`
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
                  {isSprayed && fontMode !== 'spray-paint' && fontMode !== 'marker' && (
                    <div
                      className="absolute left-1/2 -translate-x-1/2 top-[82%] pointer-events-none animate-drip"
                      style={{ animationDelay: `${idx * 0.12}s` }}
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
                          fill={palette.primary}
                          stroke="#111111"
                          strokeWidth="1.6"
                        />
                        <circle
                          cx="7"
                          cy={dripHeight - 3}
                          r="3.5"
                          fill={palette.primary}
                          stroke="#111111"
                          strokeWidth="1.6"
                        />
                        <circle cx="5.8" cy={dripHeight - 4.2} r="1" fill="#FFFFFF" opacity="0.8" />
                      </svg>
                    </div>
                  )}

                  {/* Dynamic Splatter Dot */}
                  {isSprayed && idx % 2 === 0 && (
                    <span
                      className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border border-[#111111] pointer-events-none"
                      style={{
                        backgroundColor: palette.primary,
                        transform: `translate(${Math.sin(idx) * 8}px, ${Math.cos(idx) * 6}px)`,
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* WORD 2: "Elite" (or "ELITE") */}
          <div className="relative inline-flex items-center justify-center">
            {secondWord.split('').map((char, idx) => {
              const globalIdx = firstWord.length + idx;
              const isSprayed = sprayStep >= globalIdx;
              const isCurrentlySpraying = sprayStep === globalIdx;
              const dripHeight = dripMapSecond[idx % dripMapSecond.length];

              return (
                <div
                  key={`second-${idx}`}
                  ref={(el) => (letterRefs.current[globalIdx] = el)}
                  className="relative inline-block mx-0.5 sm:mx-1"
                >
                  <span
                    className={`inline-block text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-normal leading-none transition-all duration-200 ${getFontFamily()} ${
                      isSprayed ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
                    }`}
                    style={{
                      color: palette.secondary,
                      WebkitTextStroke: '3.5px #111111',
                      paintOrder: 'stroke fill',
                      filter: isSprayed
                        ? `drop-shadow(5px 5px 0px #111111) drop-shadow(0 0 20px ${palette.secondaryGlow})`
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
                  {isSprayed && fontMode !== 'spray-paint' && fontMode !== 'marker' && (
                    <div
                      className="absolute left-1/2 -translate-x-1/2 top-[82%] pointer-events-none animate-drip"
                      style={{ animationDelay: `${idx * 0.15}s` }}
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
                          fill={palette.secondary}
                          stroke="#111111"
                          strokeWidth="1.6"
                        />
                        <circle
                          cx="7"
                          cy={dripHeight - 3}
                          r="3.5"
                          fill={palette.secondary}
                          stroke="#111111"
                          strokeWidth="1.6"
                        />
                        <circle cx="5.8" cy={dripHeight - 4.2} r="1" fill="#FFFFFF" opacity="0.8" />
                      </svg>
                    </div>
                  )}

                  {/* Splatter Dots */}
                  {isSprayed && idx % 2 === 1 && (
                    <span
                      className="absolute -bottom-1 -right-1 w-2.5 h-2.5 rounded-full border border-[#111111] pointer-events-none"
                      style={{
                        backgroundColor: palette.secondary,
                        transform: `translate(${Math.cos(idx) * 7}px, ${Math.sin(idx) * 6}px)`,
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Dynamic Street Underline Tag with Arrow */}
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
              stroke="#111111"
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
              stroke={palette.arrow}
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
              stroke="#111111"
              strokeWidth="6"
              strokeLinecap="round"
              style={{
                opacity: sprayStep >= totalLetters ? 1 : 0,
                transition: 'opacity 0.2s ease 0.3s',
              }}
            />
            <path
              d="M 548 10 L 578 20 L 552 28"
              stroke={palette.arrow}
              strokeWidth="3"
              strokeLinecap="round"
              style={{
                opacity: sprayStep >= totalLetters ? 1 : 0,
                transition: 'opacity 0.2s ease 0.3s',
              }}
            />
          </svg>
        </div>

        {/* Aerosol Spray Can Follower Graphic */}
        <AnimatePresence>
          {canState.visible && (
            <motion.div
              onClick={canState.docked ? handleCanClick : undefined}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{
                opacity: 1,
                scale: canState.docked ? 0.9 : 1,
                x: canState.x,
                y: canState.y,
                rotate: canState.angle,
              }}
              exit={{ opacity: 0, scale: 0.4, transition: { duration: 0.25 } }}
              transition={{
                type: 'spring',
                stiffness: 420,
                damping: 26,
              }}
              className={`absolute z-40 -translate-x-1/2 -translate-y-1/2 ${
                canState.docked ? 'cursor-pointer hover:scale-110 pointer-events-auto' : 'pointer-events-none'
              }`}
              style={{
                left: 0,
                top: 0,
              }}
              title={canState.docked ? 'Click spray can to spray again!' : ''}
            >
              {/* Expanding Aerosol Mist Cone when actively spraying */}
              {canState.spraying && (
                <div
                  className="absolute -top-10 -left-16 w-24 h-20 pointer-events-none"
                  style={{
                    background: `radial-gradient(ellipse at 80% 80%, ${palette.primary}CC 0%, ${palette.secondary}66 40%, transparent 80%)`,
                    filter: 'blur(5px)',
                    transform: 'rotate(-25deg)',
                  }}
                />
              )}

              {/* Docked "READY TO SPRAY" mini tag */}
              {canState.docked && (
                <div className="absolute -top-6 -left-10 px-2 py-0.5 bg-[#111111] text-white rounded text-[9px] font-mono whitespace-nowrap shadow-sm border border-white/20 animate-bounce">
                  ⚡ SHAKE & SPRAY
                </div>
              )}

              {/* High-Impact Detailed Vector Spray Can */}
              <div className="relative w-12 h-22 filter drop-shadow-[4px_5px_0px_#111111]">
                {/* Spray Nozzle Button & Actuator */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-2 border-[#111111] rounded-t-sm flex items-center justify-center">
                  <div
                    className={`w-2 h-2 rounded-full border border-black ${
                      canState.spraying ? 'bg-[#FF0055] animate-ping' : 'bg-[#111111]'
                    }`}
                  />
                </div>
                {/* Can Valve Stem */}
                <div className="absolute top-3.5 left-1/2 -translate-x-1/2 w-6 h-1.5 bg-gray-300 border-x-2 border-t-2 border-[#111111]" />
                {/* Can Upper Metallic Dome */}
                <div className="absolute top-4.5 left-1/2 -translate-x-1/2 w-9 h-3.5 bg-gray-200 border-2 border-[#111111] rounded-t-full" />
                {/* Can Cylindrical Body */}
                <div
                  className="absolute top-7 left-1/2 -translate-x-1/2 w-9 h-14 border-2 border-[#111111] rounded-b-md overflow-hidden flex flex-col justify-between p-1 shadow-inner"
                  style={{
                    background: `linear-gradient(135deg, ${palette.primaryLight} 0%, ${palette.primary} 50%, ${palette.secondary} 100%)`,
                  }}
                >
                  <div className="w-full h-1 bg-[#111111] rounded-xs opacity-80" />
                  <div className="text-[7.5px] font-black text-[#111111] text-center tracking-tighter uppercase leading-none font-mono">
                    THREAD
                  </div>
                  <div className="w-full flex justify-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-white border border-black" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#111111]" />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* Subtext Prompt */}
      <div className="mt-1 flex items-center gap-2 text-xs font-mono font-semibold text-[#5D5D59]">
        <Paintbrush size={13} className="text-[#8BAF00]" />
        <span>CLICK OR DRAG OVER THE WALL TO SPRAY PAINT PARTICLES</span>
      </div>
    </div>
  );
};
