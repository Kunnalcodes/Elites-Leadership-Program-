import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy,
  Flag,
  Zap,
  ArrowUp,
  ArrowDown,
  Minus,
  Search,
  Shield,
  Timer,
  ChevronRight,
  X,
  User,
  Award,
  Gauge,
  Flame,
  Sparkles,
  Lock,
  ArrowUpRight,
  SlidersHorizontal,
  CheckCircle2,
} from 'lucide-react';
import { api } from '../../api/client';
import Lanyard from '../Lanyard';

// Graceful WebGL check for 3D Lanyard pass in driver dossier
function checkWebGLSupport() {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

// Fallback seed cohort matching the authoritative Thread Elite database
const DEFAULT_DRIVERS = [
  {
    rank: 1,
    eliteId: 'usr-elite-001',
    fullName: 'Dhiraj Roy',
    eliteIdCode: 'ELITE-2026-001',
    avatarUrl: '/headshot-dhiraj.png',
    promotionLevel: { id: 'level-catalyst', name: 'Catalyst', slug: 'catalyst', colorHex: '#C8A65B' },
    totalXP: 2980,
    tasksCompleted: 42,
    rankChange: 0,
    podiumPlace: 'CHAMPION',
    wins: 38,
    matches: 42,
    winRate: 90,
    streak: 14,
    university: 'IIT Kharagpur',
    bio: 'Security researcher specializing in memory corruption, reverse engineering, and defensive architecture.',
    cardFront: '/card-front-dhiraj.png',
    recentTasks: [
      {
        taskId: 'task-001',
        title: 'Threat Modeling Architecture: Core Auth Subsystems',
        score: 98,
        maxScore: 100,
        status: 'GRADED',
        xpAwarded: 350,
      },
      {
        taskId: 'task-002',
        title: 'Defensive Engineering Lab: Reverse Proxy & WAF Hardening',
        score: 96,
        maxScore: 100,
        status: 'GRADED',
        xpAwarded: 500,
      },
      {
        taskId: 'task-004',
        title: 'Incident Response Simulation: Log Forensics & Memory Dump',
        score: 95,
        maxScore: 100,
        status: 'GRADED',
        xpAwarded: 600,
      },
    ],
  },
  {
    rank: 2,
    eliteId: 'usr-elite-002',
    fullName: 'Piyush Kumar',
    eliteIdCode: 'ELITE-2026-002',
    avatarUrl: '/headshot-piyush.png',
    promotionLevel: { id: 'level-catalyst', name: 'Catalyst', slug: 'catalyst', colorHex: '#A7ADB2' },
    totalXP: 2840,
    tasksCompleted: 38,
    rankChange: 0,
    podiumPlace: 'RUNNER_UP',
    wins: 32,
    matches: 38,
    winRate: 84,
    streak: 11,
    university: 'NIT Trichy',
    bio: 'Cloud security practitioner, cloud-native telemetry enthusiast, and container isolation researcher.',
    cardFront: '/card-front-piyush.png',
    recentTasks: [
      {
        taskId: 'task-001',
        title: 'Threat Modeling Architecture: Core Auth Subsystems',
        score: 92,
        maxScore: 100,
        status: 'GRADED',
        xpAwarded: 350,
      },
      {
        taskId: 'task-003',
        title: 'Executive Briefing: Zero Trust & C-Suite Risk Strategy',
        score: 90,
        maxScore: 100,
        status: 'GRADED',
        xpAwarded: 400,
      },
    ],
  },
  {
    rank: 3,
    eliteId: 'usr-elite-003',
    fullName: 'Kalpana Sharma',
    eliteIdCode: 'ELITE-2026-003',
    avatarUrl: '/headshot-kalpana.png',
    promotionLevel: { id: 'level-catalyst', name: 'Catalyst', slug: 'catalyst', colorHex: '#9E7A5A' },
    totalXP: 2710,
    tasksCompleted: 36,
    rankChange: 0,
    podiumPlace: 'THIRD_PLACE',
    wins: 29,
    matches: 36,
    winRate: 81,
    streak: 9,
    university: 'BITS Pilani',
    bio: 'Cryptographic protocol designer and web security analyst focused on zero-knowledge proofs and secure enclave systems.',
    cardFront: '/card-front-kalpana.png',
    recentTasks: [
      {
        taskId: 'task-001',
        title: 'Threat Modeling Architecture: Core Auth Subsystems',
        score: 88,
        maxScore: 100,
        status: 'GRADED',
        xpAwarded: 350,
      },
      {
        taskId: 'task-002',
        title: 'Defensive Engineering Lab: Reverse Proxy & WAF Hardening',
        score: 92,
        maxScore: 100,
        status: 'GRADED',
        xpAwarded: 500,
      },
    ],
  },
];

// Helper to resolve driver photos reliably
function resolveDriverAvatar(driver) {
  if (!driver) return '/emblem-shield.png';
  const nameLower = (driver.fullName || '').toLowerCase();
  const codeLower = (driver.eliteIdCode || '').toLowerCase();
  if (nameLower.includes('dhiraj') || codeLower.includes('001')) return '/headshot-dhiraj.png';
  if (nameLower.includes('piyush') || codeLower.includes('002')) return '/headshot-piyush.png';
  if (nameLower.includes('kalpana') || codeLower.includes('003')) return '/headshot-kalpana.png';
  return driver.avatarUrl || '/emblem-shield.png';
}

function resolveCardFront(driver) {
  if (!driver) return '/card-front-dhiraj.png';
  const nameLower = (driver.fullName || '').toLowerCase();
  const codeLower = (driver.eliteIdCode || '').toLowerCase();
  if (nameLower.includes('dhiraj') || codeLower.includes('001')) return '/card-front-dhiraj.png';
  if (nameLower.includes('piyush') || codeLower.includes('002')) return '/card-front-piyush.png';
  if (nameLower.includes('kalpana') || codeLower.includes('003')) return '/card-front-kalpana.png';
  return '/card-front-dhiraj.png';
}

export function ChampionshipLeaderboard({ currentUser: initialUser }) {
  const [drivers, setDrivers] = useState(DEFAULT_DRIVERS);
  const [currentUser, setCurrentUser] = useState(initialUser || null);
  const [loading, setLoading] = useState(true);
  const [inspectedDriver, setInspectedDriver] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTier, setSelectedTier] = useState('ALL');
  const [sortBy, setSortBy] = useState('POINTS'); // 'POINTS' | 'WINS' | 'MATCHES' | 'WIN_RATE'
  const [sortDirection, setSortDirection] = useState('DESC');
  const [hasWebGL, setHasWebGL] = useState(true);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, active: false });

  // Season metadata
  const [seasonMeta, setSeasonMeta] = useState({
    series: 'THREAD ELITE / COMPETITIVE SERIES',
    title: 'DRIVER STANDINGS',
    supportingText: 'The grid is set. Every point matters.',
    seasonNumber: 1,
    seasonName: 'Season 1 · 2026 Cohort',
    status: 'ACTIVE',
    startDate: '2026-01-01T00:00:00.000Z',
    endDate: '2026-12-31T23:59:59.000Z',
    totalRegisteredDrivers: 3,
    activeCompetitors: 3,
    totalMatchesPlayed: 42,
    totalVictories: 38,
    avgPointsPerMatch: 245,
  });

  // Check WebGL capability
  useEffect(() => {
    setHasWebGL(checkWebGLSupport());
  }, []);

  // Fetch Session & Authoritative Leaderboard Standings
  const loadLeaderboardData = useCallback(async () => {
    try {
      setLoading(true);

      // Fetch user session if not already provided
      if (!initialUser) {
        try {
          const sessionRes = await api.getSession();
          if (sessionRes?.data?.authenticated && sessionRes.data.user) {
            setCurrentUser(sessionRes.data.user);
          }
        } catch {
          // Guest user - not logged in
        }
      } else {
        setCurrentUser(initialUser);
      }

      // Fetch live standings from API
      const lbRes = await api.getLeaderboard();
      if (lbRes?.data && Array.isArray(lbRes.data) && lbRes.data.length > 0) {
        setDrivers(lbRes.data);
      }

      // Fetch metadata
      if (lbRes?.meta) {
        setSeasonMeta((prev) => ({ ...prev, ...lbRes.meta }));
      } else {
        try {
          const metaRes = await api.getChampionshipMeta();
          if (metaRes?.data) {
            setSeasonMeta(metaRes.data);
          }
        } catch {
          // Use default meta
        }
      }
    } catch {
      // Use fallback defaults
    } finally {
      setLoading(false);
    }
  }, [initialUser]);

  useEffect(() => {
    loadLeaderboardData();
  }, [loadLeaderboardData]);

  // Real-time Countdown Timer to the actual configured season end date
  useEffect(() => {
    if (!seasonMeta?.endDate) return;

    const targetDate = new Date(seasonMeta.endDate).getTime();

    const updateCountdown = () => {
      const now = Date.now();
      const difference = targetDate - now;

      if (difference <= 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0, active: false });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setCountdown({ days, hours, minutes, seconds, active: true });
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [seasonMeta?.endDate]);

  // Handle ESC key for modal dismissal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setInspectedDriver(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filter & Sort Drivers for Global Classification
  const filteredDrivers = useMemo(() => {
    let result = [...drivers];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(
        (d) =>
          (d.fullName || '').toLowerCase().includes(query) ||
          (d.eliteIdCode || '').toLowerCase().includes(query) ||
          (d.university || '').toLowerCase().includes(query)
      );
    }

    // Tier filter
    if (selectedTier !== 'ALL') {
      result = result.filter((d) => d.promotionLevel?.slug === selectedTier.toLowerCase());
    }

    // Sort criteria
    result.sort((a, b) => {
      let valA = a.totalXP || 0;
      let valB = b.totalXP || 0;

      if (sortBy === 'WINS') {
        valA = a.wins || 0;
        valB = b.wins || 0;
      } else if (sortBy === 'MATCHES') {
        valA = a.matches || 0;
        valB = b.matches || 0;
      } else if (sortBy === 'WIN_RATE') {
        valA = a.winRate || 0;
        valB = b.winRate || 0;
      }

      return sortDirection === 'DESC' ? valB - valA : valA - valB;
    });

    return result;
  }, [drivers, searchQuery, selectedTier, sortBy, sortDirection]);

  // Top 3 Podium Drivers (calculated from overall live standing)
  const topThree = useMemo(() => {
    const sorted = [...drivers].sort((a, b) => (b.totalXP || 0) - (a.totalXP || 0));
    return {
      p1: sorted[0] || null,
      p2: sorted[1] || null,
      p3: sorted[2] || null,
    };
  }, [drivers]);

  // Currently logged-in driver's race position data
  const personalRacePosition = useMemo(() => {
    if (!currentUser) return null;

    const sorted = [...drivers].sort((a, b) => (b.totalXP || 0) - (a.totalXP || 0));
    const userIndex = sorted.findIndex(
      (d) =>
        d.eliteId === currentUser.id ||
        (currentUser.eliteId && d.eliteIdCode === currentUser.eliteId) ||
        (currentUser.email && d.fullName?.toLowerCase() === currentUser.fullName?.toLowerCase())
    );

    if (userIndex === -1) {
      // Driver is not ranked in top entries yet
      return {
        isRanked: false,
        driver: currentUser,
      };
    }

    const currentDriver = sorted[userIndex];
    const driverAhead = userIndex > 0 ? sorted[userIndex - 1] : null;
    const driverBelow = userIndex < sorted.length - 1 ? sorted[userIndex + 1] : null;

    const gapToAhead = driverAhead ? (driverAhead.totalXP || 0) - (currentDriver.totalXP || 0) : 0;
    const gapToBelow = driverBelow ? (currentDriver.totalXP || 0) - (driverBelow.totalXP || 0) : 0;

    // Progress percentage towards overtaking next driver
    let gapProgressPct = 100;
    if (driverAhead) {
      const benchmarkPrev = driverBelow ? driverBelow.totalXP || 0 : currentDriver.totalXP * 0.8;
      const totalSpan = (driverAhead.totalXP || 0) - benchmarkPrev;
      const currentSpan = (currentDriver.totalXP || 0) - benchmarkPrev;
      gapProgressPct = totalSpan > 0 ? Math.min(100, Math.max(10, Math.round((currentSpan / totalSpan) * 100))) : 80;
    }

    return {
      isRanked: true,
      rank: userIndex + 1,
      driver: currentDriver,
      driverAhead,
      driverBelow,
      gapToAhead,
      gapToBelow,
      gapProgressPct,
    };
  }, [currentUser, drivers]);

  return (
    <div className="w-full bg-[#101112] text-[#F3F4F4] min-h-screen relative overflow-hidden font-sans selection:bg-[#E10600] selection:text-white">
      {/* Decorative Technical Background Elements */}
      <div className="absolute inset-0 pointer-events-none opacity-25 overflow-hidden">
        {/* Subtle Racing Grid Texture */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(#34383A 1px, transparent 1px), linear-gradient(90deg, #34383A 1px, transparent 1px)`,
            backgroundSize: '48px 48px',
            opacity: 0.18,
          }}
        />

        {/* F1 Circuit Contour Watermark (Subtle stylized track curve) */}
        <svg
          className="absolute -top-32 -right-40 w-[900px] h-[900px] text-[#34383A]/20"
          viewBox="0 0 800 800"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M 150,450 C 120,300 250,150 400,150 C 550,150 680,220 700,350 C 720,480 620,550 500,560 C 380,570 340,650 250,680 C 160,710 120,600 150,450 Z"
            stroke="currentColor"
            strokeWidth="3"
            strokeDasharray="12 12"
          />
          <path
            d="M 180,440 C 150,320 270,180 400,180 C 530,180 650,240 670,360 C 690,460 600,520 480,530 C 360,540 320,620 230,650 C 150,680 140,580 180,440 Z"
            stroke="#E10600"
            strokeWidth="1.5"
            strokeOpacity="0.3"
          />
        </svg>

        {/* Ambient Top Light Beam */}
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-b from-[#E10600]/10 via-[#222628]/20 to-transparent blur-3xl pointer-events-none" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 relative z-10">
        
        {/* ============================================================== */}
        {/* 2. CHAMPIONSHIP HEADER                                         */}
        {/* ============================================================== */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 border-b border-[#34383A] pb-8 relative"
        >
          {/* Top Series Flag & Status Strip */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-6 bg-[#E10600] inline-block skew-x-[-15deg]" />
              <span className="font-mono text-xs sm:text-sm tracking-[0.25em] text-[#A7ADB2] uppercase font-bold">
                {seasonMeta.series}
              </span>
            </div>

            {/* Live Competition Status */}
            <div className="flex items-center gap-4">
              {seasonMeta.status === 'ACTIVE' && (
                <div className="flex items-center gap-2 px-3 py-1 bg-[#191C1E] border border-[#34383A] rounded-full">
                  <span className="w-2 h-2 rounded-full bg-[#E10600] animate-ping" />
                  <span className="w-2 h-2 rounded-full bg-[#E10600] -ml-4" />
                  <span className="text-[11px] font-mono font-bold tracking-wider text-[#F3F4F4] uppercase">
                    CHAMPIONSHIP LIVE
                  </span>
                </div>
              )}

              <span className="text-[11px] font-mono text-[#8A9094] border border-[#34383A] px-2.5 py-1 rounded bg-[#191C1E]">
                {seasonMeta.seasonName}
              </span>
            </div>
          </div>

          {/* Main Title & Supporting Hook */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
            <div className="lg:col-span-8">
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white uppercase font-['Oswald'] leading-[0.95] mb-3">
                {seasonMeta.title}
              </h1>
              <p className="text-base sm:text-lg text-[#8A9094] font-medium tracking-wide">
                "{seasonMeta.supportingText}"
              </p>
            </div>

            {/* Real-time Season Countdown Clock */}
            <div className="lg:col-span-4 flex flex-col items-start lg:items-end justify-end">
              <div className="bg-[#191C1E] border border-[#34383A] rounded-xl p-3.5 w-full sm:w-auto shadow-xl">
                <div className="flex items-center gap-2 mb-2 text-[10px] font-mono text-[#8A9094] uppercase tracking-wider">
                  <Timer className="w-3.5 h-3.5 text-[#E10600]" />
                  <span>SEASON CLOCK // TIME TO CHEQUERED FLAG</span>
                </div>
                {countdown.active ? (
                  <div className="flex items-center gap-2 font-mono text-white text-lg sm:text-xl font-bold">
                    <div className="bg-[#222628] px-2 py-1 rounded border border-[#34383A]">
                      {String(countdown.days).padStart(2, '0')}<span className="text-[10px] text-[#8A9094] ml-1">D</span>
                    </div>
                    <span>:</span>
                    <div className="bg-[#222628] px-2 py-1 rounded border border-[#34383A]">
                      {String(countdown.hours).padStart(2, '0')}<span className="text-[10px] text-[#8A9094] ml-1">H</span>
                    </div>
                    <span>:</span>
                    <div className="bg-[#222628] px-2 py-1 rounded border border-[#34383A]">
                      {String(countdown.minutes).padStart(2, '0')}<span className="text-[10px] text-[#8A9094] ml-1">M</span>
                    </div>
                    <span>:</span>
                    <div className="bg-[#222628] px-2 py-1 rounded border border-[#34383A] text-[#E10600]">
                      {String(countdown.seconds).padStart(2, '0')}<span className="text-[10px] text-[#8A9094] ml-1">S</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-xs font-mono text-[#A7ADB2]">
                    REGULATION WINDOW FINALIZED · OFFICIAL LEDGER STANDING
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.header>

        {/* ============================================================== */}
        {/* 6. COMPETITIVE STATISTICS STRIP                                */}
        {/* ============================================================== */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-14"
        >
          <div className="bg-[#191C1E] border border-[#34383A] rounded-xl p-3.5 relative overflow-hidden group hover:border-[#E10600]/60 transition-colors">
            <span className="text-[10px] font-mono text-[#8A9094] uppercase tracking-wider block mb-1">
              TOTAL REGISTERED
            </span>
            <div className="text-2xl sm:text-3xl font-bold font-['Oswald'] text-white">
              {seasonMeta.totalRegisteredDrivers}
            </div>
            <div className="text-[10px] font-mono text-[#A7ADB2] mt-0.5">ELITE ROSTER</div>
            <div className="absolute top-0 right-0 w-12 h-1 bg-gradient-to-l from-[#34383A] to-transparent" />
          </div>

          <div className="bg-[#191C1E] border border-[#34383A] rounded-xl p-3.5 relative overflow-hidden group hover:border-[#E10600]/60 transition-colors">
            <span className="text-[10px] font-mono text-[#8A9094] uppercase tracking-wider block mb-1">
              ACTIVE COMPETITORS
            </span>
            <div className="text-2xl sm:text-3xl font-bold font-['Oswald'] text-[#E10600]">
              {seasonMeta.activeCompetitors}
            </div>
            <div className="text-[10px] font-mono text-[#A7ADB2] mt-0.5">ON STARTING GRID</div>
            <div className="absolute top-0 right-0 w-12 h-1 bg-[#E10600]" />
          </div>

          <div className="bg-[#191C1E] border border-[#34383A] rounded-xl p-3.5 relative overflow-hidden group hover:border-[#E10600]/60 transition-colors">
            <span className="text-[10px] font-mono text-[#8A9094] uppercase tracking-wider block mb-1">
              MATCHES DELIVERED
            </span>
            <div className="text-2xl sm:text-3xl font-bold font-['Oswald'] text-white">
              {seasonMeta.totalMatchesPlayed}
            </div>
            <div className="text-[10px] font-mono text-[#A7ADB2] mt-0.5">TECHNICAL MISSIONS</div>
          </div>

          <div className="bg-[#191C1E] border border-[#34383A] rounded-xl p-3.5 relative overflow-hidden group hover:border-[#C8A65B]/60 transition-colors">
            <span className="text-[10px] font-mono text-[#8A9094] uppercase tracking-wider block mb-1">
              CHAMPIONSHIP WINS
            </span>
            <div className="text-2xl sm:text-3xl font-bold font-['Oswald'] text-[#C8A65B]">
              {seasonMeta.totalVictories}
            </div>
            <div className="text-[10px] font-mono text-[#A7ADB2] mt-0.5">GRADE DISTINCTIONS</div>
          </div>

          <div className="col-span-2 sm:col-span-1 bg-[#191C1E] border border-[#34383A] rounded-xl p-3.5 relative overflow-hidden group hover:border-[#E10600]/60 transition-colors">
            <span className="text-[10px] font-mono text-[#8A9094] uppercase tracking-wider block mb-1">
              AVG POINTS / MATCH
            </span>
            <div className="text-2xl sm:text-3xl font-bold font-['Oswald'] text-white">
              {seasonMeta.avgPointsPerMatch} <span className="text-xs font-mono font-normal text-[#8A9094]">PTS</span>
            </div>
            <div className="text-[10px] font-mono text-[#A7ADB2] mt-0.5">TELEMETRY EFFICIENCY</div>
          </div>
        </motion.div>

        {/* ============================================================== */}
        {/* 3. CHAMPIONSHIP PODIUM — TOP 3                                 */}
        {/* ============================================================== */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8 pb-3 border-b border-[#34383A]">
            <div className="flex items-center gap-3">
              <Trophy className="w-5 h-5 text-[#C8A65B]" />
              <h2 className="text-xl sm:text-2xl font-bold font-['Oswald'] text-white uppercase tracking-wide">
                CHAMPIONSHIP PODIUM // TOP 3 CLASSIFICATION
              </h2>
            </div>
            <span className="text-[11px] font-mono text-[#8A9094] uppercase hidden sm:inline-block">
              CLICK DRIVER TO INSPECT PERFORMANCE TELEMETRY
            </span>
          </div>

          {/* Motorsport Podium Composition: P2 (Left), P1 (Elevated Center), P3 (Right) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end max-w-5xl mx-auto">
            
            {/* P2 — RUNNER-UP (Silver metallic details) */}
            {topThree.p2 && (
              <motion.button
                type="button"
                onClick={() => setInspectedDriver(topThree.p2)}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="w-full text-left bg-[#191C1E] border border-[#34383A] hover:border-[#A7ADB2] rounded-2xl p-6 transition-all duration-300 relative overflow-hidden flex flex-col justify-between group shadow-xl hover:-translate-y-1.5"
              >
                {/* Silver Accent Bar */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#A7ADB2]" />

                {/* Header: Position Badge & Designation */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="font-['Oswald'] text-3xl font-extrabold text-[#A7ADB2]">P2</span>
                    <span className="text-[10px] font-mono tracking-widest text-[#A7ADB2] uppercase font-bold border border-[#A7ADB2]/40 px-2 py-0.5 rounded">
                      RUNNER-UP
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-[#8A9094] group-hover:text-white flex items-center gap-1 transition-colors">
                    <span>TELEMETRY</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </div>

                {/* Driver Avatar & Name */}
                <div className="flex items-center gap-4 mb-5">
                  <div className="relative">
                    <img
                      src={resolveDriverAvatar(topThree.p2)}
                      alt={topThree.p2.fullName}
                      className="w-16 h-16 rounded-full object-cover border-2 border-[#A7ADB2] group-hover:scale-105 transition-transform"
                    />
                    <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#A7ADB2] text-black font-['Oswald'] text-xs font-bold flex items-center justify-center">
                      2
                    </span>
                  </div>
                  <div className="min-w-0">
                    <div className="text-xl font-bold font-['Oswald'] text-white uppercase truncate">
                      {topThree.p2.fullName}
                    </div>
                    <div className="text-xs font-mono text-[#A7ADB2] truncate">
                      {topThree.p2.eliteIdCode || 'ELITE-2026-002'}
                    </div>
                    <div className="text-[11px] font-mono text-[#8A9094] truncate">
                      {topThree.p2.university || 'NIT Trichy'}
                    </div>
                  </div>
                </div>

                {/* Points & Performance Box */}
                <div className="bg-[#222628] border border-[#34383A] rounded-xl p-3.5 mb-4">
                  <div className="text-[10px] font-mono text-[#8A9094] uppercase flex justify-between">
                    <span>CHAMPIONSHIP POINTS</span>
                    <span className="text-[#A7ADB2]">SECTOR 2</span>
                  </div>
                  <div className="font-['Oswald'] text-2xl font-bold text-white mt-0.5">
                    {(topThree.p2.totalXP || 0).toLocaleString()} <span className="text-xs text-[#8A9094] font-normal">PTS</span>
                  </div>
                </div>

                {/* Telemetry Metrics Row */}
                <div className="grid grid-cols-3 gap-2 pt-3 border-t border-[#34383A] text-center">
                  <div>
                    <span className="text-[9px] font-mono text-[#8A9094] block uppercase">WINS</span>
                    <span className="font-mono text-sm font-bold text-white">{topThree.p2.wins || 32}</span>
                  </div>
                  <div>
                    <span className="text-[9px] font-mono text-[#8A9094] block uppercase">MATCHES</span>
                    <span className="font-mono text-sm font-bold text-white">{topThree.p2.matches || 38}</span>
                  </div>
                  <div>
                    <span className="text-[9px] font-mono text-[#8A9094] block uppercase">WIN RATE</span>
                    <span className="font-mono text-sm font-bold text-[#A7ADB2]">{topThree.p2.winRate || 84}%</span>
                  </div>
                </div>
              </motion.button>
            )}

            {/* P1 — CHAMPION (Elevated Center, Gold metallic details) */}
            {topThree.p1 && (
              <motion.button
                type="button"
                onClick={() => setInspectedDriver(topThree.p1)}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="w-full text-left bg-[#191C1E] border-2 border-[#C8A65B] rounded-2xl p-7 transition-all duration-300 relative overflow-hidden flex flex-col justify-between group shadow-2xl shadow-[#C8A65B]/15 hover:-translate-y-2 md:-mb-3 z-10"
              >
                {/* Championship Gold Crown Accent Bar */}
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#C8A65B] via-[#E5C985] to-[#C8A65B]" />

                {/* Champion Designation Banner */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="font-['Oswald'] text-4xl font-extrabold text-[#C8A65B]">P1</span>
                    <div className="px-2.5 py-0.5 rounded bg-[#C8A65B]/20 border border-[#C8A65B] flex items-center gap-1.5">
                      <Trophy className="w-3.5 h-3.5 text-[#C8A65B]" />
                      <span className="text-[10px] font-mono font-bold tracking-widest text-[#C8A65B] uppercase">
                        CHAMPION
                      </span>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono text-[#C8A65B] flex items-center gap-1 font-bold">
                    <span>POLE POSITION</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </div>

                {/* Driver Avatar & Name */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative">
                    <img
                      src={resolveDriverAvatar(topThree.p1)}
                      alt={topThree.p1.fullName}
                      className="w-20 h-20 rounded-full object-cover border-3 border-[#C8A65B] ring-4 ring-[#C8A65B]/20 group-hover:scale-105 transition-transform"
                    />
                    <span className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#C8A65B] text-black font-['Oswald'] text-sm font-extrabold flex items-center justify-center shadow-lg">
                      1
                    </span>
                  </div>
                  <div className="min-w-0">
                    <div className="text-2xl font-bold font-['Oswald'] text-white uppercase truncate tracking-tight">
                      {topThree.p1.fullName}
                    </div>
                    <div className="text-xs font-mono text-[#C8A65B] font-bold truncate">
                      {topThree.p1.eliteIdCode || 'ELITE-2026-001'}
                    </div>
                    <div className="text-xs font-mono text-[#8A9094] truncate">
                      {topThree.p1.university || 'IIT Kharagpur'}
                    </div>
                  </div>
                </div>

                {/* Points & Performance Box */}
                <div className="bg-[#222628] border border-[#C8A65B]/50 rounded-xl p-4 mb-4 relative overflow-hidden">
                  <div className="text-[10px] font-mono text-[#8A9094] uppercase flex justify-between">
                    <span>LEADER PTS</span>
                    <span className="text-[#C8A65B] font-bold">GAP: POLE</span>
                  </div>
                  <div className="font-['Oswald'] text-3xl font-extrabold text-white mt-0.5">
                    {(topThree.p1.totalXP || 0).toLocaleString()} <span className="text-sm text-[#C8A65B] font-normal">PTS</span>
                  </div>
                  <div className="w-full bg-[#191C1E] h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-[#C8A65B] w-full" />
                  </div>
                </div>

                {/* Telemetry Metrics Row */}
                <div className="grid grid-cols-4 gap-2 pt-3 border-t border-[#34383A] text-center">
                  <div>
                    <span className="text-[9px] font-mono text-[#8A9094] block uppercase">WINS</span>
                    <span className="font-mono text-sm font-bold text-white">{topThree.p1.wins || 38}</span>
                  </div>
                  <div>
                    <span className="text-[9px] font-mono text-[#8A9094] block uppercase">MATCHES</span>
                    <span className="font-mono text-sm font-bold text-white">{topThree.p1.matches || 42}</span>
                  </div>
                  <div>
                    <span className="text-[9px] font-mono text-[#8A9094] block uppercase">WIN RATE</span>
                    <span className="font-mono text-sm font-bold text-[#C8A65B]">{topThree.p1.winRate || 90}%</span>
                  </div>
                  <div>
                    <span className="text-[9px] font-mono text-[#8A9094] block uppercase">STREAK</span>
                    <span className="font-mono text-sm font-bold text-[#E10600] flex items-center justify-center gap-0.5">
                      <Flame className="w-3 h-3 text-[#E10600]" />
                      {topThree.p1.streak || 14}d
                    </span>
                  </div>
                </div>
              </motion.button>
            )}

            {/* P3 — THIRD PLACE (Bronze / neutral metallic details) */}
            {topThree.p3 && (
              <motion.button
                type="button"
                onClick={() => setInspectedDriver(topThree.p3)}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="w-full text-left bg-[#191C1E] border border-[#34383A] hover:border-[#9E7A5A] rounded-2xl p-6 transition-all duration-300 relative overflow-hidden flex flex-col justify-between group shadow-xl hover:-translate-y-1.5"
              >
                {/* Bronze Accent Bar */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#9E7A5A]" />

                {/* Header: Position Badge & Designation */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="font-['Oswald'] text-3xl font-extrabold text-[#9E7A5A]">P3</span>
                    <span className="text-[10px] font-mono tracking-widest text-[#9E7A5A] uppercase font-bold border border-[#9E7A5A]/40 px-2 py-0.5 rounded">
                      THIRD PLACE
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-[#8A9094] group-hover:text-white flex items-center gap-1 transition-colors">
                    <span>TELEMETRY</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </div>

                {/* Driver Avatar & Name */}
                <div className="flex items-center gap-4 mb-5">
                  <div className="relative">
                    <img
                      src={resolveDriverAvatar(topThree.p3)}
                      alt={topThree.p3.fullName}
                      className="w-16 h-16 rounded-full object-cover border-2 border-[#9E7A5A] group-hover:scale-105 transition-transform"
                    />
                    <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#9E7A5A] text-black font-['Oswald'] text-xs font-bold flex items-center justify-center">
                      3
                    </span>
                  </div>
                  <div className="min-w-0">
                    <div className="text-xl font-bold font-['Oswald'] text-white uppercase truncate">
                      {topThree.p3.fullName}
                    </div>
                    <div className="text-xs font-mono text-[#9E7A5A] truncate">
                      {topThree.p3.eliteIdCode || 'ELITE-2026-003'}
                    </div>
                    <div className="text-[11px] font-mono text-[#8A9094] truncate">
                      {topThree.p3.university || 'BITS Pilani'}
                    </div>
                  </div>
                </div>

                {/* Points & Performance Box */}
                <div className="bg-[#222628] border border-[#34383A] rounded-xl p-3.5 mb-4">
                  <div className="text-[10px] font-mono text-[#8A9094] uppercase flex justify-between">
                    <span>CHAMPIONSHIP POINTS</span>
                    <span className="text-[#9E7A5A]">SECTOR 3</span>
                  </div>
                  <div className="font-['Oswald'] text-2xl font-bold text-white mt-0.5">
                    {(topThree.p3.totalXP || 0).toLocaleString()} <span className="text-xs text-[#8A9094] font-normal">PTS</span>
                  </div>
                </div>

                {/* Telemetry Metrics Row */}
                <div className="grid grid-cols-3 gap-2 pt-3 border-t border-[#34383A] text-center">
                  <div>
                    <span className="text-[9px] font-mono text-[#8A9094] block uppercase">WINS</span>
                    <span className="font-mono text-sm font-bold text-white">{topThree.p3.wins || 29}</span>
                  </div>
                  <div>
                    <span className="text-[9px] font-mono text-[#8A9094] block uppercase">MATCHES</span>
                    <span className="font-mono text-sm font-bold text-white">{topThree.p3.matches || 36}</span>
                  </div>
                  <div>
                    <span className="text-[9px] font-mono text-[#8A9094] block uppercase">WIN RATE</span>
                    <span className="font-mono text-sm font-bold text-[#9E7A5A]">{topThree.p3.winRate || 81}%</span>
                  </div>
                </div>
              </motion.button>
            )}

          </div>
        </section>

        {/* ============================================================== */}
        {/* 5. PERSONAL DRIVER CARD (`YOUR RACE POSITION`)                 */}
        {/* ============================================================== */}
        <section className="mb-14">
          <div className="bg-[#191C1E] border border-[#34383A] rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
            {/* Red Motorsport Top Highlight Bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-[#E10600]" />

            <div className="flex items-center justify-between pb-4 border-b border-[#34383A] mb-6">
              <div className="flex items-center gap-3">
                <Gauge className="w-5 h-5 text-[#E10600]" />
                <h2 className="text-xl sm:text-2xl font-bold font-['Oswald'] text-white uppercase tracking-wide">
                  YOUR RACE POSITION // DRIVER TELEMETRY
                </h2>
              </div>

              {personalRacePosition?.isRanked && (
                <span className="text-xs font-mono px-3 py-1 bg-[#E10600]/15 text-[#E10600] border border-[#E10600]/40 rounded-full font-bold uppercase tracking-wider">
                  ACTIVE ON GRID · P{personalRacePosition.rank}
                </span>
              )}
            </div>

            {personalRacePosition?.isRanked ? (
              <div className="space-y-6">
                {/* Driver Summary Row */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                  <div className="bg-[#222628] border border-[#34383A] rounded-xl p-3">
                    <span className="text-[10px] font-mono text-[#8A9094] uppercase block">CURRENT RANK</span>
                    <div className="font-['Oswald'] text-2xl font-bold text-white mt-0.5">
                      P{personalRacePosition.rank}
                    </div>
                  </div>

                  <div className="bg-[#222628] border border-[#34383A] rounded-xl p-3">
                    <span className="text-[10px] font-mono text-[#8A9094] uppercase block">TOTAL POINTS</span>
                    <div className="font-['Oswald'] text-2xl font-bold text-[#E10600] mt-0.5">
                      {(personalRacePosition.driver.totalXP || 0).toLocaleString()} <span className="text-xs text-[#8A9094]">PTS</span>
                    </div>
                  </div>

                  <div className="bg-[#222628] border border-[#34383A] rounded-xl p-3">
                    <span className="text-[10px] font-mono text-[#8A9094] uppercase block">VICTORIES</span>
                    <div className="font-['Oswald'] text-2xl font-bold text-white mt-0.5">
                      {personalRacePosition.driver.wins || 0}
                    </div>
                  </div>

                  <div className="bg-[#222628] border border-[#34383A] rounded-xl p-3">
                    <span className="text-[10px] font-mono text-[#8A9094] uppercase block">MATCHES</span>
                    <div className="font-['Oswald'] text-2xl font-bold text-white mt-0.5">
                      {personalRacePosition.driver.matches || 0}
                    </div>
                  </div>

                  <div className="bg-[#222628] border border-[#34383A] rounded-xl p-3">
                    <span className="text-[10px] font-mono text-[#8A9094] uppercase block">WIN RATE</span>
                    <div className="font-['Oswald'] text-2xl font-bold text-white mt-0.5">
                      {personalRacePosition.driver.winRate || 0}%
                    </div>
                  </div>

                  <div className="bg-[#222628] border border-[#34383A] rounded-xl p-3">
                    <span className="text-[10px] font-mono text-[#8A9094] uppercase block">MOVEMENT</span>
                    <div className="font-mono text-sm font-bold mt-1 flex items-center gap-1.5">
                      {personalRacePosition.driver.rankChange > 0 ? (
                        <span className="text-emerald-400 flex items-center gap-0.5">
                          <ArrowUp className="w-4 h-4" /> +{personalRacePosition.driver.rankChange} POS
                        </span>
                      ) : personalRacePosition.driver.rankChange < 0 ? (
                        <span className="text-[#E10600] flex items-center gap-0.5">
                          <ArrowDown className="w-4 h-4" /> {personalRacePosition.driver.rankChange} POS
                        </span>
                      ) : (
                        <span className="text-[#8A9094] flex items-center gap-1">
                          <Minus className="w-3.5 h-3.5" /> STABLE
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Competitive Progression: GAP TO NEXT POSITION */}
                <div className="bg-[#222628] border border-[#34383A] rounded-xl p-4 sm:p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-[#E10600]" />
                      <span className="font-['Oswald'] text-base uppercase text-white font-bold tracking-wide">
                        GAP TO NEXT POSITION
                      </span>
                    </div>

                    <div className="text-xs font-mono text-[#8A9094]">
                      {personalRacePosition.driverAhead ? (
                        <span>
                          <strong className="text-white">{personalRacePosition.gapToAhead} PTS</strong> to overtake{' '}
                          <span className="text-[#E10600] font-bold">
                            P{personalRacePosition.rank - 1} ({personalRacePosition.driverAhead.fullName})
                          </span>
                        </span>
                      ) : (
                        <span className="text-[#C8A65B] font-bold">
                          LEADING CHAMPIONSHIP · POLE POSITION DEFENDED (+{personalRacePosition.gapToBelow} PTS AHEAD OF P2)
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Horizontal Progress Bar */}
                  <div className="w-full bg-[#101112] h-3 rounded-full overflow-hidden border border-[#34383A]">
                    <div
                      className="h-full bg-gradient-to-r from-[#E10600] to-[#C8A65B] rounded-full transition-all duration-700 ease-out"
                      style={{ width: `${personalRacePosition.gapProgressPct}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between mt-2 text-[10px] font-mono text-[#8A9094]">
                    <span>
                      {personalRacePosition.driverBelow ? `P${personalRacePosition.rank + 1} (${personalRacePosition.driverBelow.fullName}): -${personalRacePosition.gapToBelow} PTS` : 'DEFENDING REAR'}
                    </span>
                    <span>
                      {personalRacePosition.driverAhead ? `TARGET P${personalRacePosition.rank - 1}: ${(personalRacePosition.driverAhead.totalXP || 0).toLocaleString()} PTS` : 'CHAMPIONSHIP TARGET ACHIEVED'}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              /* Empty State for unauthenticated visitors */
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6 py-4">
                <div>
                  <h3 className="font-['Oswald'] text-xl font-bold text-white uppercase mb-1">
                    AUTHENTICATE TO ACCESS YOUR RACE TELEMETRY
                  </h3>
                  <p className="text-sm text-[#8A9094] max-w-xl">
                    Log in with your official Elite Driver credentials to view your live grid standing, points gap to the next position, and telemetry history.
                  </p>
                </div>
                <Link
                  to="/login"
                  className="px-6 py-3 bg-[#E10600] hover:bg-[#c00500] text-white font-mono text-xs font-bold uppercase tracking-wider rounded-lg border border-[#ff4742] shadow-[0_0_20px_rgba(225,6,0,0.35)] flex items-center gap-2 transition-all shrink-0 hover:-translate-y-0.5"
                >
                  <Lock className="w-4 h-4" />
                  <span>ACCESS DRIVER PORTAL</span>
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* ============================================================== */}
        {/* 4. GLOBAL CLASSIFICATION TABLE                                 */}
        {/* ============================================================== */}
        <section className="mb-14">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 pb-4 border-b border-[#34383A]">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Flag className="w-4 h-4 text-[#E10600]" />
                <span className="text-xs font-mono text-[#8A9094] uppercase tracking-widest">
                  AUTHORITATIVE STANDINGS
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold font-['Oswald'] text-white uppercase tracking-tight">
                GLOBAL CLASSIFICATION
              </h2>
              <p className="text-xs sm:text-sm text-[#8A9094]">
                All drivers · Ranked by championship performance
              </p>
            </div>

            {/* Filtering & Discovery Control Bar (Section 7) */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Search by Username / Elite ID */}
              <div className="relative min-w-[200px] sm:min-w-[240px]">
                <Search className="w-3.5 h-3.5 text-[#8A9094] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter driver or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#191C1E] border border-[#34383A] focus:border-[#E10600] rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-[#8A9094] font-mono focus:outline-none transition-colors"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8A9094] hover:text-white"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Sort Segmented Controls */}
              <div className="flex items-center bg-[#191C1E] border border-[#34383A] rounded-lg p-1 text-xs font-mono">
                <button
                  type="button"
                  onClick={() => {
                    if (sortBy === 'POINTS') setSortDirection((d) => (d === 'DESC' ? 'ASC' : 'DESC'));
                    else {
                      setSortBy('POINTS');
                      setSortDirection('DESC');
                    }
                  }}
                  className={`px-3 py-1 rounded transition-colors ${
                    sortBy === 'POINTS' ? 'bg-[#222628] text-white font-bold border border-[#34383A]' : 'text-[#8A9094] hover:text-white'
                  }`}
                >
                  POINTS {sortBy === 'POINTS' && (sortDirection === 'DESC' ? '↓' : '↑')}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (sortBy === 'WINS') setSortDirection((d) => (d === 'DESC' ? 'ASC' : 'DESC'));
                    else {
                      setSortBy('WINS');
                      setSortDirection('DESC');
                    }
                  }}
                  className={`px-3 py-1 rounded transition-colors ${
                    sortBy === 'WINS' ? 'bg-[#222628] text-white font-bold border border-[#34383A]' : 'text-[#8A9094] hover:text-white'
                  }`}
                >
                  WINS {sortBy === 'WINS' && (sortDirection === 'DESC' ? '↓' : '↑')}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (sortBy === 'WIN_RATE') setSortDirection((d) => (d === 'DESC' ? 'ASC' : 'DESC'));
                    else {
                      setSortBy('WIN_RATE');
                      setSortDirection('DESC');
                    }
                  }}
                  className={`px-3 py-1 rounded transition-colors ${
                    sortBy === 'WIN_RATE' ? 'bg-[#222628] text-white font-bold border border-[#34383A]' : 'text-[#8A9094] hover:text-white'
                  }`}
                >
                  RATE {sortBy === 'WIN_RATE' && (sortDirection === 'DESC' ? '↓' : '↑')}
                </button>
              </div>
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-[#191C1E] border border-[#34383A] rounded-2xl overflow-hidden shadow-2xl">
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#222628] border-b border-[#34383A] text-[10px] font-mono text-[#8A9094] uppercase tracking-wider">
                    <th className="py-3 px-4 w-16 text-center">POS</th>
                    <th className="py-3 px-3 w-16 text-center">DIFF</th>
                    <th className="py-3 px-4">DRIVER</th>
                    <th className="py-3 px-4">ELITE ID</th>
                    <th className="py-3 px-4 text-center">WINS</th>
                    <th className="py-3 px-4 text-center">MATCHES</th>
                    <th className="py-3 px-4 text-center">WIN RATE</th>
                    <th className="py-3 px-4 text-right">POINTS</th>
                    <th className="py-3 px-4 text-center">STREAK</th>
                    <th className="py-3 px-4 text-right">INSPECT</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#34383A]/50">
                  {filteredDrivers.map((driver) => {
                    const isCurrentUser =
                      currentUser &&
                      (driver.eliteId === currentUser.id ||
                        (currentUser.eliteId && driver.eliteIdCode === currentUser.eliteId) ||
                        (currentUser.email && driver.fullName?.toLowerCase() === currentUser.fullName?.toLowerCase()));

                    const isChampion = driver.rank === 1;
                    const isP2 = driver.rank === 2;
                    const isP3 = driver.rank === 3;

                    return (
                      <tr
                        key={driver.eliteId}
                        onClick={() => setInspectedDriver(driver)}
                        className={`transition-colors cursor-pointer group ${
                          isCurrentUser
                            ? 'bg-[#E10600]/10 hover:bg-[#E10600]/15 border-l-4 border-[#E10600]'
                            : isChampion
                            ? 'bg-[#C8A65B]/5 hover:bg-[#C8A65B]/10'
                            : 'hover:bg-[#222628]/70'
                        }`}
                      >
                        {/* Position */}
                        <td className="py-4 px-4 text-center">
                          <span
                            className={`font-['Oswald'] text-xl font-bold inline-block ${
                              isChampion
                                ? 'text-[#C8A65B]'
                                : isP2
                                ? 'text-[#A7ADB2]'
                                : isP3
                                ? 'text-[#9E7A5A]'
                                : 'text-white'
                            }`}
                          >
                            P{driver.rank}
                          </span>
                        </td>

                        {/* Position Movement (Diff) */}
                        <td className="py-4 px-3 text-center font-mono text-xs">
                          {driver.rankChange > 0 ? (
                            <span className="text-emerald-400 flex items-center justify-center gap-0.5">
                              <ArrowUp className="w-3.5 h-3.5" />
                              <span>{driver.rankChange}</span>
                            </span>
                          ) : driver.rankChange < 0 ? (
                            <span className="text-[#E10600] flex items-center justify-center gap-0.5">
                              <ArrowDown className="w-3.5 h-3.5" />
                              <span>{Math.abs(driver.rankChange)}</span>
                            </span>
                          ) : (
                            <span className="text-[#8A9094] flex items-center justify-center">
                              <Minus className="w-3 h-3" />
                            </span>
                          )}
                        </td>

                        {/* Driver Name & Avatar */}
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={resolveDriverAvatar(driver)}
                              alt={driver.fullName}
                              className={`w-9 h-9 rounded-full object-cover border transition-transform group-hover:scale-105 ${
                                isChampion
                                  ? 'border-[#C8A65B]'
                                  : isP2
                                  ? 'border-[#A7ADB2]'
                                  : isP3
                                  ? 'border-[#9E7A5A]'
                                  : 'border-[#34383A]'
                              }`}
                            />
                            <div>
                              <div className="font-['Oswald'] text-base font-bold text-white uppercase group-hover:text-[#E10600] transition-colors flex items-center gap-2">
                                <span>{driver.fullName}</span>
                                {isCurrentUser && (
                                  <span className="px-1.5 py-0.2 bg-[#E10600] text-white text-[9px] font-mono rounded font-black tracking-widest">
                                    YOU
                                  </span>
                                )}
                              </div>
                              <span className="text-xs font-mono text-[#8A9094] block">
                                {driver.university || 'Thread Elite Cadet'}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Elite ID */}
                        <td className="py-4 px-4 font-mono text-xs text-[#A7ADB2]">
                          {driver.eliteIdCode || '—'}
                        </td>

                        {/* Wins */}
                        <td className="py-4 px-4 text-center font-mono text-sm font-semibold text-white">
                          {driver.wins || 0}
                        </td>

                        {/* Matches */}
                        <td className="py-4 px-4 text-center font-mono text-sm text-[#A7ADB2]">
                          {driver.matches || 0}
                        </td>

                        {/* Win Rate */}
                        <td className="py-4 px-4 text-center font-mono text-sm font-semibold text-white">
                          {driver.winRate || 0}%
                        </td>

                        {/* Points */}
                        <td className="py-4 px-4 text-right">
                          <span
                            className={`font-['Oswald'] text-xl font-bold ${
                              isChampion ? 'text-[#C8A65B]' : 'text-white'
                            }`}
                          >
                            {(driver.totalXP || 0).toLocaleString()}
                          </span>
                          <span className="text-[10px] font-mono text-[#8A9094] ml-1">PTS</span>
                        </td>

                        {/* Streak */}
                        <td className="py-4 px-4 text-center font-mono text-xs text-white">
                          <span className="inline-flex items-center gap-1 bg-[#222628] px-2 py-0.5 rounded border border-[#34383A]">
                            <Flame className="w-3 h-3 text-[#E10600]" />
                            {driver.streak || 0}d
                          </span>
                        </td>

                        {/* Inspect Chevron */}
                        <td className="py-4 px-4 text-right text-[#8A9094] group-hover:text-white transition-colors">
                          <ChevronRight className="w-4 h-4 inline-block" />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Responsive Classification Cards (Section 10) */}
            <div className="md:hidden divide-y divide-[#34383A]">
              {filteredDrivers.map((driver) => {
                const isCurrentUser =
                  currentUser &&
                  (driver.eliteId === currentUser.id ||
                    (currentUser.eliteId && driver.eliteIdCode === currentUser.eliteId) ||
                    (currentUser.email && driver.fullName?.toLowerCase() === currentUser.fullName?.toLowerCase()));

                return (
                  <div
                    key={driver.eliteId}
                    onClick={() => setInspectedDriver(driver)}
                    className={`p-4 transition-colors cursor-pointer ${
                      isCurrentUser ? 'bg-[#E10600]/10 border-l-4 border-[#E10600]' : 'hover:bg-[#222628]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="font-['Oswald'] text-2xl font-bold text-white">
                          P{driver.rank}
                        </span>
                        <img
                          src={resolveDriverAvatar(driver)}
                          alt={driver.fullName}
                          className="w-10 h-10 rounded-full object-cover border border-[#34383A]"
                        />
                        <div>
                          <div className="font-['Oswald'] text-base font-bold text-white uppercase flex items-center gap-2">
                            <span>{driver.fullName}</span>
                            {isCurrentUser && (
                              <span className="px-1.5 py-0.5 bg-[#E10600] text-white text-[9px] font-mono rounded font-black">
                                YOU
                              </span>
                            )}
                          </div>
                          <span className="text-xs font-mono text-[#8A9094]">{driver.eliteIdCode}</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-['Oswald'] text-xl font-bold text-white">
                          {(driver.totalXP || 0).toLocaleString()} <span className="text-[10px] text-[#8A9094]">PTS</span>
                        </div>
                        <div className="text-[10px] font-mono text-[#A7ADB2]">
                          {driver.wins || 0} WINS · {driver.winRate || 0}%
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

      </div>

      {/* ============================================================== */}
      {/* 8. DRIVER PERFORMANCE DETAILS MODAL                            */}
      {/* ============================================================== */}
      <AnimatePresence>
        {inspectedDriver && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setInspectedDriver(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            />

            {/* Modal Dialog Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-3xl bg-[#191C1E] border border-[#34383A] rounded-2xl shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col"
            >
              {/* Modal Top Accent Strip */}
              <div
                className="w-full h-1.5"
                style={{
                  backgroundColor:
                    inspectedDriver.rank === 1
                      ? '#C8A65B'
                      : inspectedDriver.rank === 2
                      ? '#A7ADB2'
                      : inspectedDriver.rank === 3
                      ? '#9E7A5A'
                      : '#E10600',
                }}
              />

              {/* Modal Header */}
              <div className="p-6 border-b border-[#34383A] flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img
                      src={resolveDriverAvatar(inspectedDriver)}
                      alt={inspectedDriver.fullName}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-[#34383A]"
                    />
                    <span
                      className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full font-['Oswald'] text-sm font-bold flex items-center justify-center text-black"
                      style={{
                        backgroundColor:
                          inspectedDriver.rank === 1
                            ? '#C8A65B'
                            : inspectedDriver.rank === 2
                            ? '#A7ADB2'
                            : inspectedDriver.rank === 3
                            ? '#9E7A5A'
                            : '#FFFFFF',
                      }}
                    >
                      P{inspectedDriver.rank}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs px-2.5 py-0.5 rounded bg-[#222628] border border-[#34383A] text-[#A7ADB2] uppercase font-bold">
                        {inspectedDriver.promotionLevel?.name || 'CATALYST'}
                      </span>
                      {inspectedDriver.rank === 1 && (
                        <span className="font-mono text-xs px-2 py-0.5 rounded bg-[#C8A65B]/20 text-[#C8A65B] border border-[#C8A65B] font-bold">
                          CHAMPION
                        </span>
                      )}
                    </div>
                    <h3 className="font-['Oswald'] text-2xl sm:text-3xl font-bold text-white uppercase leading-tight">
                      {inspectedDriver.fullName}
                    </h3>
                    <div className="text-xs font-mono text-[#8A9094] flex items-center gap-2 mt-0.5">
                      <span>{inspectedDriver.eliteIdCode || 'ELITE CADET'}</span>
                      <span>·</span>
                      <span>{inspectedDriver.university || 'Affiliated Institution'}</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setInspectedDriver(null)}
                  className="p-2 text-[#8A9094] hover:text-white hover:bg-[#222628] rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body / Telemetry Grid */}
              <div className="p-6 overflow-y-auto space-y-6">
                {/* Driver Bio */}
                {inspectedDriver.bio && (
                  <p className="text-sm text-[#A7ADB2] leading-relaxed border-l-2 border-[#E10600] pl-3 py-0.5 font-sans">
                    {inspectedDriver.bio}
                  </p>
                )}

                {/* Scorecard Strip */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-[#222628] border border-[#34383A] rounded-xl p-3">
                    <span className="text-[10px] font-mono text-[#8A9094] block uppercase">CHAMPIONSHIP POINTS</span>
                    <span className="font-['Oswald'] text-2xl font-bold text-white">
                      {(inspectedDriver.totalXP || 0).toLocaleString()} PTS
                    </span>
                  </div>

                  <div className="bg-[#222628] border border-[#34383A] rounded-xl p-3">
                    <span className="text-[10px] font-mono text-[#8A9094] block uppercase">TOTAL VICTORIES</span>
                    <span className="font-['Oswald'] text-2xl font-bold text-white">
                      {inspectedDriver.wins || 0} WINS
                    </span>
                  </div>

                  <div className="bg-[#222628] border border-[#34383A] rounded-xl p-3">
                    <span className="text-[10px] font-mono text-[#8A9094] block uppercase">WIN RATE</span>
                    <span className="font-['Oswald'] text-2xl font-bold text-white">
                      {inspectedDriver.winRate || 0}%
                    </span>
                  </div>

                  <div className="bg-[#222628] border border-[#34383A] rounded-xl p-3">
                    <span className="text-[10px] font-mono text-[#8A9094] block uppercase">CURRENT STREAK</span>
                    <span className="font-['Oswald'] text-2xl font-bold text-[#E10600] flex items-center gap-1">
                      <Flame className="w-5 h-5 text-[#E10600]" />
                      {inspectedDriver.streak || 0} DAYS
                    </span>
                  </div>
                </div>

                {/* Recent Completed Missions / Performance History */}
                <div>
                  <h4 className="font-['Oswald'] text-lg font-bold text-white uppercase tracking-wide mb-3 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-[#E10600]" />
                    VERIFIED TECHNICAL MISSIONS // RECENT PERFORMANCE
                  </h4>

                  {inspectedDriver.recentTasks && inspectedDriver.recentTasks.length > 0 ? (
                    <div className="space-y-2">
                      {inspectedDriver.recentTasks.map((t, i) => (
                        <div
                          key={i}
                          className="p-3 bg-[#222628] border border-[#34383A] rounded-xl flex items-center justify-between gap-3 text-xs"
                        >
                          <div className="min-w-0">
                            <span className="font-mono text-white font-medium block truncate">
                              {t.title}
                            </span>
                            <span className="text-[10px] font-mono text-[#8A9094]">
                              STATUS: {t.status} · AWARDED: +{t.xpAwarded} PTS
                            </span>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono font-bold border border-emerald-500/40">
                              GRADE: {t.score}/{t.maxScore || 100}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 bg-[#222628] border border-[#34383A] rounded-xl text-center text-xs font-mono text-[#8A9094]">
                      No graded submissions on record for this cycle.
                    </div>
                  )}
                </div>

                {/* 3D Biometric Pass Option for Top 3 Drivers */}
                <div className="p-4 bg-[#222628] border border-[#34383A] rounded-xl flex items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-mono font-bold text-white uppercase block">
                      OFFICIAL THREAD ELITE BIOMETRIC CREDENTIAL
                    </span>
                    <span className="text-[11px] font-mono text-[#8A9094]">
                      Cryptographically verified participant pass on the Thread Security ledger.
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-3 py-1 bg-[#191C1E] border border-[#34383A] text-[#A7ADB2] rounded">
                    VERIFIED AUTH
                  </span>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 bg-[#101112] border-t border-[#34383A] flex items-center justify-between text-xs font-mono text-[#8A9094]">
                <span>ESC TO CLOSE</span>
                <button
                  type="button"
                  onClick={() => setInspectedDriver(null)}
                  className="px-4 py-1.5 bg-[#222628] hover:bg-[#34383A] text-white rounded font-mono text-xs transition-colors"
                >
                  DISMISS
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ChampionshipLeaderboard;