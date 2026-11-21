export const ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  MENTOR: 'MENTOR',
  ELITE: 'ELITE',
} as const;

export type UserRoleType = typeof ROLES[keyof typeof ROLES];

export const PROMOTION_LEVELS = [
  { levelOrder: 1, name: 'Foundation', slug: 'foundation', description: 'Orientation, core security fundamentals, and initial cohort integration.', requiredXP: 0, colorHex: '#3B82F6' },
  { levelOrder: 2, name: 'Catalyst', slug: 'catalyst', description: 'Active project involvement, collaborative problem solving, and skill acceleration.', requiredXP: 500, colorHex: '#10B981' },
  { levelOrder: 3, name: 'Pioneer', slug: 'pioneer', description: 'Advanced security research, independent technical tasks, and leadership initiatives.', requiredXP: 1200, colorHex: '#F59E0B' },
  { levelOrder: 4, name: 'Apex', slug: 'apex', description: 'High-impact technical deliverables, peer guidance, and strategic program contributions.', requiredXP: 2500, colorHex: '#8B5CF6' },
  { levelOrder: 5, name: 'Legacy', slug: 'legacy', description: 'Capstones, program advisory, mentor apprenticeships, and alumni transition.', requiredXP: 4500, colorHex: '#EC4899' },
] as const;

export const TASK_FORMATS = [
  'WRITTEN_RESPONSE',
  'LONG_FORM_DOCUMENT',
  'PDF_SUBMISSION',
  'DOC_DOCX_SUBMISSION',
  'PPT_PPTX_PRESENTATION',
  'SPREADSHEET',
  'IMAGE_SUBMISSION',
  'VIDEO_SUBMISSION',
  'AUDIO_SUBMISSION',
  'EXTERNAL_WEBSITE_LINK',
  'GITHUB_REPOSITORY_URL',
  'GOOGLE_DRIVE_LINK',
  'RESEARCH_ASSIGNMENT',
  'CODING_ASSIGNMENT',
  'MULTIPLE_CHOICE_ASSESSMENT',
  'MULTIPLE_SELECT_ASSESSMENT',
  'SHORT_ANSWER_ASSESSMENT',
  'LONG_ANSWER_ASSESSMENT',
  'QUIZ',
  'SURVEY_FEEDBACK_FORM',
  'LIVE_SESSION_ASSIGNMENT',
  'ATTENDANCE_PARTICIPATION_TASK',
  'MIXED_FORMAT_SUBMISSION',
] as const;

export const TASK_STATUSES = {
  DRAFT: 'DRAFT',
  SCHEDULED: 'SCHEDULED',
  PUBLISHED: 'PUBLISHED',
  ACTIVE: 'ACTIVE',
  SUBMISSION_RECEIVED: 'SUBMISSION_RECEIVED',
  UNDER_REVIEW: 'UNDER_REVIEW',
  GRADED: 'GRADED',
  RESULT_PUBLISHED: 'RESULT_PUBLISHED',
  COMPLETED: 'COMPLETED',
  PAUSED: 'PAUSED',
  CANCELLED: 'CANCELLED',
  EXPIRED: 'EXPIRED',
  REOPENED: 'REOPENED',
} as const;

export const SUBMISSION_STATUSES = {
  NOT_STARTED: 'NOT_STARTED',
  IN_PROGRESS: 'IN_PROGRESS',
  SUBMITTED: 'SUBMITTED',
  LATE_SUBMITTED: 'LATE_SUBMITTED',
  UNDER_REVIEW: 'UNDER_REVIEW',
  REVISION_REQUESTED: 'REVISION_REQUESTED',
  RESUBMITTED: 'RESUBMITTED',
  GRADED: 'GRADED',
  RESULT_PUBLISHED: 'RESULT_PUBLISHED',
  REJECTED: 'REJECTED',
  WITHDRAWN: 'WITHDRAWN',
} as const;

export const XP_TRANSACTION_TYPES = {
  TASK_COMPLETION: 'TASK_COMPLETION',
  ASSESSMENT: 'ASSESSMENT',
  PARTICIPATION: 'PARTICIPATION',
  LEADERSHIP: 'LEADERSHIP',
  BONUS: 'BONUS',
  EVENT_PARTICIPATION: 'EVENT_PARTICIPATION',
  MANUAL_ADJUSTMENT: 'MANUAL_ADJUSTMENT',
  PENALTY_DEDUCTION: 'PENALTY_DEDUCTION',
  REVERSAL: 'REVERSAL',
} as const;

export const INTEGRATION_SERVICES = [
  { name: 'postgresql', type: 'DATABASE', required: true, envVars: ['DATABASE_URL'] },
  { name: 'prisma', type: 'ORM', required: true, envVars: ['DATABASE_URL'] },
  { name: 'redis', type: 'QUEUE_CACHE', required: true, envVars: ['REDIS_URL'] },
  { name: 'bullmq', type: 'ASYNC_QUEUES', required: true, envVars: ['REDIS_URL'] },
  { name: 'resend', type: 'EMAIL_SERVICE', required: true, envVars: ['RESEND_API_KEY', 'EMAIL_FROM'] },
  { name: 'storage', type: 'OBJECT_STORAGE', required: false, envVars: ['GCS_BUCKET'] },
  { name: 'realtime_messaging', type: 'MESSAGING', required: true, envVars: [] },
  { name: 'scheduled_jobs', type: 'CRON_ENGINE', required: true, envVars: [] },
  { name: 'analytics', type: 'ANALYTICS_ENGINE', required: true, envVars: [] },
] as const;

export const PERMISSION_LIST = [
  { action: 'users:view', resource: 'users', description: 'View user directory' },
  { action: 'users:create', resource: 'users', description: 'Create new users' },
  { action: 'users:edit', resource: 'users', description: 'Edit user profiles' },
  { action: 'users:archive', resource: 'users', description: 'Archive and restore users' },
  { action: 'users:deactivate', resource: 'users', description: 'Deactivate user accounts' },
  { action: 'users:provision', resource: 'users', description: 'One-click provision dashboard access' },
  { action: 'promotions:manage', resource: 'promotions', description: 'Configure promotion levels' },
  { action: 'promotions:execute', resource: 'promotions', description: 'Promote an Elite to next level' },
  { action: 'tasks:create', resource: 'tasks', description: 'Create and configure tasks' },
  { action: 'tasks:publish', resource: 'tasks', description: 'Publish and distribute tasks' },
  { action: 'tasks:manage', resource: 'tasks', description: 'Reopen, pause or cancel tasks' },
  { action: 'submissions:view', resource: 'submissions', description: 'View elite submissions' },
  { action: 'grading:evaluate', resource: 'grading', description: 'Grade submissions with rubric' },
  { action: 'grading:publish', resource: 'grading', description: 'Publish grades and evaluation results' },
  { action: 'xp:award', resource: 'xp', description: 'Award XP to elites' },
  { action: 'xp:adjust', resource: 'xp', description: 'Manual XP adjustments with reason' },
  { action: 'leaderboard:manage', resource: 'leaderboard', description: 'Recalculate and publish leaderboard' },
  { action: 'announcements:create', resource: 'announcements', description: 'Compose and publish announcements' },
  { action: 'mentors:assign', resource: 'mentors', description: 'Assign mentors to elites' },
  { action: 'audit:view', resource: 'audit', description: 'Inspect administrative audit trails' },
  { action: 'settings:manage', resource: 'settings', description: 'Manage system settings and integrations' },
] as const;
