import { Task, DashboardStatsData } from '../types/task';

export const DEFAULT_CATEGORIES = [
  'Engineering',
  'Design',
  'Product',
  'Marketing',
  'Personal',
  'Operations',
];

export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getDateOffsetString(daysOffset: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function isOverdue(dueDate: string, dueTime?: string, status?: string): boolean {
  if (status === 'completed') return false;
  if (!dueDate) return false;

  const todayStr = getTodayDateString();
  if (dueDate < todayStr) return true;

  if (dueDate === todayStr && dueTime) {
    const now = new Date();
    const currentHours = String(now.getHours()).padStart(2, '0');
    const currentMinutes = String(now.getMinutes()).padStart(2, '0');
    const currentTimeStr = `${currentHours}:${currentMinutes}`;
    return dueTime < currentTimeStr;
  }

  return false;
}

export function isDueToday(dueDate: string): boolean {
  if (!dueDate) return false;
  return dueDate === getTodayDateString();
}

export function isDueTomorrow(dueDate: string): boolean {
  if (!dueDate) return false;
  return dueDate === getDateOffsetString(1);
}

export function getDaysDiff(dueDate: string): number {
  if (!dueDate) return 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [y, m, d] = dueDate.split('-').map(Number);
  const target = new Date(y, m - 1, d);
  target.setHours(0, 0, 0, 0);

  const diffTime = target.getTime() - today.getTime();
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
}

export function formatDueDateLabel(dueDate: string, dueTime?: string, status?: string): {
  text: string;
  type: 'overdue' | 'today' | 'tomorrow' | 'upcoming' | 'completed';
} {
  if (status === 'completed') {
    return { text: 'Completed', type: 'completed' };
  }

  const overdue = isOverdue(dueDate, dueTime, status);
  const days = getDaysDiff(dueDate);

  if (overdue) {
    const absDays = Math.abs(days);
    if (absDays === 0) {
      return { text: `Overdue (${dueTime || 'today'})`, type: 'overdue' };
    }
    return { text: `Overdue by ${absDays} ${absDays === 1 ? 'day' : 'days'}`, type: 'overdue' };
  }

  if (days === 0) {
    return { text: dueTime ? `Today at ${dueTime}` : 'Due today', type: 'today' };
  }

  if (days === 1) {
    return { text: dueTime ? `Tomorrow at ${dueTime}` : 'Tomorrow', type: 'tomorrow' };
  }

  if (days > 1 && days <= 7) {
    const [y, m, d] = dueDate.split('-').map(Number);
    const dateObj = new Date(y, m - 1, d);
    const weekday = dateObj.toLocaleDateString(undefined, { weekday: 'short' });
    return { text: `${weekday} (in ${days}d)`, type: 'upcoming' };
  }

  // Format YYYY-MM-DD to readable MMM D
  const [y, m, d] = dueDate.split('-').map(Number);
  const dateObj = new Date(y, m - 1, d);
  const formatted = dateObj.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  return { text: dueTime ? `${formatted}, ${dueTime}` : formatted, type: 'upcoming' };
}

export function calculateDashboardStats(tasks: Task[]): DashboardStatsData {
  const total = tasks.length;
  let completed = 0;
  let pending = 0;
  let inProgress = 0;
  let overdue = 0;
  let dueToday = 0;
  let criticalCount = 0;
  let highCount = 0;

  for (const t of tasks) {
    if (t.status === 'completed') {
      completed++;
    } else {
      if (t.status === 'in_progress') {
        inProgress++;
      } else {
        pending++;
      }

      if (isOverdue(t.dueDate, t.dueTime, t.status)) {
        overdue++;
      }

      if (isDueToday(t.dueDate)) {
        dueToday++;
      }
    }

    if (t.priority === 'critical' && t.status !== 'completed') {
      criticalCount++;
    }
    if (t.priority === 'high' && t.status !== 'completed') {
      highCount++;
    }
  }

  const completionRate = total === 0 ? 0 : Math.round((completed / total) * 100);

  return {
    total,
    completed,
    pending: pending + inProgress,
    inProgress,
    overdue,
    dueToday,
    completionRate,
    criticalCount,
    highCount,
  };
}

export function getSampleInitialTasks(): Task[] {
  const today = getTodayDateString();
  const yesterday = getDateOffsetString(-1);
  const twoDaysAgo = getDateOffsetString(-2);
  const tomorrow = getDateOffsetString(1);
  const inThreeDays = getDateOffsetString(3);
  const nextWeek = getDateOffsetString(7);

  return [
    {
      id: 'task-1',
      title: 'Review production deployment checklist & security headers',
      description: 'Audit Content-Security-Policy, cache-control headers, and verify SSL certificate expiration alerts.',
      category: 'Engineering',
      priority: 'critical',
      status: 'pending',
      dueDate: yesterday,
      dueTime: '17:00',
      estimatedMinutes: 45,
      subtasks: [
        { id: 'sub-1', title: 'Verify CSP rules and frame-ancestors', completed: true },
        { id: 'sub-2', title: 'Run automated SSL labs assessment', completed: false },
        { id: 'sub-3', title: 'Confirm database failover replication health', completed: false },
      ],
      tags: ['Security', 'DevOps', 'Release'],
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      completedAt: null,
    },
    {
      id: 'task-2',
      title: 'Finalize quarterly product roadmap presentation',
      description: 'Synthesize user feedback surveys, cross-reference Q3 delivery velocity, and align with leadership team.',
      category: 'Product',
      priority: 'high',
      status: 'in_progress',
      dueDate: today,
      dueTime: '15:30',
      estimatedMinutes: 90,
      subtasks: [
        { id: 'sub-4', title: 'Draft key milestone timeline', completed: true },
        { id: 'sub-5', title: 'Embed revenue retention cohort chart', completed: true },
        { id: 'sub-6', title: 'Rehearse slide transitions with team leads', completed: false },
      ],
      tags: ['Strategy', 'Leadership'],
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
      completedAt: null,
    },
    {
      id: 'task-3',
      title: 'Design component library tokens for dark theme',
      description: 'Refine contrast ratios for secondary surfaces, focus rings, and hair-line border borders according to WCAG AA standard.',
      category: 'Design',
      priority: 'medium',
      status: 'pending',
      dueDate: tomorrow,
      dueTime: '12:00',
      estimatedMinutes: 60,
      subtasks: [
        { id: 'sub-7', title: 'Audit button hover states in dark mode', completed: true },
        { id: 'sub-8', title: 'Export Figma token styles into Tailwind theme', completed: false },
      ],
      tags: ['Figma', 'UI/UX'],
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 86400000).toISOString(),
      completedAt: null,
    },
    {
      id: 'task-4',
      title: 'Optimize API response caching for task search queries',
      description: 'Implement debounced query normalization and indexed client-side cache to reduce redundant renders.',
      category: 'Engineering',
      priority: 'high',
      status: 'completed',
      dueDate: twoDaysAgo,
      dueTime: '18:00',
      estimatedMinutes: 120,
      subtasks: [
        { id: 'sub-9', title: 'Profile search render latency', completed: true },
        { id: 'sub-10', title: 'Write unit tests for query sanitization', completed: true },
      ],
      tags: ['Performance', 'Frontend'],
      createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
      updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      completedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
      id: 'task-5',
      title: 'Schedule monthly team retrospective and health check',
      description: 'Collect anonymous team survey inputs, prepare agenda boards, and book the meeting space.',
      category: 'Operations',
      priority: 'low',
      status: 'pending',
      dueDate: inThreeDays,
      dueTime: '10:00',
      estimatedMinutes: 30,
      subtasks: [
        { id: 'sub-11', title: 'Distribute survey questionnaire', completed: false },
        { id: 'sub-12', title: 'Book room and AV equipment', completed: false },
      ],
      tags: ['Culture', 'Operations'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      completedAt: null,
    },
    {
      id: 'task-6',
      title: 'Prepare customer onboarding email drip series',
      description: 'Draft 4 lifecycle emails targeting new signups with interactive tutorials and feature highlights.',
      category: 'Marketing',
      priority: 'medium',
      status: 'pending',
      dueDate: nextWeek,
      dueTime: '16:00',
      estimatedMinutes: 75,
      subtasks: [
        { id: 'sub-13', title: 'Copywriting for Welcome email', completed: true },
        { id: 'sub-14', title: 'Setup conversion tracking links', completed: false },
      ],
      tags: ['Growth', 'Copywriting'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      completedAt: null,
    },
    {
      id: 'task-7',
      title: 'Annual health checkup and vision exam',
      description: 'Bring updated prescription cards and schedule routine preventive screening appointment.',
      category: 'Personal',
      priority: 'low',
      status: 'completed',
      dueDate: yesterday,
      dueTime: '09:00',
      estimatedMinutes: 60,
      subtasks: [],
      tags: ['Wellness', 'Health'],
      createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
      updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
      completedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    },
  ];
}

export function getCategoryColor(category: string): {
  bg: string;
  text: string;
  border: string;
  dot: string;
  badgeBg: string;
} {
  const norm = (category || '').toLowerCase().trim();

  if (norm.includes('eng') || norm.includes('code') || norm.includes('dev') || norm.includes('tech')) {
    return {
      bg: 'bg-blue-500/10 dark:bg-blue-500/15',
      text: 'text-blue-700 dark:text-blue-300',
      border: 'border-blue-300/60 dark:border-blue-800/60',
      dot: 'bg-blue-500',
      badgeBg: 'bg-blue-50 dark:bg-blue-950/60',
    };
  }

  if (norm.includes('des') || norm.includes('ui') || norm.includes('ux') || norm.includes('brand') || norm.includes('art')) {
    return {
      bg: 'bg-fuchsia-500/10 dark:bg-fuchsia-500/15',
      text: 'text-fuchsia-700 dark:text-fuchsia-300',
      border: 'border-fuchsia-300/60 dark:border-fuchsia-800/60',
      dot: 'bg-fuchsia-500',
      badgeBg: 'bg-fuchsia-50 dark:bg-fuchsia-950/60',
    };
  }

  if (norm.includes('mark') || norm.includes('growth') || norm.includes('sales') || norm.includes('seo')) {
    return {
      bg: 'bg-rose-500/10 dark:bg-rose-500/15',
      text: 'text-rose-700 dark:text-rose-300',
      border: 'border-rose-300/60 dark:border-rose-800/60',
      dot: 'bg-rose-500',
      badgeBg: 'bg-rose-50 dark:bg-rose-950/60',
    };
  }

  if (norm.includes('prod') || norm.includes('plan') || norm.includes('feature') || norm.includes('spec')) {
    return {
      bg: 'bg-purple-500/10 dark:bg-purple-500/15',
      text: 'text-purple-700 dark:text-purple-300',
      border: 'border-purple-300/60 dark:border-purple-800/60',
      dot: 'bg-purple-500',
      badgeBg: 'bg-purple-50 dark:bg-purple-950/60',
    };
  }

  if (norm.includes('oper') || norm.includes('admin') || norm.includes('infra') || norm.includes('legal')) {
    return {
      bg: 'bg-emerald-500/10 dark:bg-emerald-500/15',
      text: 'text-emerald-700 dark:text-emerald-300',
      border: 'border-emerald-300/60 dark:border-emerald-800/60',
      dot: 'bg-emerald-500',
      badgeBg: 'bg-emerald-50 dark:bg-emerald-950/60',
    };
  }

  if (norm.includes('res') || norm.includes('data') || norm.includes('anal')) {
    return {
      bg: 'bg-amber-500/10 dark:bg-amber-500/15',
      text: 'text-amber-700 dark:text-amber-300',
      border: 'border-amber-300/60 dark:border-amber-800/60',
      dot: 'bg-amber-500',
      badgeBg: 'bg-amber-50 dark:bg-amber-950/60',
    };
  }

  // Personal or General fallback
  if (norm.includes('person') || norm.includes('life') || norm.includes('health')) {
    return {
      bg: 'bg-teal-500/10 dark:bg-teal-500/15',
      text: 'text-teal-700 dark:text-teal-300',
      border: 'border-teal-300/60 dark:border-teal-800/60',
      dot: 'bg-teal-500',
      badgeBg: 'bg-teal-50 dark:bg-teal-950/60',
    };
  }

  return {
    bg: 'bg-indigo-500/10 dark:bg-indigo-500/15',
    text: 'text-indigo-700 dark:text-indigo-300',
    border: 'border-indigo-300/60 dark:border-indigo-800/60',
    dot: 'bg-indigo-500',
    badgeBg: 'bg-indigo-50 dark:bg-indigo-950/60',
  };
}
