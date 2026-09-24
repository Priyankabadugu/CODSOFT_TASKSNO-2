import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  Task,
  TaskFilterState,
  StatusFilterType,
  SortOption,
  ViewMode,
  DashboardStatsData,
  TaskPriority,
} from '../types/task';
import {
  calculateDashboardStats,
  getSampleInitialTasks,
  DEFAULT_CATEGORIES,
  isOverdue,
  isDueToday,
  getTodayDateString,
} from '../utils/taskHelpers';
import { useToast } from './ToastContext';

const TASKS_STORAGE_KEY = 'auratask_persisted_tasks_v1';
const VIEW_MODE_STORAGE_KEY = 'auratask_view_mode_preference';

interface TaskContextType {
  tasks: Task[];
  stats: DashboardStatsData;
  filterState: TaskFilterState;
  filteredTasks: Task[];
  categories: string[];
  tags: string[];
  selectedTaskIds: string[];
  viewMode: ViewMode;
  isTaskModalOpen: boolean;
  editingTask: Task | null;
  defaultModalCategory?: string;

  // Actions
  addTask: (data: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'completedAt'>) => Task;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string, allowUndo?: boolean) => void;
  toggleTaskStatus: (id: string) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;
  duplicateTask: (id: string) => void;
  
  // Selection
  toggleSelectTask: (id: string) => void;
  selectAllVisible: () => void;
  clearSelection: () => void;
  batchCompleteSelected: () => void;
  batchDeleteSelected: () => void;
  batchSetCategory: (category: string) => void;

  // Modals
  openCreateModal: (defaultCategory?: string) => void;
  openEditModal: (task: Task) => void;
  closeTaskModal: () => void;
  setViewMode: (mode: ViewMode) => void;

  // Filters
  setSearchQuery: (q: string) => void;
  setCategoryFilter: (cat: string) => void;
  setPriorityFilter: (p: string) => void;
  setStatusFilter: (s: StatusFilterType) => void;
  setSortBy: (sort: SortOption) => void;
  setSelectedTag: (tag: string) => void;
  resetFilters: () => void;

  // Data management
  exportJSON: () => void;
  exportCSV: () => void;
  importJSON: (rawJson: string) => { success: boolean; message: string };
  resetToDefaults: () => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { showToast } = useToast();

  // Load tasks from localStorage or initialize with sample tasks
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const stored = localStorage.getItem(TASKS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length >= 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error loading tasks from localStorage', e);
    }
    return getSampleInitialTasks();
  });

  // Save to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
    } catch (e) {
      console.error('Failed to save tasks to localStorage', e);
      showToast('Local storage limit exceeded or unavailable', 'error');
    }
  }, [tasks, showToast]);

  // View mode
  const [viewMode, setViewModeState] = useState<ViewMode>(() => {
    try {
      const saved = localStorage.getItem(VIEW_MODE_STORAGE_KEY);
      if (saved === 'list' || saved === 'board' || saved === 'calendar' || saved === 'analytics') {
        return saved;
      }
    } catch {
      // ignore
    }
    return 'list';
  });

  const setViewMode = (mode: ViewMode) => {
    setViewModeState(mode);
    try {
      localStorage.setItem(VIEW_MODE_STORAGE_KEY, mode);
    } catch {
      // ignore
    }
  };

  // Filter state
  const [filterState, setFilterState] = useState<TaskFilterState>({
    searchQuery: '',
    category: 'all',
    priority: 'all',
    status: 'all',
    sortBy: 'dueDateAsc',
    selectedTag: 'all',
  });

  // Selected tasks for batch actions
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([]);

  // Modal state
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [defaultModalCategory, setDefaultModalCategory] = useState<string | undefined>(undefined);

  // Derived categories
  const categories = useMemo(() => {
    const set = new Set<string>(DEFAULT_CATEGORIES);
    tasks.forEach((t) => {
      if (t.category && t.category.trim()) {
        set.add(t.category.trim());
      }
    });
    return Array.from(set);
  }, [tasks]);

  // Derived tags
  const tags = useMemo(() => {
    const set = new Set<string>();
    tasks.forEach((t) => {
      t.tags?.forEach((tag) => set.add(tag.trim()));
    });
    return Array.from(set).filter(Boolean);
  }, [tasks]);

  // Stats calculation
  const stats = useMemo(() => calculateDashboardStats(tasks), [tasks]);

  // Priority ranking mapping for sorting
  const priorityRank: Record<TaskPriority, number> = {
    critical: 4,
    high: 3,
    medium: 2,
    low: 1,
  };

  // Filtered and sorted tasks
  const filteredTasks = useMemo(() => {
    return tasks
      .filter((task) => {
        // Search query filter
        if (filterState.searchQuery.trim()) {
          const query = filterState.searchQuery.toLowerCase();
          const matchTitle = task.title.toLowerCase().includes(query);
          const matchDesc = task.description?.toLowerCase().includes(query);
          const matchCat = task.category?.toLowerCase().includes(query);
          const matchTags = task.tags?.some((t) => t.toLowerCase().includes(query));
          if (!matchTitle && !matchDesc && !matchCat && !matchTags) {
            return false;
          }
        }

        // Category filter
        if (filterState.category !== 'all' && task.category !== filterState.category) {
          return false;
        }

        // Priority filter
        if (filterState.priority !== 'all' && task.priority !== filterState.priority) {
          return false;
        }

        // Tag filter
        if (filterState.selectedTag !== 'all' && !task.tags?.includes(filterState.selectedTag)) {
          return false;
        }

        // Status filter
        if (filterState.status === 'completed') {
          return task.status === 'completed';
        }
        if (filterState.status === 'pending') {
          return task.status !== 'completed';
        }
        if (filterState.status === 'in_progress') {
          return task.status === 'in_progress';
        }
        if (filterState.status === 'overdue') {
          return isOverdue(task.dueDate, task.dueTime, task.status);
        }
        if (filterState.status === 'due_today') {
          return isDueToday(task.dueDate) && task.status !== 'completed';
        }

        return true;
      })
      .sort((a, b) => {
        // Completed items always sort slightly below incomplete items unless filtering for completed
        if (filterState.status === 'all') {
          if (a.status === 'completed' && b.status !== 'completed') return 1;
          if (a.status !== 'completed' && b.status === 'completed') return -1;
        }

        switch (filterState.sortBy) {
          case 'dueDateAsc': {
            if (!a.dueDate) return 1;
            if (!b.dueDate) return -1;
            const cmp = a.dueDate.localeCompare(b.dueDate);
            if (cmp !== 0) return cmp;
            return (a.dueTime || '').localeCompare(b.dueTime || '');
          }
          case 'dueDateDesc': {
            if (!a.dueDate) return 1;
            if (!b.dueDate) return -1;
            const cmp = b.dueDate.localeCompare(a.dueDate);
            if (cmp !== 0) return cmp;
            return (b.dueTime || '').localeCompare(a.dueTime || '');
          }
          case 'priorityDesc': {
            const diff = priorityRank[b.priority] - priorityRank[a.priority];
            if (diff !== 0) return diff;
            return (a.dueDate || '').localeCompare(b.dueDate || '');
          }
          case 'priorityAsc': {
            const diff = priorityRank[a.priority] - priorityRank[b.priority];
            if (diff !== 0) return diff;
            return (a.dueDate || '').localeCompare(b.dueDate || '');
          }
          case 'createdDesc': {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          }
          case 'alphabetical': {
            return a.title.localeCompare(b.title);
          }
          default:
            return 0;
        }
      });
  }, [tasks, filterState]);

  // Actions
  const addTask = useCallback(
    (data: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'completedAt'>): Task => {
      const now = new Date().toISOString();
      const newTask: Task = {
        ...data,
        id: `task_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        createdAt: now,
        updatedAt: now,
        completedAt: data.status === 'completed' ? now : null,
      };

      setTasks((prev) => [newTask, ...prev]);
      showToast(`Task "${data.title.slice(0, 30)}" created`, 'success');
      return newTask;
    },
    [showToast]
  );

  const updateTask = useCallback(
    (id: string, updates: Partial<Task>) => {
      const now = new Date().toISOString();
      setTasks((prev) =>
        prev.map((t) => {
          if (t.id === id) {
            const nextStatus = updates.status !== undefined ? updates.status : t.status;
            let completedAt = t.completedAt;
            if (updates.status !== undefined) {
              if (updates.status === 'completed' && t.status !== 'completed') {
                completedAt = now;
              } else if (updates.status !== 'completed') {
                completedAt = null;
              }
            }
            return {
              ...t,
              ...updates,
              completedAt,
              updatedAt: now,
            };
          }
          return t;
        })
      );
      showToast('Task updated', 'success');
    },
    [showToast]
  );

  const deleteTask = useCallback(
    (id: string, allowUndo = true) => {
      const taskToDelete = tasks.find((t) => t.id === id);
      if (!taskToDelete) return;

      setTasks((prev) => prev.filter((t) => t.id !== id));
      setSelectedTaskIds((prev) => prev.filter((tid) => tid !== id));

      if (allowUndo) {
        showToast(
          `Deleted "${taskToDelete.title.slice(0, 24)}..."`,
          'info',
          {
            label: 'Undo',
            onClick: () => {
              setTasks((prev) => [taskToDelete, ...prev]);
              showToast('Task restored', 'success');
            },
          },
          5000
        );
      } else {
        showToast('Task deleted', 'info');
      }
    },
    [tasks, showToast]
  );

  const toggleTaskStatus = useCallback(
    (id: string) => {
      const now = new Date().toISOString();
      setTasks((prev) =>
        prev.map((t) => {
          if (t.id === id) {
            const nextStatus = t.status === 'completed' ? 'pending' : 'completed';
            const willBeCompleted = nextStatus === 'completed';
            return {
              ...t,
              status: nextStatus,
              completedAt: willBeCompleted ? now : null,
              updatedAt: now,
              // mark all subtasks completed if completing whole task
              subtasks: willBeCompleted
                ? t.subtasks.map((s) => ({ ...s, completed: true }))
                : t.subtasks,
            };
          }
          return t;
        })
      );
    },
    []
  );

  const toggleSubtask = useCallback((taskId: string, subtaskId: string) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === taskId) {
          const updatedSubtasks = task.subtasks.map((st) =>
            st.id === subtaskId ? { ...st, completed: !st.completed } : st
          );
          // If all subtasks are now completed, optionally recommend or keep task status
          return {
            ...task,
            subtasks: updatedSubtasks,
            updatedAt: new Date().toISOString(),
          };
        }
        return task;
      })
    );
  }, []);

  const duplicateTask = useCallback(
    (id: string) => {
      const target = tasks.find((t) => t.id === id);
      if (!target) return;

      const now = new Date().toISOString();
      const duplicated: Task = {
        ...target,
        id: `task_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        title: `${target.title} (Copy)`,
        status: 'pending',
        completedAt: null,
        subtasks: target.subtasks.map((s) => ({
          ...s,
          id: `sub_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
          completed: false,
        })),
        createdAt: now,
        updatedAt: now,
      };

      setTasks((prev) => [duplicated, ...prev]);
      showToast('Task duplicated', 'success');
    },
    [tasks, showToast]
  );

  // Selection actions
  const toggleSelectTask = useCallback((id: string) => {
    setSelectedTaskIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  }, []);

  const selectAllVisible = useCallback(() => {
    const visibleIds = filteredTasks.map((t) => t.id);
    setSelectedTaskIds(visibleIds);
  }, [filteredTasks]);

  const clearSelection = useCallback(() => {
    setSelectedTaskIds([]);
  }, []);

  const batchCompleteSelected = useCallback(() => {
    if (selectedTaskIds.length === 0) return;
    const now = new Date().toISOString();
    setTasks((prev) =>
      prev.map((t) =>
        selectedTaskIds.includes(t.id)
          ? {
              ...t,
              status: 'completed',
              completedAt: now,
              updatedAt: now,
              subtasks: t.subtasks.map((s) => ({ ...s, completed: true })),
            }
          : t
      )
    );
    showToast(`Marked ${selectedTaskIds.length} tasks as completed`, 'success');
    setSelectedTaskIds([]);
  }, [selectedTaskIds, showToast]);

  const batchDeleteSelected = useCallback(() => {
    if (selectedTaskIds.length === 0) return;
    const count = selectedTaskIds.length;
    const deletedItems = tasks.filter((t) => selectedTaskIds.includes(t.id));

    setTasks((prev) => prev.filter((t) => !selectedTaskIds.includes(t.id)));
    setSelectedTaskIds([]);

    showToast(
      `Deleted ${count} tasks`,
      'info',
      {
        label: 'Undo',
        onClick: () => {
          setTasks((prev) => [...deletedItems, ...prev]);
          showToast(`Restored ${count} tasks`, 'success');
        },
      },
      5000
    );
  }, [selectedTaskIds, tasks, showToast]);

  const batchSetCategory = useCallback(
    (category: string) => {
      if (selectedTaskIds.length === 0) return;
      const now = new Date().toISOString();
      setTasks((prev) =>
        prev.map((t) =>
          selectedTaskIds.includes(t.id)
            ? { ...t, category, updatedAt: now }
            : t
        )
      );
      showToast(`Updated category to "${category}" for ${selectedTaskIds.length} tasks`, 'success');
      setSelectedTaskIds([]);
    },
    [selectedTaskIds, showToast]
  );

  // Modals
  const openCreateModal = useCallback((cat?: string) => {
    setEditingTask(null);
    setDefaultModalCategory(cat);
    setIsTaskModalOpen(true);
  }, []);

  const openEditModal = useCallback((task: Task) => {
    setEditingTask(task);
    setDefaultModalCategory(undefined);
    setIsTaskModalOpen(true);
  }, []);

  const closeTaskModal = useCallback(() => {
    setIsTaskModalOpen(false);
    setEditingTask(null);
    setDefaultModalCategory(undefined);
  }, []);

  // Filter setters
  const setSearchQuery = useCallback((query: string) => {
    setFilterState((prev) => ({ ...prev, searchQuery: query }));
  }, []);

  const setCategoryFilter = useCallback((category: string) => {
    setFilterState((prev) => ({ ...prev, category }));
  }, []);

  const setPriorityFilter = useCallback((priority: string) => {
    setFilterState((prev) => ({ ...prev, priority }));
  }, []);

  const setStatusFilter = useCallback((status: StatusFilterType) => {
    setFilterState((prev) => ({ ...prev, status }));
  }, []);

  const setSortBy = useCallback((sortBy: SortOption) => {
    setFilterState((prev) => ({ ...prev, sortBy }));
  }, []);

  const setSelectedTag = useCallback((tag: string) => {
    setFilterState((prev) => ({ ...prev, selectedTag: tag }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilterState({
      searchQuery: '',
      category: 'all',
      priority: 'all',
      status: 'all',
      sortBy: 'dueDateAsc',
      selectedTag: 'all',
    });
  }, []);

  // Backup & Import/Export
  const exportJSON = useCallback(() => {
    try {
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(tasks, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `auratask-export-${getTodayDateString()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      showToast('Exported tasks to JSON successfully', 'success');
    } catch {
      showToast('Failed to export tasks', 'error');
    }
  }, [tasks, showToast]);

  const exportCSV = useCallback(() => {
    try {
      const headers = ['ID', 'Title', 'Category', 'Priority', 'Status', 'DueDate', 'DueTime', 'SubtasksCount', 'CreatedAt'];
      const rows = tasks.map((t) => [
        t.id,
        `"${t.title.replace(/"/g, '""')}"`,
        `"${(t.category || '').replace(/"/g, '""')}"`,
        t.priority,
        t.status,
        t.dueDate,
        t.dueTime || '',
        `${t.subtasks.filter((s) => s.completed).length}/${t.subtasks.length}`,
        t.createdAt,
      ]);

      const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `auratask-export-${getTodayDateString()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      showToast('Exported tasks to CSV successfully', 'success');
    } catch {
      showToast('Failed to export tasks to CSV', 'error');
    }
  }, [tasks, showToast]);

  const importJSON = useCallback(
    (rawJson: string): { success: boolean; message: string } => {
      try {
        const parsed = JSON.parse(rawJson);
        if (!Array.isArray(parsed)) {
          return { success: false, message: 'Invalid format: Expected a JSON array of tasks.' };
        }

        // Basic verification
        const validTasks: Task[] = parsed.filter(
          (item) => item && typeof item.id === 'string' && typeof item.title === 'string'
        );

        if (validTasks.length === 0) {
          return { success: false, message: 'No valid task items found in the file.' };
        }

        // Merge or replace
        setTasks(validTasks);
        showToast(`Imported ${validTasks.length} tasks successfully`, 'success');
        return { success: true, message: `Loaded ${validTasks.length} tasks.` };
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Unknown JSON parse error';
        return { success: false, message: `Import failed: ${msg}` };
      }
    },
    [showToast]
  );

  const resetToDefaults = useCallback(() => {
    const samples = getSampleInitialTasks();
    setTasks(samples);
    showToast('Reset tasks to sample data', 'info');
  }, [showToast]);

  return (
    <TaskContext.Provider
      value={{
        tasks,
        stats,
        filterState,
        filteredTasks,
        categories,
        tags,
        selectedTaskIds,
        viewMode,
        isTaskModalOpen,
        editingTask,
        defaultModalCategory,

        addTask,
        updateTask,
        deleteTask,
        toggleTaskStatus,
        toggleSubtask,
        duplicateTask,

        toggleSelectTask,
        selectAllVisible,
        clearSelection,
        batchCompleteSelected,
        batchDeleteSelected,
        batchSetCategory,

        openCreateModal,
        openEditModal,
        closeTaskModal,
        setViewMode,

        setSearchQuery,
        setCategoryFilter,
        setPriorityFilter,
        setStatusFilter,
        setSortBy,
        setSelectedTag,
        resetFilters,

        exportJSON,
        exportCSV,
        importJSON,
        resetToDefaults,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export function useTasks() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
}
