import React, { useState, useEffect } from 'react';
import { 
  Users, 
  CheckSquare, 
  Trophy, 
  Shield, 
  Award, 
  TrendingUp, 
  Radio, 
  FileText, 
  Settings, 
  Plus, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  UserPlus, 
  Eye, 
  ArrowUpRight, 
  Archive, 
  Lock, 
  Zap,
  Clock,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Send,
  MessageSquare,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import { api } from '../../api/client';
import DashboardLayout from './DashboardLayout';

export function TaskMentorDashboard({ user, onLogout }) {
  const [activeNav, setActiveNav] = useState('overview');
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });

  // Data Collections
  const [myElites, setMyElites] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [replyMessage, setReplyMessage] = useState('');

  // Evaluation Modal
  const [evaluatingSubmission, setEvaluatingSubmission] = useState(null);
  const [evalScore, setEvalScore] = useState(95);
  const [evalXp, setEvalXp] = useState(350);
  const [evalFeedback, setEvalFeedback] = useState('');
  const [revisionReason, setRevisionReason] = useState('');
  const [isRevisionMode, setIsRevisionMode] = useState(false);

  // New Task Modal
  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
  const [newTaskForm, setNewTaskForm] = useState({
    title: '',
    description: '',
    format: 'WRITTEN_REPORT',
    maxXP: 350,
    estimatedHours: 8,
    deadlineDays: 7
  });

  // Filter for submissions
  const [submissionFilter, setSubmissionFilter] = useState('ALL');

  const navItems = [
    { id: 'overview', label: 'Mentor Command', icon: TrendingUp },
    { id: 'elites', label: 'My Assigned Elites', icon: Users, badge: '3' },
    { id: 'submissions', label: 'Submissions & Grading', icon: CheckSquare, badge: '1' },
    { id: 'library', label: 'Task Library', icon: BookOpen },
    { id: 'progression', label: 'Progression Control', icon: Zap },
    { id: 'messages', label: 'Direct Messages', icon: MessageSquare },
    { id: 'resources', label: 'Study Briefs', icon: FileText },
  ];

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [usersRes, tasksRes, subRes, convRes] = await Promise.allSettled([
        api.getUsers({ role: 'ELITE' }),
        api.getTasks(),
        api.getSubmissions(),
        api.getConversations(),
      ]);

      if (usersRes.status === 'fulfilled' && usersRes.value?.data?.users) {
        setMyElites(usersRes.value.data.users);
      }
      if (tasksRes.status === 'fulfilled' && tasksRes.value?.data?.tasks) {
        setTasks(tasksRes.value.data.tasks);
      }
      if (subRes.status === 'fulfilled' && subRes.value?.data?.submissions) {
        setSubmissions(subRes.value.data.submissions);
      }
      if (convRes.status === 'fulfilled' && convRes.value?.data?.conversations) {
        setConversations(convRes.value.data.conversations);
        if (convRes.value.data.conversations.length > 0) {
          setActiveConversation(convRes.value.data.conversations[0]);
        }
      }
    } catch (err) {
      console.error('Error loading mentor data:', err);
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

  // Submit Evaluation & Award XP
  const handleApproveEvaluation = async (e) => {
    e.preventDefault();
    if (!evaluatingSubmission) return;

    try {
      await api.evaluateSubmission(evaluatingSubmission.id, {
        score: Number(evalScore),
        qualitativeFeedback: evalFeedback || 'Comprehensive technical execution with solid defensive rigor.',
        status: 'PUBLISHED',
        xpAwarded: Number(evalXp),
      });

      showToast('success', `Submission approved! ${evalXp} XP awarded to student's authoritative ledger.`);
      setEvaluatingSubmission(null);
      setEvalFeedback('');
      loadData();
    } catch (err) {
      showToast('error', err.message || 'Evaluation submission failed.');
    }
  };

  // Request Revision
  const handleRequestRevision = async (e) => {
    e.preventDefault();
    if (!evaluatingSubmission || !revisionReason.trim()) return;

    try {
      await api.requestRevision(evaluatingSubmission.id, revisionReason);
      showToast('success', 'Revision requested. Cadet has been notified to resubmit.');
      setEvaluatingSubmission(null);
      setRevisionReason('');
      setIsRevisionMode(false);
      loadData();
    } catch (err) {
      showToast('error', err.message || 'Failed to request revision.');
    }
  };

  // Send Direct Message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!activeConversation || !replyMessage.trim()) return;

    try {
      await api.sendMessage(activeConversation.id, { body: replyMessage });
      showToast('success', 'Message dispatched to cadet.');
      setReplyMessage('');
      loadData();
    } catch (err) {
      showToast('error', err.message || 'Failed to send message.');
    }
  };

  // Author Task
  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      const deadline = new Date(Date.now() + newTaskForm.deadlineDays * 24 * 60 * 60 * 1000).toISOString();
      await api.createTask({
        title: newTaskForm.title,
        slug: newTaskForm.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: newTaskForm.description,
        format: newTaskForm.format,
        maxXP: Number(newTaskForm.maxXP),
        estimatedHours: Number(newTaskForm.estimatedHours),
        deadline,
        status: 'PUBLISHED',
        promotionLevelId: 'level-catalyst',
      });

      showToast('success', 'Task authored and added to curriculum!');
      setShowCreateTaskModal(false);
      loadData();
    } catch (err) {
      showToast('error', err.message || 'Failed to author task.');
    }
  };

  // Filter Submissions
  const filteredSubmissions = submissions.filter((s) => {
    if (submissionFilter === 'PENDING') return s.status === 'UNDER_REVIEW' || s.status === 'SUBMITTED';
    if (submissionFilter === 'GRADED') return s.status === 'GRADED' || s.status === 'RESULT_PUBLISHED';
    if (submissionFilter === 'REVISION') return s.status === 'REVISION_REQUESTED';
    return true;
  });

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
      {/* TAB 1: MENTOR COMMAND OVERVIEW                                 */}
      {/* ============================================================== */}
      {activeNav === 'overview' && (
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#BD7AFF]/10 border border-[#BD7AFF]/30 text-[#BD7AFF] font-mono text-[10px] font-bold tracking-widest uppercase mb-2">
                OFFENSIVE OPERATIONS & LEADERSHIP MENTOR
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
                Marcus Reynolds <span className="text-[#8000FF]">Command Workspace</span>
              </h2>
              <p className="text-xs text-[#898293] mt-1 font-sans">
                Active student oversight, rubric evaluations, XP allocations, and progression authorization.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setActiveNav('submissions')}
              className="px-4 py-2.5 rounded-xl bg-[#8000FF] hover:bg-[#7000E0] text-white font-mono text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md self-start"
            >
              <CheckSquare size={16} />
              <span>Review Submissions (1 Pending)</span>
            </button>
          </div>

          {/* 4 Mentor KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-[#100D17] border border-[#292132]">
              <div className="flex items-center justify-between text-[#898293] mb-3">
                <span className="font-mono text-[11px] uppercase tracking-wider">ASSIGNED ELITES</span>
                <Users size={18} className="text-[#BD7AFF]" />
              </div>
              <div className="font-display text-3xl font-extrabold text-white">{myElites.length || 3}</div>
              <div className="text-[11px] text-[#8CCF42] font-mono mt-2">
                100% Active Attendance
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#100D17] border border-[#292132]">
              <div className="flex items-center justify-between text-[#898293] mb-3">
                <span className="font-mono text-[11px] uppercase tracking-wider">PENDING REVIEWS</span>
                <Clock size={18} className="text-[#FF647B]" />
              </div>
              <div className="font-display text-3xl font-extrabold text-white">1</div>
              <div className="text-[11px] text-[#FF647B] font-mono mt-2">
                Piyush Kumar (Task 001)
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#100D17] border border-[#292132]">
              <div className="flex items-center justify-between text-[#898293] mb-3">
                <span className="font-mono text-[11px] uppercase tracking-wider">TURNAROUND TIME</span>
                <Zap size={18} className="text-[#8CCF42]" />
              </div>
              <div className="font-display text-3xl font-extrabold text-white">1.4 hrs</div>
              <div className="text-[11px] text-[#898293] font-mono mt-2">
                98% Review SLA Metric
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#100D17] border border-[#292132]">
              <div className="flex items-center justify-between text-[#898293] mb-3">
                <span className="font-mono text-[11px] uppercase tracking-wider">XP AWARDED</span>
                <Trophy size={18} className="text-[#BD7AFF]" />
              </div>
              <div className="font-display text-3xl font-extrabold text-white">350 XP</div>
              <div className="text-[11px] text-[#8CCF42] font-mono mt-2">
                STRIDE Threat Modeling Lab
              </div>
            </div>
          </div>

          {/* Assigned Elites Quick Cards */}
          <div className="p-6 rounded-2xl bg-[#100D17] border border-[#292132]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-white">
                MY ACTIVE ELITE CADETS
              </h3>
              <button 
                type="button" 
                onClick={() => setActiveNav('elites')}
                className="text-[11px] font-mono text-[#BD7AFF] hover:underline"
              >
                Manage All Cadets &rarr;
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {myElites.map((e) => (
                <div key={e.id} className="p-4 rounded-xl bg-[#15111F] border border-[#292132] space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white text-sm">{e.fullName}</div>
                      <div className="text-[11px] font-mono text-[#898293]">{e.eliteId}</div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#8CCF42]/10 text-[#8CCF42]">
                      {e.sublevel || 'Gold'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-mono pt-2 border-t border-[#292132]">
                    <span className="text-[#898293]">Ledger:</span>
                    <span className="font-bold text-[#8CCF42]">{e.xpBalance || 2980} XP</span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-[#898293]">Daily Streak:</span>
                    <span className="font-bold text-[#BD7AFF]">14 Days</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 2: MY ASSIGNED ELITES                                      */}
      {/* ============================================================== */}
      {activeNav === 'elites' && (
        <div className="space-y-6">
          <div>
            <h2 className="font-display text-2xl font-extrabold text-white">
              My Assigned <span className="text-[#8000FF]">Elites</span>
            </h2>
            <p className="text-xs text-[#898293] mt-1 font-sans">
              Conduct weekly performance check-ins, inspect submissions, and author recommendation citations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {myElites.map((e) => (
              <div key={e.id} className="p-6 rounded-2xl bg-[#100D17] border border-[#292132] space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#8000FF]/20 border border-[#8000FF] flex items-center justify-center text-[#BD7AFF] font-bold text-base">
                    {e.fullName[0]}
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-white">{e.fullName}</h3>
                    <div className="text-xs font-mono text-[#8CCF42]">{e.eliteId}</div>
                  </div>
                </div>

                <div className="space-y-2 text-xs font-mono pt-3 border-t border-[#292132]">
                  <div className="flex justify-between">
                    <span className="text-[#898293]">Institution:</span>
                    <span className="text-white">{e.university || 'IIT Kharagpur'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#898293]">Level Tier:</span>
                    <span className="text-white font-bold">{e.currentLevel?.name || 'Catalyst Gold'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#898293]">Ledger XP:</span>
                    <span className="text-[#8CCF42] font-bold">{e.xpBalance || 2980} XP</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#898293]">Streak:</span>
                    <span className="text-[#BD7AFF] font-bold">14 Days Active</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#292132] flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveNav('messages')}
                    className="flex-1 py-2 rounded-xl bg-[#15111F] hover:bg-[#201830] border border-[#38264F] text-xs font-mono text-[#BD7AFF] cursor-pointer"
                  >
                    Direct Message
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveNav('submissions')}
                    className="flex-1 py-2 rounded-xl bg-[#8000FF] hover:bg-[#7000E0] text-xs font-mono font-bold text-white cursor-pointer"
                  >
                    Submissions
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 3: SUBMISSIONS & EVALUATION INBOX                           */}
      {/* ============================================================== */}
      {activeNav === 'submissions' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl font-extrabold text-white">
                Submissions & <span className="text-[#8000FF]">Evaluation Center</span>
              </h2>
              <p className="text-xs text-[#898293] mt-1 font-sans">
                Review candidate work, assign rubric scores, write qualitative feedback, and award XP.
              </p>
            </div>
            {/* Filter buttons */}
            <div className="flex items-center gap-2">
              {['ALL', 'PENDING', 'GRADED', 'REVISION'].map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setSubmissionFilter(f)}
                  className={`px-3 py-1.5 rounded-lg font-mono text-[11px] font-bold uppercase cursor-pointer transition-all ${
                    submissionFilter === f ? 'bg-[#8000FF] text-white' : 'bg-[#15111F] text-[#898293] hover:text-white'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {filteredSubmissions.map((s) => (
              <div key={s.id} className="p-6 rounded-2xl bg-[#100D17] border border-[#292132] flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-base">
                      {s.taskId === 'task-001' ? 'Threat Modeling Architecture: Core Auth Subsystems' : 'Defensive Engineering Lab'}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                      s.status === 'GRADED' ? 'bg-[#8CCF42]/10 text-[#8CCF42]' :
                      s.status === 'UNDER_REVIEW' || s.status === 'SUBMITTED' ? 'bg-[#FF647B]/10 text-[#FF647B]' :
                      'bg-[#F59E0B]/10 text-[#F59E0B]'
                    }`}>
                      {s.status}
                    </span>
                  </div>
                  <div className="text-xs font-mono text-[#898293]">
                    Candidate ID: {s.eliteId} · Format: {s.format || 'WRITTEN_REPORT'}
                  </div>
                  <p className="text-xs text-[#C5BED0] font-sans pt-1">
                    {s.writtenContent || s.notes || 'Submission files uploaded for mentor evaluation.'}
                  </p>
                  {s.repoUrl && (
                    <a 
                      href={s.repoUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-flex items-center gap-1.5 text-xs font-mono text-[#BD7AFF] hover:underline pt-1"
                    >
                      <ExternalLink size={12} />
                      <span>{s.repoUrl}</span>
                    </a>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {s.status === 'UNDER_REVIEW' || s.status === 'SUBMITTED' ? (
                    <button
                      type="button"
                      onClick={() => {
                        setEvaluatingSubmission(s);
                        setEvalScore(95);
                        setEvalXp(350);
                        setEvalFeedback('Solid technical execution. Addressed STRIDE categories thoroughly.');
                        setIsRevisionMode(false);
                      }}
                      className="px-4 py-2 rounded-xl bg-[#8000FF] hover:bg-[#7000E0] text-white font-mono text-xs font-bold cursor-pointer"
                    >
                      Evaluate & Grade
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setEvaluatingSubmission(s);
                        setEvalScore(98);
                        setEvalXp(350);
                        setEvalFeedback('Exceptional architectural breakdown, Dhiraj. Your threat modeling breakdown of the timing attack surface on OTP verification and architectural mitigation using constant-time comparison was exemplary. Promotion trajectory is exceptional.');
                        setIsRevisionMode(false);
                      }}
                      className="px-4 py-2 rounded-xl bg-[#15111F] hover:bg-[#201830] border border-[#38264F] text-xs font-mono text-[#BD7AFF] cursor-pointer"
                    >
                      View Review
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 4: TASK LIBRARY                                            */}
      {/* ============================================================== */}
      {activeNav === 'library' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl font-extrabold text-white">
                Task & Lab <span className="text-[#8000FF]">Library</span>
              </h2>
              <p className="text-xs text-[#898293] mt-1 font-sans">
                Curate assignments, rubrics, and technical specifications for Level 1 Catalyst.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowCreateTaskModal(true)}
              className="px-4 py-2.5 rounded-xl bg-[#8000FF] hover:bg-[#7000E0] text-white font-mono text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md self-start"
            >
              <Plus size={16} />
              <span>Create Task</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tasks.map((t) => (
              <div key={t.id} className="p-5 rounded-2xl bg-[#100D17] border border-[#292132] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#8000FF]/15 text-[#BD7AFF]">
                    {t.format}
                  </span>
                  <span className="font-mono text-xs font-bold text-[#8CCF42]">+{t.maxXP} XP</span>
                </div>
                <h3 className="font-bold text-white text-base">{t.title}</h3>
                <p className="text-xs text-[#898293] leading-relaxed line-clamp-3">{t.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 5: PROGRESSION CONTROL                                      */}
      {/* ============================================================== */}
      {activeNav === 'progression' && (
        <div className="space-y-6">
          <div>
            <h2 className="font-display text-2xl font-extrabold text-white">
              Progression & <span className="text-[#8000FF]">Promotion Endorsement</span>
            </h2>
            <p className="text-xs text-[#898293] mt-1 font-sans">
              Recommend assigned cadets for Level 2 Sentinel advancement to Super Admin.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#100D17] border border-[#292132] space-y-4">
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-white">
              CADIDATE ADVANCEMENT READINESS
            </h3>
            <div className="p-4 rounded-xl bg-[#15111F] border border-[#292132] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="font-bold text-white text-sm">Dhiraj Roy (ELITE-2026-001)</div>
                <div className="text-xs font-mono text-[#8CCF42] mt-0.5">
                  XP: 2,980 / 3,000 XP (99.3%) · 14-Day Streak · 98% Task Accuracy
                </div>
              </div>
              <button
                type="button"
                onClick={() => showToast('success', 'Endorsement sent to Super Admin for Sentinel Promotion approval!')}
                className="px-4 py-2 rounded-xl bg-[#8000FF] hover:bg-[#7000E0] text-white font-mono text-xs font-bold cursor-pointer"
              >
                Endorse for Level 2 Sentinel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 6: DIRECT MESSAGING                                        */}
      {/* ============================================================== */}
      {activeNav === 'messages' && (
        <div className="space-y-6">
          <div>
            <h2 className="font-display text-2xl font-extrabold text-white">
              Direct Mentor <span className="text-[#8000FF]">Messaging</span>
            </h2>
            <p className="text-xs text-[#898293] mt-1 font-sans">
              1-on-1 confidential technical consultation and feedback line with your assigned Elites.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Conversations List */}
            <div className="p-4 rounded-2xl bg-[#100D17] border border-[#292132] space-y-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#898293] px-2 block mb-2">
                ACTIVE CHAT CHANNELS
              </span>
              {myElites.map((e) => (
                <button
                  key={e.id}
                  type="button"
                  onClick={() => setActiveConversation({ id: `conv-${e.id}`, title: `Consultation: ${e.fullName}` })}
                  className="w-full text-left p-3 rounded-xl bg-[#15111F] hover:bg-[#201830] border border-[#292132] transition-colors cursor-pointer"
                >
                  <div className="font-bold text-white text-xs">{e.fullName}</div>
                  <div className="text-[10px] font-mono text-[#898293]">{e.eliteId}</div>
                </button>
              ))}
            </div>

            {/* Conversation Window */}
            <div className="lg:col-span-2 p-6 rounded-2xl bg-[#100D17] border border-[#292132] flex flex-col h-[480px]">
              <div className="pb-3 border-b border-[#292132] mb-4">
                <h3 className="font-bold text-white text-sm">
                  {activeConversation?.title || 'Dhiraj Roy (ELITE-2026-001)'}
                </h3>
                <span className="text-[10px] font-mono text-[#8CCF42]">Direct Encrypted Communication Active</span>
              </div>

              {/* Message History */}
              <div className="grow space-y-3 overflow-y-auto pr-2">
                <div className="p-3 rounded-xl bg-[#15111F] border border-[#292132] max-w-md text-xs">
                  <div className="text-[10px] font-mono text-[#898293] mb-1">Dhiraj Roy · 10:14 AM</div>
                  <div className="text-[#C5BED0] leading-relaxed">
                    Hi Marcus, I have completed the STRIDE analysis for the auth endpoints. Would love your thoughts on my proposed mitigation for the OTP challenge timing attack.
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#8000FF]/15 border border-[#8000FF]/30 max-w-md ml-auto text-xs">
                  <div className="text-[10px] font-mono text-[#BD7AFF] mb-1">Marcus Reynolds (You) · 10:45 AM</div>
                  <div className="text-white leading-relaxed">
                    Dhiraj, your analysis of constant-time buffer comparisons was spot-on. The grade and 350 XP award have been published to your ledger. Keep up the high standard.
                  </div>
                </div>
              </div>

              {/* Message Input */}
              <form onSubmit={handleSendMessage} className="pt-4 border-t border-[#292132] flex items-center gap-2 mt-auto">
                <input
                  type="text"
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder="Type feedback instruction to cadet..."
                  className="grow h-11 px-4 rounded-xl bg-[#15111F] border border-[#38264F] text-xs text-white focus:outline-none focus:border-[#8CCF42]"
                />
                <button
                  type="submit"
                  disabled={!replyMessage.trim()}
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
      {/* TAB 7: STUDY BRIEFS & RESOURCES                                */}
      {/* ============================================================== */}
      {activeNav === 'resources' && (
        <div className="space-y-6">
          <div>
            <h2 className="font-display text-2xl font-extrabold text-white">
              Curated <span className="text-[#8000FF]">Study Briefs</span>
            </h2>
            <p className="text-xs text-[#898293] mt-1 font-sans">
              Authoritative references, threat modeling matrices, and lab setups shared with Level 1 Catalyst.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { title: 'STRIDE Threat Modeling Taxonomy', tag: 'SECURITY ARCHITECTURE', est: '20 min read' },
              { title: 'mTLS & Cryptographic Verification', tag: 'ZERO TRUST', est: '35 min read' },
              { title: 'Memory Corruption: Linux Kernel Exploit Defense', tag: 'REVERSE ENGINEERING', est: '45 min read' },
            ].map((r, i) => (
              <div key={i} className="p-5 rounded-2xl bg-[#100D17] border border-[#292132] space-y-3">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#BD7AFF]/15 text-[#BD7AFF]">
                  {r.tag}
                </span>
                <h3 className="font-bold text-white text-base">{r.title}</h3>
                <div className="text-[11px] font-mono text-[#898293]">{r.est}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: STRUCTURED REVIEW & EVALUATION                          */}
      {/* ============================================================== */}
      {evaluatingSubmission && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#100D17] border border-[#38264F] rounded-2xl p-6 max-w-lg w-full shadow-2xl">
            <h3 className="font-display text-lg font-bold text-white mb-1">
              {isRevisionMode ? 'Request Submission Revision' : 'Structured Mentor Evaluation'}
            </h3>
            <p className="text-xs text-[#898293] mb-4">
              {isRevisionMode ? 'Provide actionable feedback for cadet to address.' : 'Award score, allocate XP, and write constructive remarks.'}
            </p>

            {isRevisionMode ? (
              <form onSubmit={handleRequestRevision} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-mono text-[#C5BED0] uppercase mb-1">
                    Specific Revision Instructions *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={revisionReason}
                    onChange={(e) => setRevisionReason(e.target.value)}
                    placeholder="e.g. Please expand section 3 on timing attack mitigations..."
                    className="w-full p-3 rounded-xl bg-[#15111F] border border-[#38264F] text-xs text-white"
                  />
                </div>
                <div className="flex items-center justify-end gap-2 pt-4 border-t border-[#292132]">
                  <button
                    type="button"
                    onClick={() => setIsRevisionMode(false)}
                    className="px-4 py-2 rounded-xl text-xs font-mono text-[#898293] hover:text-white cursor-pointer"
                  >
                    Back to Evaluation
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-[#F59E0B] hover:bg-[#D97706] text-xs font-mono font-bold text-black cursor-pointer"
                  >
                    Dispatch Revision Request
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleApproveEvaluation} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono text-[#C5BED0] uppercase mb-1">Score (out of 100) *</label>
                    <input
                      type="number"
                      required
                      min={0}
                      max={100}
                      value={evalScore}
                      onChange={(e) => setEvalScore(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl bg-[#15111F] border border-[#38264F] text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-[#C5BED0] uppercase mb-1">XP to Award *</label>
                    <input
                      type="number"
                      required
                      value={evalXp}
                      onChange={(e) => setEvalXp(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl bg-[#15111F] border border-[#38264F] text-xs text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-[#C5BED0] uppercase mb-1">Qualitative Feedback *</label>
                  <textarea
                    required
                    rows={4}
                    value={evalFeedback}
                    onChange={(e) => setEvalFeedback(e.target.value)}
                    placeholder="Enter detailed mentor feedback and technical critique..."
                    className="w-full p-3 rounded-xl bg-[#15111F] border border-[#38264F] text-xs text-white"
                  />
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-[#292132]">
                  <button
                    type="button"
                    onClick={() => setIsRevisionMode(true)}
                    className="text-xs font-mono text-[#F59E0B] hover:underline cursor-pointer"
                  >
                    Request Revision Instead
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setEvaluatingSubmission(null)}
                      className="px-4 py-2 rounded-xl text-xs font-mono text-[#898293] hover:text-white cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-[#8000FF] hover:bg-[#7000E0] text-xs font-mono font-bold text-white cursor-pointer"
                    >
                      Approve & Award XP
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* MODAL: CREATE TASK */}
      {showCreateTaskModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#100D17] border border-[#38264F] rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="font-display text-lg font-bold text-white mb-1">Author Assignment</h3>
            <p className="text-xs text-[#898293] mb-4">Add a new lab or exercise for your assigned cadets.</p>
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono text-[#C5BED0] uppercase mb-1">Task Title *</label>
                <input
                  type="text"
                  required
                  value={newTaskForm.title}
                  onChange={(e) => setNewTaskForm({ ...newTaskForm, title: e.target.value })}
                  placeholder="e.g. Memory Dump Timeline Reconstruction"
                  className="w-full h-10 px-3 rounded-xl bg-[#15111F] border border-[#38264F] text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono text-[#C5BED0] uppercase mb-1">Submission Format *</label>
                  <select
                    value={newTaskForm.format}
                    onChange={(e) => setNewTaskForm({ ...newTaskForm, format: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl bg-[#15111F] border border-[#38264F] text-xs text-white"
                  >
                    <option value="WRITTEN_REPORT">Written Report</option>
                    <option value="FILE_UPLOAD">File / ZIP Archive</option>
                    <option value="PRESENTATION">Presentation Deck</option>
                    <option value="LINK_SUBMISSION">Repository URL</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-[#C5BED0] uppercase mb-1">Reward XP *</label>
                  <input
                    type="number"
                    required
                    value={newTaskForm.maxXP}
                    onChange={(e) => setNewTaskForm({ ...newTaskForm, maxXP: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl bg-[#15111F] border border-[#38264F] text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-[#C5BED0] uppercase mb-1">Guidelines & Rubric *</label>
                <textarea
                  required
                  rows={3}
                  value={newTaskForm.description}
                  onChange={(e) => setNewTaskForm({ ...newTaskForm, description: e.target.value })}
                  placeholder="Detailed guidelines..."
                  className="w-full p-3 rounded-xl bg-[#15111F] border border-[#38264F] text-xs text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-[#292132]">
                <button
                  type="button"
                  onClick={() => setShowCreateTaskModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-mono text-[#898293] hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#8000FF] hover:bg-[#7000E0] text-xs font-mono font-bold text-white cursor-pointer"
                >
                  Publish to Elites
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </DashboardLayout>
  );
}

export default TaskMentorDashboard;
