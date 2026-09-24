export type TaskPriority = 'critical' | 'high' | 'medium' | 'low';

export type TaskStatus = 'pending' | 'in_progress' | 'completed';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string; // Format: YYYY-MM-DD
  dueTime?: string; // Format: HH:mm
  estimatedMinutes?: number;
  subtasks: Subtask[];
  tags: string[];
  createdAt: string; // ISO
  updatedAt: string; // ISO
  completedAt?: string | null;
}

export type StatusFilterType = 'all' | 'pending' | 'in_progress' | 'completed' | 'overdue' | 'due_today';

export type SortOption =
  | 'dueDateAsc'
  | 'dueDateDesc'
  | 'priorityDesc'
  | 'priorityAsc'
  | 'createdDesc'
  | 'alphabetical';

export type ViewMode = 'list' | 'board' | 'calendar' | 'analytics';

export interface TaskFilterState {
  searchQuery: string;
  category: string; // 'all' or specific
  priority: string; // 'all' or specific TaskPriority
  status: StatusFilterType;
  sortBy: SortOption;
  selectedTag: string; // 'all' or specific tag
}

export interface DashboardStatsData {
  total: number;
  completed: number;
  pending: number;
  inProgress: number;
  overdue: number;
  dueToday: number;
  completionRate: number;
  criticalCount: number;
  highCount: number;
}
