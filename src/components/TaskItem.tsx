import React, { useState } from 'react';
import { Task, TaskPriority } from '../types/task';
import { useTasks } from '../context/TaskContext';
import { useTheme } from '../context/ThemeContext';
import { formatDueDateLabel, getCategoryColor } from '../utils/taskHelpers';
import {
  Check,
  AlertTriangle,
  ArrowUp,
  Minus,
  ArrowDown,
  Calendar,
  Clock,
  MoreVertical,
  Edit2,
  Copy,
  Trash2,
  ChevronDown,
  ChevronUp,
  CheckSquare,
  Square,
  AlertCircle,
  Tag,
} from 'lucide-react';

interface TaskItemProps {
  task: Task;
  isSelected?: boolean;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task, isSelected = false }) => {
  const {
    toggleTaskStatus,
    toggleSubtask,
    deleteTask,
    duplicateTask,
    openEditModal,
    toggleSelectTask,
  } = useTasks();

  const { accentTheme } = useTheme();

  const [isExpanded, setIsExpanded] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isCompleted = task.status === 'completed';
  const dueInfo = formatDueDateLabel(task.dueDate, task.dueTime, task.status);

  // Subtask progress
  const totalSubtasks = task.subtasks?.length || 0;
  const completedSubtasks = task.subtasks?.filter((s) => s.completed).length || 0;
  const subtasksPercent = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;

  // Category Color
  const catColor = getCategoryColor(task.category);

  // Priority indicator rendering with text, icons, and subtle badge
  const renderPriority = (priority: TaskPriority) => {
    switch (priority) {
      case 'critical':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-rose-500/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/60">
            <AlertTriangle className="w-3 h-3" />
            <span>Critical</span>
          </span>
        );
      case 'high':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-900/60">
            <ArrowUp className="w-3 h-3" />
            <span>High</span>
          </span>
        );
      case 'medium':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-sky-500/10 dark:bg-sky-500/20 text-sky-600 dark:text-sky-400 border border-sky-200 dark:border-sky-900/60">
            <Minus className="w-3 h-3" />
            <span>Medium</span>
          </span>
        );
      case 'low':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-500/10 dark:bg-slate-500/20 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800">
            <ArrowDown className="w-3 h-3" />
            <span>Low</span>
          </span>
        );
    }
  };

  // Due Date styling
  const renderDueIndicator = () => {
    if (!task.dueDate) return null;

    if (dueInfo.type === 'overdue') {
      return (
        <span className="inline-flex items-center gap-1 font-semibold text-rose-600 dark:text-rose-400 text-xs">
          <AlertCircle className="w-3.5 h-3.5" />
          <span>{dueInfo.text}</span>
        </span>
      );
    }

    if (dueInfo.type === 'today') {
      return (
        <span className="inline-flex items-center gap-1 font-semibold text-amber-600 dark:text-amber-400 text-xs">
          <Clock className="w-3.5 h-3.5" />
          <span>{dueInfo.text}</span>
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1 text-slate-500 dark:text-slate-400 text-xs">
        <Calendar className="w-3.5 h-3.5 text-slate-400" />
        <span>{dueInfo.text}</span>
      </span>
    );
  };

  return (
    <div
      className={`group relative rounded-2xl border transition-all duration-200 ${
        isCompleted
          ? 'border-slate-200/60 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/30 opacity-75'
          : isSelected
          ? 'border-indigo-500 dark:border-indigo-400 ring-2 ring-indigo-500/20 bg-white dark:bg-slate-900 shadow-md'
          : 'border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/80 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md dark:hover:shadow-slate-950/40 backdrop-blur-sm'
      }`}
    >
      {/* Critical Priority indicator bar on left border */}
      {task.priority === 'critical' && !isCompleted && (
        <div className="absolute left-0 top-3 bottom-3 w-1 rounded-r-full bg-rose-500" />
      )}

      <div className="p-4 flex items-start gap-3.5">
        {/* Batch Selection Checkbox */}
        <button
          onClick={() => toggleSelectTask(task.id)}
          aria-label={isSelected ? 'Deselect task' : 'Select task'}
          className="mt-0.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors shrink-0"
        >
          {isSelected ? (
            <CheckSquare className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          ) : (
            <Square className="w-4 h-4" />
          )}
        </button>

        {/* Task Completion Toggle */}
        <button
          onClick={() => toggleTaskStatus(task.id)}
          aria-label={isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
          className={`mt-0.5 w-5 h-5 rounded-lg border flex items-center justify-center transition-all duration-200 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
            isCompleted
              ? 'bg-gradient-to-tr from-emerald-500 to-teal-500 border-emerald-500 text-white shadow-xs'
              : 'border-slate-300 dark:border-slate-600 hover:border-emerald-500 dark:hover:border-emerald-400 bg-white dark:bg-slate-800 hover:scale-105'
          }`}
        >
          {isCompleted && <Check className="w-3.5 h-3.5 stroke-[3]" />}
        </button>

        {/* Main Content Area */}
        <div className="flex-1 min-w-0">
          {/* Header Row: Title & Action Menu */}
          <div className="flex items-start justify-between gap-2">
            <h3
              onClick={() => setIsExpanded(!isExpanded)}
              className={`text-sm font-semibold tracking-tight cursor-pointer leading-snug break-words transition-colors ${
                isCompleted
                  ? 'line-through text-slate-400 dark:text-slate-500'
                  : 'text-slate-900 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-indigo-400'
              }`}
            >
              {task.title}
            </h3>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-1 shrink-0 -mr-1">
              <button
                onClick={() => openEditModal(task)}
                aria-label="Edit task"
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Edit task"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>

              <div className="relative">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  aria-label="More task options"
                  aria-expanded={isMenuOpen}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title="More actions"
                >
                  <MoreVertical className="w-3.5 h-3.5" />
                </button>

                {isMenuOpen && (
                  <div className="absolute right-0 top-full mt-1 w-36 py-1.5 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 text-xs z-20 animate-in fade-in zoom-in-95 duration-100">
                    <button
                      onClick={() => {
                        duplicateTask(task.id);
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-1.5 flex items-center gap-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                      <span>Duplicate</span>
                    </button>
                    <button
                      onClick={() => {
                        deleteTask(task.id);
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-1.5 flex items-center gap-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Color Badges & Metadata Row */}
          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
            {/* Attractive Category Badge */}
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${catColor.bg} ${catColor.text} ${catColor.border}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${catColor.dot}`} />
              <span>{task.category || 'General'}</span>
            </span>

            {/* Priority Indicator */}
            {renderPriority(task.priority)}

            {/* Due date */}
            {task.dueDate && (
              <div className="flex items-center pl-0.5">
                {renderDueIndicator()}
              </div>
            )}

            {/* Subtask mini-progress */}
            {totalSubtasks > 0 && (
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                <span className="tabular-nums">
                  {completedSubtasks}/{totalSubtasks}
                </span>
                <div className="w-12 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 rounded-full transition-all duration-300"
                    style={{ width: `${subtasksPercent}%` }}
                  />
                </div>
              </div>
            )}

            {/* Estimated time */}
            {task.estimatedMinutes && (
              <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500 tabular-nums">
                {task.estimatedMinutes}m
              </span>
            )}

            {/* Expand / Collapse toggle */}
            {(task.description || totalSubtasks > 0 || (task.tags && task.tags.length > 0)) && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="ml-auto flex items-center gap-0.5 text-[11px] font-medium text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              >
                <span>{isExpanded ? 'Less' : 'Details'}</span>
                {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
            )}
          </div>

          {/* Expandable Section: Notes, Subtasks, Tags */}
          {isExpanded && (
            <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-xs space-y-3 animate-in fade-in duration-150">
              {/* Description */}
              {task.description && (
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line bg-slate-50/60 dark:bg-slate-800/30 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800/60">
                  {task.description}
                </p>
              )}

              {/* Subtasks checklist */}
              {totalSubtasks > 0 && (
                <div className="space-y-1.5">
                  <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center justify-between">
                    <span>Checklist</span>
                    <span className="font-mono text-[10px] text-slate-400">{subtasksPercent}% completed</span>
                  </div>
                  <div className="space-y-1 pl-0.5">
                    {task.subtasks.map((st) => (
                      <label
                        key={st.id}
                        className="flex items-center gap-2 cursor-pointer py-1 px-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group/sub"
                      >
                        <input
                          type="checkbox"
                          checked={st.completed}
                          onChange={() => toggleSubtask(task.id, st.id)}
                          className="w-3.5 h-3.5 rounded text-indigo-600 focus:ring-indigo-500/30 dark:bg-slate-800 border-slate-300 dark:border-slate-600 cursor-pointer"
                        />
                        <span
                          className={`${
                            st.completed
                              ? 'line-through text-slate-400 dark:text-slate-500'
                              : 'text-slate-700 dark:text-slate-300 group-hover/sub:text-slate-900 dark:group-hover/sub:text-white'
                          }`}
                        >
                          {st.title}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags in chips */}
              {task.tags && task.tags.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mr-1 flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    Tags
                  </span>
                  {task.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
