import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Shield, RefreshCw, Layers } from 'lucide-react';
import { api } from '../api/client';
import SuperAdminDashboard from '../components/dashboard/SuperAdminDashboard';
import TaskMentorDashboard from '../components/dashboard/TaskMentorDashboard';
import EliteDashboard from '../components/dashboard/EliteDashboard';

export function DashboardRouter() {
  const navigate = useNavigate();
  const location = useLocation();

  const [isLoading, setIsLoading] = useState(true);
  const [sessionUser, setSessionUser] = useState(null);
  const [overrideRole, setOverrideRole] = useState(null); // Allows quick role previewing

  useEffect(() => {
    let isMounted = true;

    async function verifySession() {
      try {
        const res = await api.getSession();
        if (res?.data?.authenticated && res.data.user && isMounted) {
          setSessionUser(res.data.user);
        } else if (isMounted) {
          navigate('/login');
        }
      } catch (err) {
        if (isMounted) {
          navigate('/login');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    verifySession();
    return () => { isMounted = false; };
  }, [navigate]);

  const handleLogout = () => {
    setSessionUser(null);
    navigate('/login');
  };

  if (isLoading) {
    return (
      <main className="w-full min-h-screen bg-[#08070C] text-white flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 rounded-2xl bg-[#8000FF] flex items-center justify-center text-white mb-4 animate-pulse">
          <Shield size={24} />
        </div>
        <div className="flex items-center gap-2 font-mono text-xs text-[#8CCF42]">
          <RefreshCw size={14} className="animate-spin" />
          <span>ESTABLISHING ENCLAVE SESSION...</span>
        </div>
      </main>
    );
  }

  if (!sessionUser) {
    return null;
  }

  const effectiveRole = overrideRole || sessionUser.role;

  // Construct simulated user object if role override is active
  const activeUser = overrideRole ? {
    ...sessionUser,
    role: overrideRole,
    fullName: overrideRole === 'SUPER_ADMIN' ? 'System Master Super Admin' :
              overrideRole === 'ADMIN' ? 'Marcus Reynolds' : 'Dhiraj Roy',
    eliteId: overrideRole === 'ELITE' ? 'ELITE-2026-001' : null,
    xpBalance: overrideRole === 'ELITE' ? 2980 : null,
    streakDays: overrideRole === 'ELITE' ? 14 : null,
  } : sessionUser;

  return (
    <div className="relative">
      {/* Role View Rendering */}
      {sessionUser.role === 'SUPER_ADMIN' && (
        <SuperAdminDashboard user={sessionUser} onLogout={handleLogout} />
      )}
      {sessionUser.role === 'ADMIN' && (
        <TaskMentorDashboard user={sessionUser} onLogout={handleLogout} />
      )}
      {sessionUser.role === 'ELITE' && (
        <EliteDashboard user={sessionUser} onLogout={handleLogout} />
      )}
    </div>
  );
}

export default DashboardRouter;
