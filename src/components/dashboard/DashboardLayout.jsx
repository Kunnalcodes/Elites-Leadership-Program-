import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Shield, 
  LogOut, 
  Bell, 
  User, 
  ChevronDown, 
  CheckCircle2, 
  Flame, 
  Sparkles,
  ExternalLink,
  Menu,
  X,
  Award
} from 'lucide-react';
import { api } from '../../api/client';

export function DashboardLayout({ 
  user, 
  activeNav, 
  onNavChange, 
  navItems = [], 
  children,
  onLogout 
}) {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(2);

  useEffect(() => {
    // Fetch notifications if available
    async function loadNotifications() {
      try {
        const res = await api.getNotifications();
        if (res?.data?.notifications) {
          setNotifications(res.data.notifications);
        }
      } catch (err) {
        // Fallback default notifications for UI
        setNotifications([
          {
            id: 'notif-1',
            title: 'Sprint 04 Active',
            message: 'All Elites in Level 1 Catalyst must submit Task 001 for mentor review.',
            createdAt: new Date().toISOString(),
          },
          {
            id: 'notif-2',
            title: 'Marcus Reynolds Evaluated Submission',
            message: 'Your STRIDE Threat Modeling submission has been awarded 350 XP.',
            createdAt: new Date(Date.now() - 3600000).toISOString(),
          }
        ]);
      }
    }
    loadNotifications();
  }, []);

  const handleLogout = async () => {
    try {
      await api.logout();
    } catch (err) {
      // Ignore
    } finally {
      if (onLogout) onLogout();
      navigate('/login');
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return { label: 'SUPER ADMIN', color: 'bg-[#FF647B]/10 text-[#FF647B] border-[#FF647B]/40' };
      case 'ADMIN':
        return { label: 'TASK MENTOR', color: 'bg-[#BD7AFF]/10 text-[#BD7AFF] border-[#BD7AFF]/40' };
      case 'ELITE':
      default:
        return { label: 'ELITE CADET', color: 'bg-[#8CCF42]/10 text-[#8CCF42] border-[#8CCF42]/40' };
    }
  };

  const roleBadge = getRoleBadge(user?.role);

  return (
    <div className="min-h-screen bg-[#08070C] text-white flex flex-col selection:bg-[#8000FF] selection:text-white">
      {/* Top Authoritative Command Bar */}
      <header className="h-16 border-b border-[#292132] bg-[#100D17]/90 backdrop-blur-md sticky top-0 z-50 px-4 sm:px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-[#898293] hover:text-white hover:bg-[#15111F]"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-[#8000FF] flex items-center justify-center text-white shadow-md">
              <Shield size={18} />
            </div>
            <div className="hidden sm:block">
              <span className="font-display font-extrabold text-sm tracking-wider text-white">THREAD</span>
              <span className="font-display font-bold text-sm tracking-wider text-[#8000FF] ml-1">ELITE</span>
            </div>
          </Link>

          {/* Role Status Tag */}
          <div className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-mono font-bold tracking-wider uppercase border ${roleBadge.color}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
            {roleBadge.label}
          </div>
        </div>

        {/* Right Identity & Actions */}
        <div className="flex items-center gap-3">
          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setNotificationsOpen(!notificationsOpen);
                setUnreadCount(0);
              }}
              className="p-2 rounded-lg bg-[#15111F] border border-[#292132] text-[#898293] hover:text-white hover:border-[#8000FF] transition-all relative"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#FF647B] text-white text-[10px] font-mono font-bold flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 rounded-xl bg-[#100D17] border border-[#38264F] shadow-2xl p-4 z-50">
                <div className="flex items-center justify-between pb-3 border-b border-[#292132] mb-3">
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-white">Notifications</span>
                  <span className="text-[10px] font-mono text-[#898293]">{notifications.length} Total</span>
                </div>
                <div className="space-y-2.5 max-h-64 overflow-y-auto">
                  {notifications.map((n) => (
                    <div key={n.id} className="p-2.5 rounded-lg bg-[#15111F] border border-[#292132] text-xs">
                      <div className="font-bold text-white mb-0.5">{n.title}</div>
                      <div className="text-[11px] text-[#898293] leading-relaxed">{n.message}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Pill */}
          <div className="flex items-center gap-2.5 pl-3 border-l border-[#292132]">
            <div className="w-8 h-8 rounded-full bg-[#15111F] border border-[#38264F] flex items-center justify-center text-[#BD7AFF] font-bold text-xs uppercase">
              {user?.fullName ? user.fullName[0] : (user?.email ? user.email[0] : 'U')}
            </div>
            <div className="hidden lg:block text-left">
              <div className="text-xs font-bold text-white truncate max-w-[140px]">
                {user?.fullName || user?.email || 'User'}
              </div>
              <div className="text-[10px] font-mono text-[#898293] truncate max-w-[140px]">
                {user?.eliteId || user?.email}
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              title="Sign Out"
              className="p-2 rounded-lg text-[#898293] hover:text-[#FF647B] hover:bg-[#FF647B]/10 transition-colors ml-1 cursor-pointer"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace Frame */}
      <div className="flex grow">
        {/* Desktop Sidebar Navigation */}
        <aside className="hidden md:flex flex-col w-64 border-r border-[#292132] bg-[#100D17] shrink-0 p-4">
          <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#898293] px-3 mb-2">
            WORKSPACE NAVIGATION
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeNav === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onNavChange(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-mono text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#8000FF] text-white shadow-md'
                      : 'text-[#898293] hover:text-white hover:bg-[#15111F]'
                  }`}
                >
                  <Icon size={16} className={isActive ? 'text-white' : 'text-[#898293]'} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="ml-auto px-1.5 py-0.5 rounded text-[10px] bg-[#FF647B] text-white font-bold">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Quick Footer inside Sidebar */}
          <div className="mt-auto pt-4 border-t border-[#292132] text-[11px] font-mono text-[#898293] px-3">
            <div>THREAD ELITE OS v2.6</div>
            <div className="text-[#8CCF42] text-[10px] mt-0.5 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#8CCF42]" />
              Secure Enclave Online
            </div>
          </div>
        </aside>

        {/* Mobile Slide-down Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-x-0 top-16 bg-[#100D17] border-b border-[#292132] p-4 z-40 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeNav === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onNavChange(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-mono text-xs font-semibold ${
                    isActive ? 'bg-[#8000FF] text-white' : 'text-[#898293] hover:text-white'
                  }`}
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Main Content Area */}
        <main className="grow p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
