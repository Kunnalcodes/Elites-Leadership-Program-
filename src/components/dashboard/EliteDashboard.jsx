import React, { useState, useEffect } from 'react';
import { 
  CheckSquare, 
  Trophy, 
  Shield, 
  Award, 
  TrendingUp, 
  Radio, 
  FileText, 
  Send, 
  ExternalLink, 
  Flame, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Lock, 
  Upload, 
  MessageSquare, 
  ArrowRight, 
  RefreshCw, 
  Code2, 
  Compass 
} from 'lucide-react';
import { api } from '../../api/client';
import DashboardLayout from './DashboardLayout';
import ChampionshipLeaderboard from '../leaderboard/ChampionshipLeaderboard';

export function EliteDashboard({ user, onLogout }) {
  const [activeNav, setActiveNav] = useState('overview');
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });

  // Data Collections
  const [tasks, setTasks] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  // Task Filter
  const [taskFilter, setTaskFilter] = useState('ALL');

  // Submission Modal
  const [submittingTask, setSubmittingTask] = useState(null);
  const [submissionForm, setSubmissionForm] = useState({
    format: 'WRITTEN_REPORT',
    writtenContent: '',
    repoUrl: '',
    liveDemoUrl: '',
    notes: ''
  });

  const navItems = [
    { id: 'overview', label: 'Cadet Headquarters', icon: TrendingUp },
    { id: 'tasks', label: 'Missions & Tasks', icon: CheckSquare, badge: '4' },
    { id: 'submissions', label: 'My Evaluations', icon: FileText },
    { id: 'leaderboard', label: 'Live Leaderboard', icon: Trophy },
    { id: 'badges', label: 'Badges & Accolades', icon: Award },
    { id: 'mentor', label: 'Mentor & Direct Line', icon: MessageSquare },
  ];

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [tasksRes, subRes, lbRes, annRes, convRes] = await Promise.allSettled([
        api.getTasks(),
        api.getSubmissions(),
        api.getLeaderboard(),
        api.getAnnouncements(),
        api.getConversations(),
      ]);

      if (tasksRes.status === 'fulfilled' && tasksRes.value?.data?.tasks) {
        setTasks(tasksRes.value.data.tasks);
      }
      if (subRes.status === 'fulfilled' && subRes.value?.data?.submissions) {
        setSubmissions(subRes.value.data.submissions);
      }
      if (lbRes.status === 'fulfilled' && lbRes.value?.data?.leaderboard) {
        setLeaderboard(lbRes.value.data.leaderboard);
      }
      if (annRes.status === 'fulfilled' && annRes.value?.data?.announcements) {
        setAnnouncements(annRes.value.data.announcements);
      }
    } catch (err) {
      console.error('Error loading cadet data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const showToast = (type, text) => {
    setStatusMessage({ type, text });
    setTimeout(() => setStatusMessage({ type: '', text: '' }), 4000);
  };

  // Submit Mission Work
  const handleSubmitTask = async (e) => {
    e.preventDefault();
    if (!submittingTask) return;

    try {
      await api.submitTask(submittingTask.id, {
        writtenContent: submissionForm.writtenContent,
        repoUrl: submissionForm.repoUrl,
        liveDemoUrl: submissionForm.liveDemoUrl,
        notes: submissionForm.notes,
        format: submittingTask.format,
      });

      showToast('success', `Mission "${submittingTask.title}" submitted for Marcus Reynolds's evaluation!`);
      setSubmittingTask(null);
      setSubmissionForm({
        format: 'WRITTEN_REPORT',
        writtenContent: '',
        repoUrl: '',
        liveDemoUrl: '',
        notes: ''
      });
      loadData();
    } catch (err) {
      showToast('error', err.message || 'Submission failed.');
    }
  };

  // Send Direct Message to Mentor
  const handleSendMessageToMentor = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    showToast('success', 'Message dispatched to Marcus Reynolds.');
    setNewMessage('');
  };

  // XP & Progress Metrics
  const currentXp = user?.xpBalance || 2980;
  const nextLevelXp = 3000;
  const xpPercent = Math.min(100, Math.round((currentXp / nextLevelXp) * 100));
  const streakDays = user?.streakDays || 14;

  return (
    <DashboardLayout
      user={user}
      activeNav={activeNav}
      onNavChange={setActiveNav}
      navItems={navItems}
      onLogout={onLogout}
    >
      {/* Toast Notification */}
      {statusMessage.text && (
        <div className={`mb-6 p-4 rounded-xl border flex items-center gap-3 text-xs font-mono transition-all ${
          statusMessage.type === 'success' 
            ? 'bg-[#8CCF42]/10 border-[#8CCF42] text-[#8CCF42]' 
            : 'bg-[#FF647B]/10 border-[#FF647B] text-[#FF647B]'
        }`}>
          {statusMessage.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* ============================================================== */}
      {/* CADET HERO PROGRESS BANNER                                     */}
      {/* ============================================================== */}
      <div className="mb-8 p-6 sm:p-8 rounded-3xl bg-[#100D17] border border-[#292132] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#8000FF]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#8CCF42]/10 border border-[#8CCF42]/30 text-[#8CCF42] font-mono text-[11px] font-bold tracking-widest uppercase mb-3">
              LEVEL 1: CATALYST — GOLD STANDING
            </div>
            <h1 className="font-display text-2xl sm:text-4xl font-extrabold text-white">
              Welcome back, <span className="text-[#8000FF]">{user?.fullName || 'Dhiraj Roy'}</span>
            </h1>
            <p className="text-xs text-[#898293] font-mono mt-1">
              TS-ID: {user?.eliteId || 'ELITE-2026-001'} · Institution: IIT Kharagpur · Mentor: Marcus Reynolds
            </p>
          </div>

          {/* Streak Counter Pill */}
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-2xl bg-[#15111F] border border-[#292132] flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FF647B]/15 text-[#FF647B] flex items-center justify-center">
                <Flame size={22} className="animate-pulse" />
              </div>
              <div>
                <div className="font-display text-xl font-extrabold text-white">{streakDays} DAYS</div>
                <div className="text-[10px] font-mono text-[#898293] uppercase">Active Daily Streak</div>
              </div>
            </div>
          </div>
        </div>

        {/* XP Progression Bar */}
        <div className="mt-6 pt-6 border-t border-[#292132]/60">
          <div className="flex items-center justify-between text-xs font-mono mb-2">
            <span className="text-[#898293]">ADVANCEMENT TO LEVEL 2 SENTINEL:</span>
            <span className="text-[#8CCF42] font-bold">{currentXp.toLocaleString()} / {nextLevelXp.toLocaleString()} XP ({xpPercent}%)</span>
          </div>
          <div className="w-full h-3 rounded-full bg-[#15111F] overflow-hidden p-0.5 border border-[#292132]">
            <div 
              className="h-full rounded-full bg-[#8CCF42] transition-all duration-1000 shadow-[0_0_12px_rgba(140,207,66,0.5)]" 
              style={{ width: `${xpPercent}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[10px] font-mono text-[#898293] mt-2">
            <span>Level 1: Catalyst</span>
            <span className="text-[#BD7AFF]">20 XP Remaining for Endorsement</span>
            <span>Level 2: Sentinel</span>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* TAB 1: CADET HEADQUARTERS                                      */}
      {/* ============================================================== */}
      {activeNav === 'overview' && (
        <div className="space-y-8">
          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-[#100D17] border border-[#292132]">
              <div className="text-[11px] font-mono text-[#898293] uppercase tracking-wider mb-2">CURRENT RANKING</div>
              <div className="font-display text-3xl font-extrabold text-[#8CCF42]">#1 CHAMPION</div>
              <div className="text-xs text-[#898293] mt-1 font-mono">Top of Cohort Standings</div>
            </div>

            <div className="p-5 rounded-2xl bg-[#100D17] border border-[#292132]">
              <div className="text-[11px] font-mono text-[#898293] uppercase tracking-wider mb-2">ASSIGNED MISSIONS</div>
              <div className="font-display text-3xl font-extrabold text-white">4 TASKS</div>
              <div className="text-xs text-[#8CCF42] mt-1 font-mono">1 Evaluated · 3 Available</div>
            </div>

            <div className="p-5 rounded-2xl bg-[#100D17] border border-[#292132]">
              <div className="text-[11px] font-mono text-[#898293] uppercase tracking-wider mb-2">BADGES EARNED</div>
              <div className="font-display text-3xl font-extrabold text-[#BD7AFF]">2 ACCOLADES</div>
              <div className="text-xs text-[#898293] mt-1 font-mono">First Blood · Code Sentinel</div>
            </div>
          </div>

          {/* Latest Mentor Review Spotlight */}
          <div className="p-6 rounded-2xl bg-[#100D17] border border-[#292132] space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                LATEST MENTOR EVALUATION & FEEDBACK
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#8CCF42]/10 text-[#8CCF42]">
                GRADE: 98/100 · +350 XP
              </span>
            </div>

            <div className="p-4 rounded-xl bg-[#15111F] border border-[#292132]">
              <div className="font-bold text-white text-sm mb-1">
                Threat Modeling Architecture: Core Auth Subsystems
              </div>
              <p className="text-xs text-[#C5BED0] leading-relaxed italic mb-3">
                "Exceptional architectural breakdown, Dhiraj. Your threat modeling breakdown of the timing attack surface on OTP verification and architectural mitigation using constant-time comparison was exemplary. Promotion trajectory is exceptional."
              </p>
              <div className="text-[11px] font-mono text-[#898293] flex items-center justify-between">
                <span>Evaluator: Marcus Reynolds</span>
                <span className="text-[#BD7AFF]">Officially Recorded to Ledger</span>
              </div>
            </div>
          </div>

          {/* Active Announcements */}
          <div className="p-6 rounded-2xl bg-[#100D17] border border-[#292132]">
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-white mb-4">
              PROGRAM DIRECTIVES & ANNOUNCEMENTS
            </h3>
            <div className="space-y-3">
              {announcements.map((a) => (
                <div key={a.id} className="p-4 rounded-xl bg-[#15111F] border border-[#292132]">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono font-bold text-[#FF647B] uppercase">
                      {a.priority} DIRECTIVE
                    </span>
                    <span className="text-[10px] font-mono text-[#898293]">
                      {new Date(a.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h4 className="font-bold text-white text-sm">{a.title}</h4>
                  <p className="text-xs text-[#898293] mt-1">{a.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 2: MISSIONS & TASKS                                        */}
      {/* ============================================================== */}
      {activeNav === 'tasks' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl font-extrabold text-white">
                Active Missions <span className="text-[#8000FF]">& Labs</span>
              </h2>
              <p className="text-xs text-[#898293] mt-1 font-sans">
                Review technical requirements, conduct research, and submit lab artifacts for evaluation.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tasks.map((t) => {
              const isSubmitted = t.id === 'task-001';
              return (
                <div key={t.id} className="p-6 rounded-2xl bg-[#100D17] border border-[#292132] flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-2.5 py-1 rounded text-[10px] font-mono font-bold bg-[#8000FF]/15 text-[#BD7AFF]">
                        {t.format.replace('_', ' ')}
                      </span>
                      <span className="font-mono text-xs font-bold text-[#8CCF42]">
                        +{t.maxXP} XP
                      </span>
                    </div>
                    <h3 className="font-bold text-base text-white mb-2">{t.title}</h3>
                    <p className="text-xs text-[#898293] leading-relaxed line-clamp-3">
                      {t.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#292132] flex items-center justify-between">
                    <span className="text-xs font-mono text-[#898293]">
                      Est: {t.estimatedHours || 8} hrs
                    </span>

                    {isSubmitted ? (
                      <span className="px-3 py-1.5 rounded-xl bg-[#8CCF42]/10 border border-[#8CCF42]/30 text-[#8CCF42] font-mono text-xs font-bold flex items-center gap-1.5">
                        <CheckCircle2 size={14} />
                        <span>Graded · 98%</span>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setSubmittingTask(t);
                          setSubmissionForm({
                            format: t.format,
                            writtenContent: '',
                            repoUrl: '',
                            liveDemoUrl: '',
                            notes: ''
                          });
                        }}
                        className="px-4 py-2 rounded-xl bg-[#8000FF] hover:bg-[#7000E0] text-white font-mono text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                      >
                        <Upload size={14} />
                        <span>Submit Work</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 3: MY EVALUATIONS                                          */}
      {/* ============================================================== */}
      {activeNav === 'submissions' && (
        <div className="space-y-6">
          <div>
            <h2 className="font-display text-2xl font-extrabold text-white">
              Submission History & <span className="text-[#8000FF]">Evaluations</span>
            </h2>
            <p className="text-xs text-[#898293] mt-1 font-sans">
              Authoritative record of graded missions and mentor feedback citations.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#100D17] border border-[#292132] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-white">
                  Threat Modeling Architecture: Core Auth Subsystems
                </h3>
                <div className="text-xs font-mono text-[#898293] mt-0.5">
                  Submission ID: sub-001 · Format: WRITTEN_REPORT
                </div>
              </div>
              <span className="px-3 py-1 rounded-xl bg-[#8CCF42]/10 text-[#8CCF42] font-mono text-xs font-bold">
                SCORE: 98/100 · +350 XP
              </span>
            </div>

            <div className="p-4 rounded-xl bg-[#15111F] border border-[#292132] text-xs space-y-2">
              <span className="font-mono text-[#898293] block uppercase text-[10px]">
                MARCUS REYNOLDS (MENTOR FEEDBACK):
              </span>
              <p className="text-[#C5BED0] leading-relaxed italic">
                "Exceptional architectural breakdown, Dhiraj. Your threat modeling breakdown of the timing attack surface on OTP verification and architectural mitigation using constant-time comparison was exemplary. Promotion trajectory is exceptional."
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 4: LIVE LEADERBOARD                                        */}
      {/* ============================================================== */}
      {activeNav === 'leaderboard' && (
        <div className="-mx-4 sm:-mx-6 lg:-mx-8 -my-6">
          <ChampionshipLeaderboard currentUser={user} />
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 5: ACHIEVEMENTS & BADGES                                   */}
      {/* ============================================================== */}
      {activeNav === 'badges' && (
        <div className="space-y-8">
          <div>
            <h2 className="font-display text-2xl font-extrabold text-white">
              Achievements & <span className="text-[#8000FF]">Accolades</span>
            </h2>
            <p className="text-xs text-[#898293] mt-1 font-sans">
              Earned badges, active goals, and classified future milestones.
            </p>
          </div>

          {/* 1. Earned Badges */}
          <div className="space-y-4">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#8CCF42]">
              EARNED BADGES (2 UNLOCKED)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-[#100D17] border border-[#8CCF42]/40 flex items-start gap-4">
                <div className="p-3 rounded-xl bg-[#8CCF42]/10 text-[#8CCF42]">
                  <Award size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-white text-base">First Blood</h4>
                  <p className="text-xs text-[#898293] mt-1">Completed first program mission with distinction.</p>
                  <span className="text-[10px] font-mono text-[#8CCF42] mt-2 block">EARNED ON ENROLLMENT</span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#100D17] border border-[#BD7AFF]/40 flex items-start gap-4">
                <div className="p-3 rounded-xl bg-[#BD7AFF]/10 text-[#BD7AFF]">
                  <Shield size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-white text-base">Code Sentinel</h4>
                  <p className="text-xs text-[#898293] mt-1">Zero-vulnerability submission on architecture hardening lab.</p>
                  <span className="text-[10px] font-mono text-[#BD7AFF] mt-2 block">AWARDED BY MARCUS REYNOLDS</span>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Unlocked to Pursue */}
          <div className="space-y-4">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#38BDF8]">
              UNLOCKED TO PURSUE (IN PROGRESS)
            </h3>
            <div className="p-5 rounded-2xl bg-[#100D17] border border-[#38BDF8]/40 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white text-base">Catalyst Master</h4>
                  <p className="text-xs text-[#898293]">Accumulate 3,000 XP in Level 1 Catalyst to unlock Sentinel advancement.</p>
                </div>
                <span className="font-mono text-xs font-bold text-[#38BDF8]">2,980 / 3,000 XP</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#15111F] overflow-hidden">
                <div className="h-full bg-[#38BDF8] rounded-full" style={{ width: '99.3%' }} />
              </div>
            </div>
          </div>

          {/* 3. Upcoming Locked */}
          <div className="space-y-4">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#898293]">
              UPCOMING CLASSIFIED MILESTONES (LOCKED)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-[#100D17] border border-[#292132] opacity-60 flex items-start gap-4">
                <div className="p-3 rounded-xl bg-[#15111F] text-[#898293]">
                  <Lock size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-white text-base">Shadow Architect</h4>
                  <p className="text-xs text-[#898293] mt-1">Classified offensive tradecraft mission. Unlocks at Level 2 Sentinel.</p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#100D17] border border-[#292132] opacity-60 flex items-start gap-4">
                <div className="p-3 rounded-xl bg-[#15111F] text-[#898293]">
                  <Lock size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-white text-base">Vanguard Champion</h4>
                  <p className="text-xs text-[#898293] mt-1">Enterprise incident response exercise. Unlocks at Level 3 Vanguard.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 6: MENTOR & DIRECT LINE                                    */}
      {/* ============================================================== */}
      {activeNav === 'mentor' && (
        <div className="space-y-6">
          <div>
            <h2 className="font-display text-2xl font-extrabold text-white">
              Assigned Mentor & <span className="text-[#8000FF]">Direct Line</span>
            </h2>
            <p className="text-xs text-[#898293] mt-1 font-sans">
              1-on-1 private advisory channel with your assigned executive security mentor.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Mentor Profile */}
            <div className="p-6 rounded-2xl bg-[#100D17] border border-[#292132] space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-[#8000FF]/20 border border-[#8000FF] flex items-center justify-center text-[#BD7AFF] font-bold text-xl">
                MR
              </div>
              <div>
                <h3 className="font-bold text-lg text-white">Marcus Reynolds</h3>
                <div className="text-xs font-mono text-[#8CCF42]">Lead Security Mentor</div>
                <div className="text-[11px] font-mono text-[#898293] mt-0.5">mentor@threadsecurity.in</div>
              </div>
              <p className="text-xs text-[#C5BED0] leading-relaxed pt-2 border-t border-[#292132]">
                12+ years experience in vulnerability research, red teaming, and guiding next-generation cybersecurity leaders.
              </p>
            </div>

            {/* Encrypted Chat Window */}
            <div className="lg:col-span-2 p-6 rounded-2xl bg-[#100D17] border border-[#292132] flex flex-col h-[460px]">
              <div className="pb-3 border-b border-[#292132] mb-4">
                <h3 className="font-bold text-white text-sm">Direct Consultation Thread</h3>
                <span className="text-[10px] font-mono text-[#8CCF42]">Encrypted Session Active</span>
              </div>

              <div className="grow space-y-3 overflow-y-auto pr-2">
                <div className="p-3 rounded-xl bg-[#8000FF]/15 border border-[#8000FF]/30 max-w-md ml-auto text-xs">
                  <div className="text-[10px] font-mono text-[#BD7AFF] mb-1">Dhiraj Roy (You)</div>
                  <div className="text-white leading-relaxed">
                    Hi Marcus, I have completed the STRIDE analysis for the auth endpoints. Would love your thoughts on my proposed mitigation for the OTP challenge timing attack.
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#15111F] border border-[#292132] max-w-md text-xs">
                  <div className="text-[10px] font-mono text-[#898293] mb-1">Marcus Reynolds (Mentor)</div>
                  <div className="text-[#C5BED0] leading-relaxed">
                    Dhiraj, your analysis of constant-time buffer comparisons was spot-on. The grade and 350 XP award have been published to your ledger. Keep up the high standard.
                  </div>
                </div>
              </div>

              <form onSubmit={handleSendMessageToMentor} className="pt-4 border-t border-[#292132] flex items-center gap-2 mt-auto">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Send a technical query to Marcus..."
                  className="grow h-11 px-4 rounded-xl bg-[#15111F] border border-[#38264F] text-xs text-white focus:outline-none focus:border-[#8CCF42]"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="px-4 h-11 rounded-xl bg-[#8000FF] hover:bg-[#7000E0] disabled:opacity-50 text-white font-mono text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Send size={14} />
                  <span>Send</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: SUBMIT MISSION WORK                                     */}
      {/* ============================================================== */}
      {submittingTask && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#100D17] border border-[#38264F] rounded-2xl p-6 max-w-lg w-full shadow-2xl">
            <h3 className="font-display text-lg font-bold text-white mb-1">Submit Mission Artifacts</h3>
            <p className="text-xs text-[#898293] mb-4">{submittingTask.title}</p>
            <form onSubmit={handleSubmitTask} className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono text-[#C5BED0] uppercase mb-1">
                  Submission Summary / Report *
                </label>
                <textarea
                  required
                  rows={4}
                  value={submissionForm.writtenContent}
                  onChange={(e) => setSubmissionForm({ ...submissionForm, writtenContent: e.target.value })}
                  placeholder="Summarize your findings, architecture, or defensive implementation..."
                  className="w-full p-3 rounded-xl bg-[#15111F] border border-[#38264F] text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-[#C5BED0] uppercase mb-1">
                  Repository URL / Lab Artifact (Optional)
                </label>
                <input
                  type="url"
                  value={submissionForm.repoUrl}
                  onChange={(e) => setSubmissionForm({ ...submissionForm, repoUrl: e.target.value })}
                  placeholder="https://github.com/dhirajroy/security-lab"
                  className="w-full h-10 px-3 rounded-xl bg-[#15111F] border border-[#38264F] text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-[#C5BED0] uppercase mb-1">
                  Notes for Mentor (Marcus Reynolds)
                </label>
                <input
                  type="text"
                  value={submissionForm.notes}
                  onChange={(e) => setSubmissionForm({ ...submissionForm, notes: e.target.value })}
                  placeholder="Questions or specific areas you want reviewed..."
                  className="w-full h-10 px-3 rounded-xl bg-[#15111F] border border-[#38264F] text-xs text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-[#292132]">
                <button
                  type="button"
                  onClick={() => setSubmittingTask(null)}
                  className="px-4 py-2 rounded-xl text-xs font-mono text-[#898293] hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#8000FF] hover:bg-[#7000E0] text-xs font-mono font-bold text-white cursor-pointer"
                >
                  Submit for Evaluation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </DashboardLayout>
  );
}

export default EliteDashboard;
