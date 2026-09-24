import React, { useState } from 'react';
import { useTasks } from '../context/TaskContext';
import { TaskItem } from './TaskItem';
import { Task } from '../types/task';
import {
  CheckSquare,
  Square,
  Inbox,
  CheckCircle2,
  AlertCircle,
  Plus,
  Layers,
  ArrowUpDown,
} from 'lucide-react';

export const TaskListView: React.FC = () => {
  const {
    filteredTasks,
    tasks,
    selectedTaskIds,
    selectAllVisible,
    clearSelection,
    filterState,
    resetFilters,
    openCreateModal,
  } = useTasks();

  const [groupBy, setGroupBy] = useState<'none' | 'priority' | 'category' | 'status'>('none');

  const allVisibleSelected =
    filteredTasks.length > 0 &&
    filteredTasks.every((t) => selectedTaskIds.includes(t.id));

  const handleSelectAllToggle = () => {
    if (allVisibleSelected) {
      clearSelection();
    } else {
      selectAllVisible();
    }
  };

  // Render Empty States
  if (tasks.length === 0) {
    return (
      <div className="text-center py-16 px-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="w-12 h-12 mx-auto rounded-full bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-3">
          <Inbox className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1">
          No tasks in your workspace
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-4">
          Get started by adding your first task. Organize with priorities, due dates, and custom categories.
        </p>
        <button
          onClick={() => openCreateModal()}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 rounded-lg shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Create First Task</span>
        </button>
      </div>
    );
  }

  if (filteredTasks.length === 0) {
    return (
      <div className="text-center py-14 px-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 mb-3">
          {filterState.status === 'overdue' ? (
            <CheckCircle2 className="w-6 h-6 text-emerald-500" />
          ) : filterState.status === 'completed' ? (
            <Inbox className="w-6 h-6 text-slate-400" />
          ) : (
            <AlertCircle className="w-6 h-6 text-slate-400" />
          )}
        </div>
        <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1">
          {filterState.status === 'overdue'
            ? 'All caught up! Zero overdue tasks.'
            : filterState.status === 'completed'
            ? 'No completed tasks found'
            : 'No tasks match current filters'}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto mb-4">
          {filterState.status === 'overdue'
            ? 'Great job keeping deadlines on schedule.'
            : 'Try adjusting your search query, status, priority, or category filters.'}
        </p>
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={resetFilters}
            className="px-3.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            Reset Filters
          </button>
          <button
            onClick={() => openCreateModal()}
            className="px-3.5 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 rounded-lg transition-colors inline-flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Task</span>
          </button>
        </div>
      </div>
    );
  }

  // Grouping helper
  const renderGroupedTasks = () => {
    if (groupBy === 'none') {
      return (
        <div className="space-y-2.5">
          {filteredTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              isSelected={selectedTaskIds.includes(task.id)}
            />
          ))}
        </div>
      );
    }

    const groups: Record<string, Task[]> = {};

    filteredTasks.forEach((task) => {
      let key = 'Other';
      if (groupBy === 'priority') {
        key = task.priority.toUpperCase();
      } else if (groupBy === 'category') {
        key = task.category || 'General';
      } else if (groupBy === 'status') {
        key = task.status === 'completed' ? 'Completed' : task.status === 'in_progress' ? 'In Progress' : 'Pending';
      }

      if (!groups[key]) groups[key] = [];
      groups[key].push(task);
    });

    return (
      <div className="space-y-6">
        {Object.entries(groups).map(([groupTitle, groupTasks]) => (
          <div key={groupTitle} className="space-y-2.5">
            <div className="flex items-center justify-between px-1">
              <h4 className="text-xs font-semibold tracking-wider uppercase text-slate-500 dark:text-slate-400">
                {groupTitle} ({groupTasks.length})
              </h4>
            </div>
            <div className="space-y-2">
              {groupTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  isSelected={selectedTaskIds.includes(task.id)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-3">
      {/* Controls header: Select all + Group By */}
      <div className="flex items-center justify-between px-1 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <button
            onClick={handleSelectAllToggle}
            className="flex items-center gap-1.5 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
          >
            {allVisibleSelected ? (
              <CheckSquare className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            ) : (
              <Square className="w-4 h-4" />
            )}
            <span className="font-medium">
              {allVisibleSelected ? 'Deselect visible' : 'Select all visible'}
            </span>
          </button>
        </div>

        {/* Group By selector */}
        <div className="flex items-center gap-1.5">
          <span className="hidden sm:inline text-slate-400">Group by:</span>
          <select
            value={groupBy}
            onChange={(e) => setGroupBy(e.target.value as any)}
            aria-label="Group tasks by"
            className="bg-transparent text-xs text-slate-700 dark:text-slate-300 font-medium focus:outline-none cursor-pointer border border-slate-200 dark:border-slate-800 rounded px-2 py-0.5"
          >
            <option value="none" className="dark:bg-slate-900">None</option>
            <option value="priority" className="dark:bg-slate-900">Priority</option>
            <option value="category" className="dark:bg-slate-900">Category</option>
            <option value="status" className="dark:bg-slate-900">Status</option>
          </select>
        </div>
      </div>

      {/* Task List */}
      {renderGroupedTasks()}
    </div>
  );
};
