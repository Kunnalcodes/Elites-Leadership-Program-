/**
 * Thread Elite Central Authoritative API Client
 * Connects frontend interfaces to the backend modular monolith API v1
 */

const BASE_URL = '/api/v1';

async function request(endpoint, options = {}) {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include', // Automatically passes HttpOnly session cookies
    ...options,
  };

  if (options.body && typeof options.body !== 'string' && !(options.body instanceof FormData)) {
    config.body = JSON.stringify(options.body);
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, config);
  const json = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMsg = json?.error?.message || json?.message || 'Server request failed';
    const error = new Error(errorMsg);
    error.statusCode = response.status;
    error.code = json?.error?.code;
    error.details = json?.error?.details;
    throw error;
  }

  return json;
}

export const api = {
  // Auth
  validateIdentity: (identifier) => request('/auth/validate-identity', { method: 'POST', body: { identifier } }),
  superAdminLogin: (email, password) => request('/auth/super-admin/login', { method: 'POST', body: { email, password } }),
  adminLogin: (email, password) => request('/auth/admin/login', { method: 'POST', body: { email, password } }),
  superAdminClearanceLogin: (secretKey, passkey) => request('/auth/super-admin/login', { method: 'POST', body: { secretKey, passkey } }),
  mentorClearanceLogin: (secretKey, passkey) => request('/auth/admin/login', { method: 'POST', body: { secretKey, passkey } }),
  eliteLogin: (eliteId, password) => request('/auth/elite/login', { method: 'POST', body: { eliteId, password } }),
  verifyOtp: (challengeId, otpCode) => request('/auth/otp/verify', { method: 'POST', body: { challengeId, otpCode } }),
  resendOtp: (challengeId) => request('/auth/otp/resend', { method: 'POST', body: { challengeId } }),
  getSession: () => request('/auth/session', { method: 'GET' }),
  logout: () => request('/auth/logout', { method: 'POST' }),
  logoutAll: () => request('/auth/logout-all', { method: 'POST' }),

  // User CRM & Provisioning
  getUsers: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/users${query ? `?${query}` : ''}`, { method: 'GET' });
  },
  getUserById: (id) => request(`/users/${id}`, { method: 'GET' }),
  createUser: (data) => request('/users', { method: 'POST', body: data }),
  provisionDashboardAccess: (data) => request('/users/provision-dashboard-access', { method: 'POST', body: data }),
  archiveUser: (id) => request(`/users/${id}/archive`, { method: 'POST' }),
  restoreUser: (id) => request(`/users/${id}/restore`, { method: 'POST' }),
  deactivateUser: (id) => request(`/users/${id}/deactivate`, { method: 'POST' }),
  activateUser: (id) => request(`/users/${id}/activate`, { method: 'POST' }),

  // Promotions & 5 Levels
  getPromotionLevels: () => request('/promotion-levels', { method: 'GET' }),
  getPromotionLevelById: (id) => request(`/promotion-levels/${id}`, { method: 'GET' }),
  promoteElite: (eliteId, data) => request(`/elites/${eliteId}/promote`, { method: 'POST', body: data }),
  getPromotionHistory: (eliteId) => request(`/elites/${eliteId}/promotion-history`, { method: 'GET' }),

  // Tasks
  getTasks: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/tasks${query ? `?${query}` : ''}`, { method: 'GET' });
  },
  getTaskById: (id) => request(`/tasks/${id}`, { method: 'GET' }),
  createTask: (data) => request('/tasks', { method: 'POST', body: data }),
  publishTask: (id) => request(`/tasks/${id}/publish`, { method: 'POST' }),

  // Submissions & Grading
  submitTask: (taskId, data) => request(`/tasks/${taskId}/submissions`, { method: 'POST', body: data }),
  getSubmissions: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/submissions${query ? `?${query}` : ''}`, { method: 'GET' });
  },
  getSubmissionById: (id) => request(`/submissions/${id}`, { method: 'GET' }),
  evaluateSubmission: (id, data) => request(`/submissions/${id}/evaluate`, { method: 'POST', body: data }),
  publishResult: (id) => request(`/submissions/${id}/publish-result`, { method: 'POST' }),
  requestRevision: (id, reason) => request(`/submissions/${id}/request-revision`, { method: 'POST', body: { reason } }),

  // XP & Leaderboard
  getXpTransactions: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/xp/transactions${query ? `?${query}` : ''}`, { method: 'GET' });
  },
  adjustXp: (data) => request('/xp/adjustments', { method: 'POST', body: data }),
  getLeaderboard: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/leaderboards${query ? `?${query}` : ''}`, { method: 'GET' });
  },
  getTopThree: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/leaderboards/top-three${query ? `?${query}` : ''}`, { method: 'GET' });
  },
  publishLeaderboard: (data) => request('/leaderboards/publish', { method: 'POST', body: data }),

  // Communication
  getAnnouncements: () => request('/announcements', { method: 'GET' }),
  createAnnouncement: (data) => request('/announcements', { method: 'POST', body: data }),
  publishAnnouncement: (id) => request(`/announcements/${id}/publish`, { method: 'POST' }),
  getNotifications: () => request('/notifications', { method: 'GET' }),
  markNotificationRead: (id) => request(`/notifications/${id}/read`, { method: 'POST' }),
  markAllNotificationsRead: () => request('/notifications/read-all', { method: 'POST' }),

  // Mentors & Messaging
  getMentors: () => request('/mentors', { method: 'GET' }),
  assignMentor: (data) => request('/mentors/assign', { method: 'POST', body: data }),
  getMentorWorkspace: () => request('/mentors/my-elites', { method: 'GET' }),
  getConversations: () => request('/conversations', { method: 'GET' }),
  startConversation: (data) => request('/conversations', { method: 'POST', body: data }),
  getMessages: (convId) => request(`/conversations/${convId}/messages`, { method: 'GET' }),
  sendMessage: (convId, data) => request(`/conversations/${convId}/messages`, { method: 'POST', body: data }),

  // CRM Timeline
  getEliteTimeline: (id) => request(`/crm/elites/${id}/timeline`, { method: 'GET' }),
  addCrmNote: (id, data) => request(`/crm/elites/${id}/notes`, { method: 'POST', body: data }),

  // Analytics
  getSuperAdminAnalytics: () => request('/analytics/super-admin', { method: 'GET' }),
  getAdminAnalytics: () => request('/analytics/admin', { method: 'GET' }),
  getEliteAnalytics: () => request('/analytics/elite', { method: 'GET' }),
  getPromotionLevelAnalytics: (levelId) => request(`/analytics/level/${levelId}`, { method: 'GET' }),

  // Audit
  getAuditLogs: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/audit${query ? `?${query}` : ''}`, { method: 'GET' });
  },

  // Settings & Integrations
  getIntegrations: () => request('/settings/integrations', { method: 'GET' }),
};
