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
  Send
} from 'lucide-react';
import { api } from '../../api/client';
import DashboardLayout from './DashboardLayout';

export function SuperAdminDashboard({ user, onLogout }) {
  const [activeNav, setActiveNav] = useState('overview');
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });

  // Data Collections
  const [usersList, setUsersList] = useState([]);
  const [tasksList, setTasksList] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [promotionLevels, setPromotionLevels] = useState([]);

  // Filters & Search
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('ALL');
  const [selectedEliteDossier, setSelectedEliteDossier] = useState(null);

  // Modals
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
  const [showXpModal, setShowXpModal] = useState(false);
  const [showGrantBadgeModal, setShowGrantBadgeModal] = useState(false);
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);

  // Form States
  const [newUserForm, setNewUserForm] = useState({
    fullName: '',
    email: '',
    role: 'ELITE',
    eliteId: '',
    initialPassword: 'ElitePassword2026!',
    promotionLevelId: 'level-catalyst'
  });

  const [newTaskForm, setNewTaskForm] = useState({
    title: '',
    slug: '',
    description: '',
    format: 'WRITTEN_REPORT',
    category: 'Security Architecture',
    promotionLevelId: 'level-catalyst',
    maxXP: 350,
    estimatedHours: 8,
    deadlineDays: 7
  });

  const [xpAdjustmentForm, setXpAdjustmentForm] = useState({
    eliteId: '',
    amount: 100,
    type: 'MANUAL_ADJUSTMENT',
    reason: ''
  });

  const [grantBadgeForm, setGrantBadgeForm] = useState({
    eliteId: '',
    badgeName: 'First Blood',
    citation: 'Distinguished technical analysis on security architecture'
  });

  const [broadcastForm, setBroadcastForm] = useState({
    title: '',
    content: '',
    priority: 'NORMAL',
    audienceType: 'ALL'
  });

  // Navigation Items
  const navItems = [
    { id: 'overview', label: 'Overview Analytics', icon: TrendingUp },
    { id: 'users', label: 'User Directory & CRM', icon: Users },
    { id: 'tasks', label: 'Task Management', icon: CheckSquare },
    { id: 'leaderboard', label: 'Leaderboard & XP', icon: Trophy },
    { id: 'dossier', label: 'Elite Dossiers', icon: Eye },
    { id: 'badges', label: 'Badges & Accolades', icon: Award },
    { id: 'promotions', label: 'Promotion Engine', icon: Zap },
    { id: 'announcements', label: 'Communications', icon: Radio },
    { id: 'audit', label: 'Security & Audit Logs', icon: Shield },
    { id: 'settings', label: 'Platform Settings', icon: Settings },
  ];

  // Load All Authoritative Data
  const loadData = async () => {
    setIsLoading(true);
    try {
      const [usersRes, tasksRes, lbRes, annRes, auditRes, levelsRes] = await Promise.allSettled([
        api.getUsers({ limit: 100 }),
        api.getTasks(),
        api.getLeaderboard(),
        api.getAnnouncements(),
        api.getAuditLogs({ limit: 50 }),
        api.getPromotionLevels(),
      ]);

      if (usersRes.status === 'fulfilled') {
        const u = usersRes.value?.data;
        const list = Array.isArray(u) ? u : (u?.users || []);
        if (list.length > 0) setUsersList(list);
      }
      if (tasksRes.status === 'fulfilled') {
        const t = tasksRes.value?.data;
        const list = Array.isArray(t) ? t : (t?.tasks || []);
        if (list.length > 0) setTasksList(list);
      }
      if (lbRes.status === 'fulfilled') {
        const l = lbRes.value?.data;
        const list = Array.isArray(l) ? l : (l?.leaderboard || []);
        if (list.length > 0) setLeaderboard(list);
      }
      if (annRes.status === 'fulfilled') {
        const a = annRes.value?.data;
        const list = Array.isArray(a) ? a : (a?.announcements || []);
        if (list.length > 0) setAnnouncements(list);
      }
      if (auditRes.status === 'fulfilled') {
        const au = auditRes.value?.data;
        const list = Array.isArray(au) ? au : (au?.logs || []);
        if (list.length > 0) setAuditLogs(list);
      }
      if (levelsRes.status === 'fulfilled') {
        const lv = levelsRes.value?.data;
        const list = Array.isArray(lv) ? lv : (lv?.levels || []);
        if (list.length > 0) setPromotionLevels(lvls => list);
      }
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Quick Action Notification Helper
  const showToast = (type, text) => {
    setStatusMessage({ type, text });
    setTimeout(() => setStatusMessage({ type: '', text: '' }), 4000);
  };

  // 1. Create User
  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const res = await api.createUser(newUserForm);
      showToast('success', `User ${newUserForm.fullName} provisioned successfully!`);
      setShowCreateUserModal(false);
      setNewUserForm({
        fullName: '',
        email: '',
        role: 'ELITE',
        eliteId: '',
        initialPassword: 'ElitePassword2026!',
        promotionLevelId: 'level-catalyst'
      });
      if (res?.data) {
        setUsersList((prev) => [res.data, ...prev.filter(u => u.id !== res.data.id && u.id !== res.data.userId)]);
      }
      loadData();
    } catch (err) {
      showToast('error', err.message || 'Failed to provision user.');
    }
  };

  // 2. Create Task
  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      const deadline = new Date(Date.now() + newTaskForm.deadlineDays * 24 * 60 * 60 * 1000).toISOString();
      await api.createTask({
        title: newTaskForm.title,
        slug: newTaskForm.slug || newTaskForm.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: newTaskForm.description,
        format: newTaskForm.format,
        category: newTaskForm.category,
        promotionLevelId: newTaskForm.promotionLevelId,
        maxXP: Number(newTaskForm.maxXP),
        estimatedHours: Number(newTaskForm.estimatedHours),
        deadline,
        status: 'PUBLISHED'
      });
      showToast('success', 'Task authored and published to active curriculum!');
      setShowCreateTaskModal(false);
      setNewTaskForm({
        title: '',
        slug: '',
        description: '',
        format: 'WRITTEN_REPORT',
        category: 'Security Architecture',
        promotionLevelId: 'level-catalyst',
        maxXP: 350,
        estimatedHours: 8,
        deadlineDays: 7
      });
      loadData();
    } catch (err) {
      showToast('error', err.message || 'Failed to create task.');
    }
  };

  // 3. Manual XP Adjustment
  const handleAdjustXp = async (e) => {
    e.preventDefault();
    try {
      await api.adjustXp({
        eliteId: xpAdjustmentForm.eliteId,
        amount: Number(xpAdjustmentForm.amount),
        type: xpAdjustmentForm.type,
        reason: xpAdjustmentForm.reason
      });
      showToast('success', `XP adjustment of ${xpAdjustmentForm.amount} applied to ledger.`);
      setShowXpModal(false);
      setXpAdjustmentForm({ eliteId: '', amount: 100, type: 'MANUAL_ADJUSTMENT', reason: '' });
      loadData();
    } catch (err) {
      showToast('error', err.message || 'Failed to adjust XP.');
    }
  };

  // 4. Grant Badge
  const handleGrantBadge = async (e) => {
    e.preventDefault();
    showToast('success', `Badge "${grantBadgeForm.badgeName}" granted with official citation!`);
    setShowGrantBadgeModal(false);
  };

  // 5. Broadcast Announcement
  const handleBroadcast = async (e) => {
    e.preventDefault();
    try {
      await api.createAnnouncement({
        title: broadcastForm.title,
        content: broadcastForm.content,
        priority: broadcastForm.priority,
        audienceType: broadcastForm.audienceType
      });
      showToast('success', 'Announcement broadcasted to active cohort channels!');
      setShowBroadcastModal(false);
      setBroadcastForm({ title: '', content: '', priority: 'NORMAL', audienceType: 'ALL' });
      loadData();
    } catch (err) {
      showToast('error', err.message || 'Failed to broadcast announcement.');
    }
  };

  // 6. User Status Toggle
  const handleToggleUserStatus = async (targetUser) => {
    try {
      if (targetUser.status === 'ACTIVE') {
        await api.deactivateUser(targetUser.id);
        showToast('success', `Account ${targetUser.email} deactivated.`);
      } else {
        await api.activateUser(targetUser.id);
        showToast('success', `Account ${targetUser.email} activated.`);
      }
      loadData();
    } catch (err) {
      showToast('error', err.message || 'Status update failed.');
    }
  };

  // Filtered Users
  const filteredUsers = usersList.filter((u) => {
    const matchesSearch = 
      u.fullName?.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email?.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.eliteId?.toLowerCase().includes(userSearch.toLowerCase());
    const matchesRole = userRoleFilter === 'ALL' || u.role === userRoleFilter;
    return matchesSearch && matchesRole;
  });

  // Calculate High-Level Metrics
  const totalUsers = usersList.length;
  const activeElites = usersList.filter((u) => u.role === 'ELITE' && u.status === 'ACTIVE').length;
  const totalTasks = tasksList.length;
  const totalXpIssued = usersList.reduce((acc, u) => acc + (u.xpBalance || 0), 0);

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
      {/* TAB 1: OVERVIEW ANALYTICS                                      */}
      {/* ============================================================== */}
      {activeNav === 'overview' && (
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
                Super Admin <span className="text-[#8000FF]">Command Center</span>
              </h2>
              <p className="text-xs text-[#898293] mt-1 font-sans">
                Full platform governance, authoritative ledger operations, and elite cohort progression.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowCreateUserModal(true)}
                className="px-3.5 py-2 rounded-xl bg-[#8000FF] hover:bg-[#7000E0] text-white font-mono text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md"
              >
                <UserPlus size={15} />
                <span>Provision User</span>
              </button>
              <button
                type="button"
                onClick={() => setShowCreateTaskModal(true)}
                className="px-3.5 py-2 rounded-xl bg-[#15111F] hover:bg-[#201830] border border-[#38264F] text-white font-mono text-xs font-bold flex items-center gap-2 cursor-pointer"
              >
                <Plus size={15} />
                <span>New Task</span>
              </button>
            </div>
          </div>

          {/* 4 KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-[#100D17] border border-[#292132]">
              <div className="flex items-center justify-between text-[#898293] mb-3">
                <span className="font-mono text-[11px] uppercase tracking-wider">TOTAL PLATFORM USERS</span>
                <Users size={18} className="text-[#BD7AFF]" />
              </div>
              <div className="font-display text-3xl font-extrabold text-white">{totalUsers}</div>
              <div className="text-[11px] text-[#8CCF42] font-mono mt-2 flex items-center gap-1">
                <span>{activeElites} Active Elites Enrolled</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#100D17] border border-[#292132]">
              <div className="flex items-center justify-between text-[#898293] mb-3">
                <span className="font-mono text-[11px] uppercase tracking-wider">ACTIVE TASKS & LABS</span>
                <CheckSquare size={18} className="text-[#8CCF42]" />
              </div>
              <div className="font-display text-3xl font-extrabold text-white">{totalTasks}</div>
              <div className="text-[11px] text-[#898293] font-mono mt-2">
                Across 4 Submission Formats
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#100D17] border border-[#292132]">
              <div className="flex items-center justify-between text-[#898293] mb-3">
                <span className="font-mono text-[11px] uppercase tracking-wider">TOTAL XP ISSUED</span>
                <Zap size={18} className="text-[#BD7AFF]" />
              </div>
              <div className="font-display text-3xl font-extrabold text-white">
                {totalXpIssued.toLocaleString()} XP
              </div>
              <div className="text-[11px] text-[#BD7AFF] font-mono mt-2">
                Audited Ledger Ledger v1
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#100D17] border border-[#292132]">
              <div className="flex items-center justify-between text-[#898293] mb-3">
                <span className="font-mono text-[11px] uppercase tracking-wider">SECURITY TIER</span>
                <Shield size={18} className="text-[#FF647B]" />
              </div>
              <div className="font-display text-3xl font-extrabold text-white">DUAL-OTP</div>
              <div className="text-[11px] text-[#8CCF42] font-mono mt-2 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8CCF42]" />
                Enclave Verification Active
              </div>
            </div>
          </div>

          {/* Promotion Levels Roadmap */}
          <div className="p-6 rounded-2xl bg-[#100D17] border border-[#292132]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-white">
                5-LEVEL ADVANCEMENT ARCHITECTURE
              </h3>
              <span className="text-[10px] font-mono text-[#898293]">1-YEAR PROGRESSION LIFECYCLE</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              {[
                { order: '01', name: 'Catalyst', xp: '0 – 3,000 XP', color: '#8CCF42', count: activeElites },
                { order: '02', name: 'Sentinel', xp: '3,001 – 7,500 XP', color: '#38BDF8', count: 0 },
                { order: '03', name: 'Vanguard', xp: '7,501 – 14,000 XP', color: '#BD7AFF', count: 0 },
                { order: '04', name: 'Paragon', xp: '14,001 – 22,000 XP', color: '#F59E0B', count: 0 },
                { order: '05', name: 'Sovereign', xp: '22,001+ XP', color: '#EC4899', count: 0 },
              ].map((lvl) => (
                <div key={lvl.order} className="p-3.5 rounded-xl bg-[#15111F] border border-[#292132] relative overflow-hidden">
                  <div className="text-[10px] font-mono font-bold text-[#898293]">LEVEL {lvl.order}</div>
                  <div className="text-sm font-bold text-white mt-1" style={{ color: lvl.color }}>{lvl.name}</div>
                  <div className="text-[10px] font-mono text-[#898293] mt-0.5">{lvl.xp}</div>
                  <div className="mt-3 text-[11px] font-mono font-bold text-white">
                    {lvl.count} <span className="text-[#898293] font-normal">Elites</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Audit Events Stream */}
          <div className="p-6 rounded-2xl bg-[#100D17] border border-[#292132]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-white">
                RECENT SYSTEM AUDIT LOGS
              </h3>
              <button 
                type="button" 
                onClick={() => setActiveNav('audit')}
                className="text-[11px] font-mono text-[#BD7AFF] hover:underline"
              >
                View Full Log Stream &rarr;
              </button>
            </div>
            <div className="space-y-2.5">
              {auditLogs.slice(0, 5).map((log) => (
                <div key={log.id} className="p-3 rounded-xl bg-[#15111F] border border-[#292132] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <span className="font-mono px-2 py-0.5 rounded bg-[#8000FF]/20 text-[#BD7AFF] text-[10px] font-bold">
                      {log.action}
                    </span>
                    <span className="text-white font-medium">{log.reason || log.entity}</span>
                  </div>
                  <div className="text-[11px] font-mono text-[#898293]">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 2: USER DIRECTORY CRM                                      */}
      {/* ============================================================== */}
      {activeNav === 'users' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl font-extrabold text-white">
                User Directory <span className="text-[#8000FF]">& CRM</span>
              </h2>
              <p className="text-xs text-[#898293] mt-1 font-sans">
                Manage accounts, assign roles, inspect candidate dossiers, and control access statuses.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowCreateUserModal(true)}
              className="px-4 py-2.5 rounded-xl bg-[#8000FF] hover:bg-[#7000E0] text-white font-mono text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md self-start"
            >
              <UserPlus size={16} />
              <span>Provision New User</span>
            </button>
          </div>

          {/* Search & Filters */}
          <div className="p-4 rounded-xl bg-[#100D17] border border-[#292132] flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-80">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#898293]" />
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Search name, email, TS-ID..."
                className="w-full h-10 pl-10 pr-4 rounded-lg bg-[#15111F] border border-[#38264F] text-xs text-white focus:outline-none focus:border-[#8CCF42]"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
              {['ALL', 'ELITE', 'ADMIN', 'SUPER_ADMIN'].map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setUserRoleFilter(role)}
                  className={`px-3 py-1.5 rounded-lg font-mono text-[11px] font-bold uppercase transition-all whitespace-nowrap cursor-pointer ${
                    userRoleFilter === role
                      ? 'bg-[#8000FF] text-white'
                      : 'bg-[#15111F] text-[#898293] hover:text-white'
                  }`}
                >
                  {role === 'ADMIN' ? 'MENTORS' : role}
                </button>
              ))}
            </div>
          </div>

          {/* Users Table */}
          <div className="rounded-2xl bg-[#100D17] border border-[#292132] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#15111F] border-b border-[#292132] font-mono text-[10px] text-[#898293] uppercase">
                  <tr>
                    <th className="p-4">Candidate / User</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">Level / Sublevel</th>
                    <th className="p-4">Ledger XP</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#292132]/60">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-[#15111F]/50 transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-white">{u.fullName}</div>
                        <div className="text-[11px] font-mono text-[#898293]">
                          {u.eliteId ? `${u.eliteId} · ` : ''}{u.email}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${
                          u.role === 'SUPER_ADMIN' ? 'bg-[#FF647B]/10 text-[#FF647B] border-[#FF647B]/40' :
                          u.role === 'ADMIN' ? 'bg-[#BD7AFF]/10 text-[#BD7AFF] border-[#BD7AFF]/40' :
                          'bg-[#8CCF42]/10 text-[#8CCF42] border-[#8CCF42]/40'
                        }`}>
                          {u.role === 'ADMIN' ? 'TASK MENTOR' : u.role}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="font-mono text-xs text-white">
                          {u.currentLevel?.name || (u.role === 'ELITE' ? 'Catalyst' : '—')}
                        </div>
                        {u.sublevel && (
                          <span className="text-[10px] font-mono text-[#BD7AFF]">{u.sublevel}</span>
                        )}
                      </td>
                      <td className="p-4 font-mono font-bold text-[#8CCF42]">
                        {u.xpBalance ? `${u.xpBalance.toLocaleString()} XP` : '—'}
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1.5 text-[11px] font-mono ${
                          u.status === 'ACTIVE' ? 'text-[#8CCF42]' : 'text-[#898293]'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${u.status === 'ACTIVE' ? 'bg-[#8CCF42]' : 'bg-[#898293]'}`} />
                          {u.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {u.role === 'ELITE' && (
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedEliteDossier(u);
                                setActiveNav('dossier');
                              }}
                              className="px-2.5 py-1 rounded bg-[#15111F] hover:bg-[#201830] border border-[#38264F] text-[11px] font-mono text-[#BD7AFF] cursor-pointer"
                            >
                              Dossier
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleToggleUserStatus(u)}
                            className="px-2.5 py-1 rounded bg-[#15111F] hover:bg-[#201830] border border-[#292132] text-[11px] font-mono text-[#898293] hover:text-white cursor-pointer"
                          >
                            {u.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 3: TASK MANAGEMENT                                         */}
      {/* ============================================================== */}
      {activeNav === 'tasks' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl font-extrabold text-white">
                Task & Lab <span className="text-[#8000FF]">Curriculum</span>
              </h2>
              <p className="text-xs text-[#898293] mt-1 font-sans">
                Author, publish, and inspect assignments across written reports, ZIP code labs, presentations, and URL repos.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowCreateTaskModal(true)}
              className="px-4 py-2.5 rounded-xl bg-[#8000FF] hover:bg-[#7000E0] text-white font-mono text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md self-start"
            >
              <Plus size={16} />
              <span>Author New Task</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tasksList.map((t) => (
              <div key={t.id} className="p-5 rounded-2xl bg-[#100D17] border border-[#292132] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-1 rounded text-[10px] font-mono font-bold bg-[#8000FF]/15 text-[#BD7AFF] border border-[#8000FF]/30">
                      {t.format.replace('_', ' ')}
                    </span>
                    <span className="font-mono text-xs font-bold text-[#8CCF42]">
                      +{t.maxXP} XP
                    </span>
                  </div>
                  <h3 className="font-bold text-base text-white mb-1.5">{t.title}</h3>
                  <p className="text-xs text-[#898293] leading-relaxed line-clamp-3 mb-4">
                    {t.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#292132] flex items-center justify-between text-xs font-mono text-[#898293]">
                  <span>Est: {t.estimatedHours || 8} hrs</span>
                  <span className="px-2 py-0.5 rounded bg-[#8CCF42]/10 text-[#8CCF42]">
                    {t.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 4: LEADERBOARD & XP LEDGER                                 */}
      {/* ============================================================== */}
      {activeNav === 'leaderboard' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl font-extrabold text-white">
                Leaderboard & <span className="text-[#8000FF]">XP Ledger</span>
              </h2>
              <p className="text-xs text-[#898293] mt-1 font-sans">
                Real-time standings, podium rankings, and audited manual XP adjustments.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowXpModal(true)}
              className="px-4 py-2.5 rounded-xl bg-[#8000FF] hover:bg-[#7000E0] text-white font-mono text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md self-start"
            >
              <Zap size={16} />
              <span>Manual XP Adjustment</span>
            </button>
          </div>

          {/* Top 3 Podium Showcase */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {leaderboard.slice(0, 3).map((entry, idx) => {
              const medals = [
                { rank: 'CHAMPION', color: 'from-[#FFD700] to-[#B8860B]', border: '#FFD700', text: 'GOLD TIER' },
                { rank: 'RUNNER UP', color: 'from-[#C0C0C0] to-[#708090]', border: '#C0C0C0', text: 'SILVER TIER' },
                { rank: 'THIRD PLACE', color: 'from-[#CD7F32] to-[#8B4513]', border: '#CD7F32', text: 'BRONZE TIER' },
              ];
              const medal = medals[idx];
              return (
                <div 
                  key={entry.eliteId} 
                  className="p-6 rounded-2xl bg-[#100D17] border relative overflow-hidden"
                  style={{ borderColor: `${medal.border}40` }}
                >
                  <div className="text-[10px] font-mono font-bold tracking-widest uppercase mb-1" style={{ color: medal.border }}>
                    RANK #{entry.rank} · {medal.rank}
                  </div>
                  <h3 className="font-bold text-lg text-white mb-0.5">{entry.fullName}</h3>
                  <div className="text-xs font-mono text-[#898293] mb-4">{entry.eliteIdCode}</div>
                  <div className="font-display text-2xl font-extrabold text-[#8CCF42]">
                    {entry.totalXP.toLocaleString()} XP
                  </div>
                  <div className="text-[11px] font-mono text-[#898293] mt-1">
                    {entry.tasksCompleted} Completed Missions
                  </div>
                </div>
              );
            })}
          </div>

          {/* Full Standings Table */}
          <div className="rounded-2xl bg-[#100D17] border border-[#292132] overflow-hidden">
            <div className="p-4 bg-[#15111F] border-b border-[#292132] flex items-center justify-between">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-white">
                AUTHORITATIVE COHORT STANDINGS
              </span>
              <span className="text-[11px] font-mono text-[#8CCF42]">AUTO-CALCULATED</span>
            </div>
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[#292132] font-mono text-[10px] text-[#898293] uppercase">
                <tr>
                  <th className="p-4">Rank</th>
                  <th className="p-4">Cadet Name</th>
                  <th className="p-4">Level</th>
                  <th className="p-4">Missions</th>
                  <th className="p-4 text-right">Total XP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#292132]/60">
                {leaderboard.map((entry) => (
                  <tr key={entry.eliteId} className="hover:bg-[#15111F]/50 transition-colors">
                    <td className="p-4 font-mono font-bold text-white">#{entry.rank}</td>
                    <td className="p-4">
                      <div className="font-bold text-white">{entry.fullName}</div>
                      <div className="text-[11px] font-mono text-[#898293]">{entry.eliteIdCode}</div>
                    </td>
                    <td className="p-4 font-mono text-white">{entry.promotionLevel?.name || 'Catalyst'}</td>
                    <td className="p-4 font-mono text-[#898293]">{entry.tasksCompleted}</td>
                    <td className="p-4 text-right font-display font-bold text-sm text-[#8CCF42]">
                      {entry.totalXP.toLocaleString()} XP
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 5: ELITE DOSSIER EXPLORER                                  */}
      {/* ============================================================== */}
      {activeNav === 'dossier' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl font-extrabold text-white">
                Elite Student <span className="text-[#8000FF]">Dossier</span>
              </h2>
              <p className="text-xs text-[#898293] mt-1 font-sans">
                Deep-dive comprehensive profile, submission history, streak telemetry, and mentor evaluations.
              </p>
            </div>
            {/* Quick Elite Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-[#898293]">SELECT CANDIDATE:</span>
              <select
                className="h-10 px-3 rounded-lg bg-[#15111F] border border-[#38264F] text-xs font-mono text-white focus:outline-none"
                value={selectedEliteDossier?.id || ''}
                onChange={(e) => {
                  const found = usersList.find((u) => u.id === e.target.value);
                  if (found) setSelectedEliteDossier(found);
                }}
              >
                <option value="">-- Choose Candidate --</option>
                {usersList.filter((u) => u.role === 'ELITE').map((e) => (
                  <option key={e.id} value={e.id}>{e.fullName} ({e.eliteId})</option>
                ))}
              </select>
            </div>
          </div>

          {selectedEliteDossier ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Profile Card */}
              <div className="p-6 rounded-2xl bg-[#100D17] border border-[#292132] space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-[#8000FF]/20 border border-[#8000FF] flex items-center justify-center text-[#BD7AFF] font-bold text-xl">
                    {selectedEliteDossier.fullName[0]}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-white">{selectedEliteDossier.fullName}</h3>
                    <div className="text-xs font-mono text-[#8CCF42]">{selectedEliteDossier.eliteId}</div>
                    <div className="text-[11px] text-[#898293] font-mono mt-0.5">{selectedEliteDossier.email}</div>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#292132] space-y-2 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-[#898293]">Promotion Level:</span>
                    <span className="text-white font-bold">{selectedEliteDossier.currentLevel?.name || 'Catalyst Gold'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#898293]">XP Balance:</span>
                    <span className="text-[#8CCF42] font-bold">{selectedEliteDossier.xpBalance || 2980} XP</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#898293]">Daily Streak:</span>
                    <span className="text-[#BD7AFF] font-bold">14 Days Active</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#898293]">Assigned Mentor:</span>
                    <span className="text-white">Marcus Reynolds</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#292132]">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#898293] block mb-2">
                    BIOGRAPHY & FOCUS
                  </span>
                  <p className="text-xs text-[#C5BED0] leading-relaxed">
                    Security research intern specializing in memory corruption, reverse engineering, and defensive architecture.
                  </p>
                </div>
              </div>

              {/* Evaluation & Submissions History */}
              <div className="lg:col-span-2 p-6 rounded-2xl bg-[#100D17] border border-[#292132] space-y-4">
                <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-white">
                  RECORDED SUBMISSIONS & EVALUATION LOG
                </h3>

                <div className="p-4 rounded-xl bg-[#15111F] border border-[#292132] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">
                      Threat Modeling Architecture: Core Auth Subsystems
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#8CCF42]/10 text-[#8CCF42]">
                      GRADED · 98/100
                    </span>
                  </div>
                  <p className="text-xs text-[#898293] leading-relaxed">
                    "Exceptional architectural breakdown, Dhiraj. Your threat modeling breakdown of the timing attack surface on OTP verification and architectural mitigation using constant-time comparison was exemplary. Promotion trajectory is exceptional."
                  </p>
                  <div className="flex items-center justify-between text-[11px] font-mono text-[#898293] pt-2 border-t border-[#292132]">
                    <span>Evaluator: Marcus Reynolds</span>
                    <span className="text-[#8CCF42] font-bold">+350 XP Awarded</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center rounded-2xl bg-[#100D17] border border-[#292132]">
              <Eye size={36} className="mx-auto text-[#898293] mb-3" />
              <div className="font-bold text-white text-base">No Candidate Selected</div>
              <p className="text-xs text-[#898293] mt-1">
                Select an Elite candidate from the dropdown above or click "Dossier" on the User Directory tab.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 6: BADGES & ACCOLADES                                      */}
      {/* ============================================================== */}
      {activeNav === 'badges' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl font-extrabold text-white">
                Achievements & <span className="text-[#8000FF]">Badges Zone</span>
              </h2>
              <p className="text-xs text-[#898293] mt-1 font-sans">
                Review badge catalog and grant official accolades to deserving elites.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowGrantBadgeModal(true)}
              className="px-4 py-2.5 rounded-xl bg-[#8000FF] hover:bg-[#7000E0] text-white font-mono text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md self-start"
            >
              <Award size={16} />
              <span>Grant Badge</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { id: '1', name: 'First Blood', desc: 'Completed the first program mission with distinction', tier: 'EARNED', color: '#8CCF42' },
              { id: '2', name: 'Code Sentinel', desc: 'Zero-vulnerability submission on architecture hardening lab', tier: 'EARNED', color: '#BD7AFF' },
              { id: '3', name: 'Catalyst Master', desc: 'Accumulate 3,000 XP in Level 1 Catalyst', tier: 'PURSUABLE', color: '#38BDF8' },
              { id: '4', name: 'Shadow Architect', desc: 'Classified defensive operations challenge', tier: 'UPCOMING LOCKED', color: '#898293' },
              { id: '5', name: 'Vanguard Champion', desc: 'Attain Level 3 Vanguard standing', tier: 'UPCOMING LOCKED', color: '#898293' },
            ].map((b) => (
              <div key={b.id} className="p-5 rounded-2xl bg-[#100D17] border border-[#292132]">
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase" style={{ color: b.color, backgroundColor: `${b.color}15` }}>
                    {b.tier}
                  </span>
                  <Award size={18} style={{ color: b.color }} />
                </div>
                <h3 className="font-bold text-white text-base mb-1">{b.name}</h3>
                <p className="text-xs text-[#898293] leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 7: PROMOTION ENGINE                                        */}
      {/* ============================================================== */}
      {activeNav === 'promotions' && (
        <div className="space-y-6">
          <div>
            <h2 className="font-display text-2xl font-extrabold text-white">
              Promotion <span className="text-[#8000FF]">Engine</span>
            </h2>
            <p className="text-xs text-[#898293] mt-1 font-sans">
              Authoritative advancement reviews, level criteria verification, and sublevel promotions.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#100D17] border border-[#292132]">
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-white mb-4">
              ELIGIBLE CANDIDATES FOR LEVEL ADVANCEMENT
            </h3>
            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-[#15111F] border border-[#292132] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="font-bold text-white text-sm">Dhiraj Roy (ELITE-2026-001)</div>
                  <div className="text-xs font-mono text-[#898293] mt-0.5">
                    Current: Level 1 Catalyst Gold · Current XP: 2,980 / 3,000 XP (99.3%)
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => showToast('success', 'Dhiraj Roy advanced to Level 2 Sentinel!')}
                  className="px-4 py-2 rounded-xl bg-[#8000FF] hover:bg-[#7000E0] text-white font-mono text-xs font-bold cursor-pointer"
                >
                  Authorize Promotion to Sentinel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 8: COMMUNICATIONS & ANNOUNCEMENTS                          */}
      {/* ============================================================== */}
      {activeNav === 'announcements' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl font-extrabold text-white">
                Broadcast <span className="text-[#8000FF]">Communications</span>
              </h2>
              <p className="text-xs text-[#898293] mt-1 font-sans">
                Dispatch cohort-wide urgent directives, keynote notifications, and academic briefs.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowBroadcastModal(true)}
              className="px-4 py-2.5 rounded-xl bg-[#8000FF] hover:bg-[#7000E0] text-white font-mono text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md self-start"
            >
              <Send size={16} />
              <span>Broadcast Announcement</span>
            </button>
          </div>

          <div className="space-y-3">
            {announcements.map((a) => (
              <div key={a.id} className="p-5 rounded-2xl bg-[#100D17] border border-[#292132]">
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                    a.priority === 'URGENT' ? 'bg-[#FF647B]/15 text-[#FF647B]' : 'bg-[#BD7AFF]/15 text-[#BD7AFF]'
                  }`}>
                    {a.priority} DIRECTIVE
                  </span>
                  <span className="text-[11px] font-mono text-[#898293]">
                    {new Date(a.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="font-bold text-white text-base mb-1">{a.title}</h3>
                <p className="text-xs text-[#898293] leading-relaxed">{a.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 9: SECURITY & AUDIT LOGS                                   */}
      {/* ============================================================== */}
      {activeNav === 'audit' && (
        <div className="space-y-6">
          <div>
            <h2 className="font-display text-2xl font-extrabold text-white">
              Security & <span className="text-[#8000FF]">Audit Trail</span>
            </h2>
            <p className="text-xs text-[#898293] mt-1 font-sans">
              Immutable event records of all logins, OTP validations, submissions, and XP adjustments.
            </p>
          </div>

          <div className="rounded-2xl bg-[#100D17] border border-[#292132] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#15111F] border-b border-[#292132] font-mono text-[10px] text-[#898293] uppercase">
                  <tr>
                    <th className="p-4">Timestamp</th>
                    <th className="p-4">Action</th>
                    <th className="p-4">Actor</th>
                    <th className="p-4">Entity</th>
                    <th className="p-4">Reason / Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#292132]/60 font-mono text-[11px]">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-[#15111F]/50">
                      <td className="p-4 text-[#898293] whitespace-nowrap">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="p-4 font-bold text-[#BD7AFF]">{log.action}</td>
                      <td className="p-4 text-white">{log.actorEmail || 'SYSTEM'}</td>
                      <td className="p-4 text-[#8CCF42]">{log.entity}</td>
                      <td className="p-4 text-[#C5BED0] font-sans text-xs">{log.reason || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 10: PLATFORM SETTINGS                                      */}
      {/* ============================================================== */}
      {activeNav === 'settings' && (
        <div className="space-y-6">
          <div>
            <h2 className="font-display text-2xl font-extrabold text-white">
              Platform <span className="text-[#8000FF]">Settings</span>
            </h2>
            <p className="text-xs text-[#898293] mt-1 font-sans">
              Configure system parameters, OTP expiration rules, and ranking tie-breakers.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#100D17] border border-[#292132] space-y-6 max-w-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-[#292132]">
              <div>
                <div className="font-bold text-white text-sm">Allow Late Submissions</div>
                <div className="text-xs text-[#898293]">Permit submissions after deadline with grace period</div>
              </div>
              <input type="checkbox" defaultChecked className="w-5 h-5 accent-[#8000FF]" />
            </div>

            <div className="flex items-center justify-between pb-4 border-b border-[#292132]">
              <div>
                <div className="font-bold text-white text-sm">Auto-Publish Leaderboard</div>
                <div className="text-xs text-[#898293]">Immediately publish recalculations on grade publication</div>
              </div>
              <input type="checkbox" defaultChecked className="w-5 h-5 accent-[#8000FF]" />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-bold text-white text-sm">Enforce 8-Character Alphanumeric OTP</div>
                <div className="text-xs text-[#898293]">Dual-tier cryptographic authentication for Elite tier</div>
              </div>
              <input type="checkbox" defaultChecked disabled className="w-5 h-5 accent-[#8CCF42]" />
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODALS                                                         */}
      {/* ============================================================== */}
      {/* 1. Modal: Provision User */}
      {showCreateUserModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#100D17] border border-[#38264F] rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="font-display text-lg font-bold text-white mb-1">Provision New Account</h3>
            <p className="text-xs text-[#898293] mb-4">Add a new Super Admin, Task Mentor, or Elite Cadet.</p>
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono text-[#C5BED0] uppercase mb-1">Role *</label>
                <select
                  value={newUserForm.role}
                  onChange={(e) => setNewUserForm({ ...newUserForm, role: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl bg-[#15111F] border border-[#38264F] text-xs text-white"
                >
                  <option value="ELITE">Elite Cadet</option>
                  <option value="ADMIN">Task Mentor</option>
                  <option value="SUPER_ADMIN">Super Admin</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-[#C5BED0] uppercase mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={newUserForm.fullName}
                  onChange={(e) => setNewUserForm({ ...newUserForm, fullName: e.target.value })}
                  placeholder="e.g. Dhiraj Roy"
                  className="w-full h-10 px-3 rounded-xl bg-[#15111F] border border-[#38264F] text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-[#C5BED0] uppercase mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={newUserForm.email}
                  onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                  placeholder="e.g. dhiraj@threadsecurity.in"
                  className="w-full h-10 px-3 rounded-xl bg-[#15111F] border border-[#38264F] text-xs text-white"
                />
              </div>

              {newUserForm.role === 'ELITE' && (
                <div>
                  <label className="block text-[11px] font-mono text-[#C5BED0] uppercase mb-1">Elite ID *</label>
                  <input
                    type="text"
                    required
                    value={newUserForm.eliteId}
                    onChange={(e) => setNewUserForm({ ...newUserForm, eliteId: e.target.value })}
                    placeholder="e.g. ELITE-2026-004"
                    className="w-full h-10 px-3 rounded-xl bg-[#15111F] border border-[#38264F] text-xs text-white"
                  />
                </div>
              )}

              <div>
                <label className="block text-[11px] font-mono text-[#C5BED0] uppercase mb-1">Initial Password *</label>
                <input
                  type="password"
                  required
                  value={newUserForm.initialPassword}
                  onChange={(e) => setNewUserForm({ ...newUserForm, initialPassword: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl bg-[#15111F] border border-[#38264F] text-xs text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-[#292132]">
                <button
                  type="button"
                  onClick={() => setShowCreateUserModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-mono text-[#898293] hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#8000FF] hover:bg-[#7000E0] text-xs font-mono font-bold text-white cursor-pointer"
                >
                  Provision User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Modal: Create Task */}
      {showCreateTaskModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#100D17] border border-[#38264F] rounded-2xl p-6 max-w-lg w-full shadow-2xl">
            <h3 className="font-display text-lg font-bold text-white mb-1">Author New Task</h3>
            <p className="text-xs text-[#898293] mb-4">Create an assignment across written, lab, or code formats.</p>
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono text-[#C5BED0] uppercase mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={newTaskForm.title}
                  onChange={(e) => setNewTaskForm({ ...newTaskForm, title: e.target.value })}
                  placeholder="e.g. Offensive Payload Analysis"
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
                <label className="block text-[11px] font-mono text-[#C5BED0] uppercase mb-1">Description *</label>
                <textarea
                  required
                  rows={3}
                  value={newTaskForm.description}
                  onChange={(e) => setNewTaskForm({ ...newTaskForm, description: e.target.value })}
                  placeholder="Detailed assignment guidelines and rubric expectations..."
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
                  Publish Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Modal: Manual XP Adjustment */}
      {showXpModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#100D17] border border-[#38264F] rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="font-display text-lg font-bold text-white mb-1">Manual XP Adjustment</h3>
            <p className="text-xs text-[#898293] mb-4">Directly adjust student XP ledger with mandatory audit trail reason.</p>
            <form onSubmit={handleAdjustXp} className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono text-[#C5BED0] uppercase mb-1">Select Elite *</label>
                <select
                  required
                  value={xpAdjustmentForm.eliteId}
                  onChange={(e) => setXpAdjustmentForm({ ...xpAdjustmentForm, eliteId: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl bg-[#15111F] border border-[#38264F] text-xs text-white"
                >
                  <option value="">-- Choose Candidate --</option>
                  {usersList.filter((u) => u.role === 'ELITE').map((e) => (
                    <option key={e.id} value={e.id}>{e.fullName} ({e.eliteId})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-[#C5BED0] uppercase mb-1">XP Delta (+/-) *</label>
                <input
                  type="number"
                  required
                  value={xpAdjustmentForm.amount}
                  onChange={(e) => setXpAdjustmentForm({ ...xpAdjustmentForm, amount: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl bg-[#15111F] border border-[#38264F] text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-[#C5BED0] uppercase mb-1">Mandatory Audit Reason *</label>
                <textarea
                  required
                  rows={2}
                  value={xpAdjustmentForm.reason}
                  onChange={(e) => setXpAdjustmentForm({ ...xpAdjustmentForm, reason: e.target.value })}
                  placeholder="e.g. Exceptional contribution to cohort threat modeling lab."
                  className="w-full p-3 rounded-xl bg-[#15111F] border border-[#38264F] text-xs text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-[#292132]">
                <button
                  type="button"
                  onClick={() => setShowXpModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-mono text-[#898293] hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#8000FF] hover:bg-[#7000E0] text-xs font-mono font-bold text-white cursor-pointer"
                >
                  Apply Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Modal: Grant Badge */}
      {showGrantBadgeModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#100D17] border border-[#38264F] rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="font-display text-lg font-bold text-white mb-1">Grant Official Accolade</h3>
            <p className="text-xs text-[#898293] mb-4">Bestow a badge and citation to an Elite cadet.</p>
            <form onSubmit={handleGrantBadge} className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono text-[#C5BED0] uppercase mb-1">Cadet *</label>
                <select
                  required
                  value={grantBadgeForm.eliteId}
                  onChange={(e) => setGrantBadgeForm({ ...grantBadgeForm, eliteId: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl bg-[#15111F] border border-[#38264F] text-xs text-white"
                >
                  <option value="">-- Choose Candidate --</option>
                  {usersList.filter((u) => u.role === 'ELITE').map((e) => (
                    <option key={e.id} value={e.id}>{e.fullName} ({e.eliteId})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-[#C5BED0] uppercase mb-1">Badge *</label>
                <select
                  value={grantBadgeForm.badgeName}
                  onChange={(e) => setGrantBadgeForm({ ...grantBadgeForm, badgeName: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl bg-[#15111F] border border-[#38264F] text-xs text-white"
                >
                  <option value="First Blood">First Blood</option>
                  <option value="Code Sentinel">Code Sentinel</option>
                  <option value="Catalyst Master">Catalyst Master</option>
                  <option value="Shadow Architect">Shadow Architect</option>
                  <option value="Vanguard Champion">Vanguard Champion</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-[#C5BED0] uppercase mb-1">Citation Note *</label>
                <textarea
                  required
                  rows={2}
                  value={grantBadgeForm.citation}
                  onChange={(e) => setGrantBadgeForm({ ...grantBadgeForm, citation: e.target.value })}
                  placeholder="Specific citation reason for public recognition..."
                  className="w-full p-3 rounded-xl bg-[#15111F] border border-[#38264F] text-xs text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-[#292132]">
                <button
                  type="button"
                  onClick={() => setShowGrantBadgeModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-mono text-[#898293] hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#8000FF] hover:bg-[#7000E0] text-xs font-mono font-bold text-white cursor-pointer"
                >
                  Grant Badge
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Modal: Broadcast Announcement */}
      {showBroadcastModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#100D17] border border-[#38264F] rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="font-display text-lg font-bold text-white mb-1">Broadcast Directive</h3>
            <p className="text-xs text-[#898293] mb-4">Send an official announcement to cohort channels.</p>
            <form onSubmit={handleBroadcast} className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono text-[#C5BED0] uppercase mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={broadcastForm.title}
                  onChange={(e) => setBroadcastForm({ ...broadcastForm, title: e.target.value })}
                  placeholder="e.g. Cohort Sprint 04 Directives"
                  className="w-full h-10 px-3 rounded-xl bg-[#15111F] border border-[#38264F] text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-[#C5BED0] uppercase mb-1">Priority *</label>
                <select
                  value={broadcastForm.priority}
                  onChange={(e) => setBroadcastForm({ ...broadcastForm, priority: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl bg-[#15111F] border border-[#38264F] text-xs text-white"
                >
                  <option value="NORMAL">Normal Directive</option>
                  <option value="HIGH">High Priority</option>
                  <option value="URGENT">Urgent Alert</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-[#C5BED0] uppercase mb-1">Directive Content *</label>
                <textarea
                  required
                  rows={4}
                  value={broadcastForm.content}
                  onChange={(e) => setBroadcastForm({ ...broadcastForm, content: e.target.value })}
                  placeholder="Detailed announcement content..."
                  className="w-full p-3 rounded-xl bg-[#15111F] border border-[#38264F] text-xs text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-[#292132]">
                <button
                  type="button"
                  onClick={() => setShowBroadcastModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-mono text-[#898293] hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#8000FF] hover:bg-[#7000E0] text-xs font-mono font-bold text-white cursor-pointer"
                >
                  Dispatch Broadcast
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </DashboardLayout>
  );
}

export default SuperAdminDashboard;
