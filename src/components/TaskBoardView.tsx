import React from 'react';
import { useTasks } from '../context/TaskContext';
import { useTheme } from '../context/ThemeContext';
import { Task, TaskStatus } from '../types/task';
import { TaskItem } from './TaskItem';
import { Plus, ArrowRight, ArrowLeft, Clock, Zap, CheckCircle2 } from 'lucide-react';

export const TaskBoardView: React.FC = () => {
  const { filteredTasks, updateTask, openCreateModal } = useTasks();
  const { accentTheme } = useTheme();

  const columns: {
    id: TaskStatus;
    title: string;
    description: string;
    icon: React.ReactNode;
    topGradient: string;
    badgeStyle: string;
  }[] = [
    {
      id: 'pending',
      title: 'To Do / Pending',
      description: 'Tasks queued for execution',
      icon: <Clock className="w-3.5 h-3.5 text-amber-500" />,
      topGradient: 'from-amber-400 to-orange-500',
      badgeStyle: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900/50',
    },
    {
      id: 'in_progress',
      title: 'In Progress',
      description: 'Actively being executed',
      icon: <Zap className="w-3.5 h-3.5 text-indigo-500" />,
      topGradient: `bg-gradient-to-r ${accentTheme.gradientBg}`,
      badgeStyle: `${accentTheme.badgeBg}`,
    },
    {
      id: 'completed',
      title: 'Done & Completed',
      description: 'Finished achievements',
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />,
      topGradient: 'from-emerald-400 to-teal-500',
      badgeStyle: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/50',
    },
  ];

  const moveTask = (taskId: string, targetStatus: TaskStatus) => {
    updateTask(taskId, { status: targetStatus });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5 items-start">
      {columns.map((column) => {
        const columnTasks = filteredTasks.filter((t) => t.status === column.id);

        return (
          <div
            key={column.id}
            className="flex flex-col rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-100/50 dark:bg-slate-900/40 backdrop-blur-sm p-3.5 min-h-[500px] relative overflow-hidden shadow-xs"
          >
            {/* Top colored accent indicator line */}
            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${column.topGradient}`} />

            {/* Column Header */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200/60 dark:border-slate-800/60 pt-1">
              <div>
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded-md bg-white dark:bg-slate-800 shadow-xs">
                    {column.icon}
                  </div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
                    {column.title}
                  </h3>
                  <span className={`font-mono font-bold tabular-nums text-xs px-2 py-0.5 rounded-full border ${column.badgeStyle}`}>
                    {columnTasks.length}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 pl-0.5">
                  {column.description}
                </p>
              </div>

              {column.id === 'pending' && (
                <button
                  onClick={() => openCreateModal()}
                  aria-label="Add task to pending"
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800 transition-colors shadow-xs"
                  title="Add task"
                >
                  <Plus className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Column Cards */}
            <div className="flex-1 space-y-3 overflow-y-auto max-h-[72vh] pr-0.5">
              {columnTasks.length === 0 ? (
                <div className="h-36 flex flex-col items-center justify-center text-center p-4 border border-dashed border-slate-300 dark:border-slate-800 rounded-xl text-slate-400 text-xs">
                  <span>No tasks in {column.title.toLowerCase()}</span>
                </div>
              ) : (
                columnTasks.map((task) => (
                  <div key={task.id} className="relative group/board">
                    <TaskItem task={task} />

                    {/* Quick Move Bar */}
                    <div className="flex items-center justify-end gap-1.5 mt-1.5 px-1 opacity-0 group-hover/board:opacity-100 transition-opacity">
                      {column.id !== 'pending' && (
                        <button
                          onClick={() => moveTask(task.id, 'pending')}
                          className="text-[10px] font-semibold flex items-center gap-1 px-2 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-amber-600 shadow-xs transition-colors"
                        >
                          <ArrowLeft className="w-2.5 h-2.5" />
                          <span>To Do</span>
                        </button>
                      )}
                      {column.id !== 'in_progress' && (
                        <button
                          onClick={() => moveTask(task.id, 'in_progress')}
                          className="text-[10px] font-semibold flex items-center gap-1 px-2 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-indigo-600 shadow-xs transition-colors"
                        >
                          <span>In Progress</span>
                          <ArrowRight className="w-2.5 h-2.5" />
                        </button>
                      )}
                      {column.id !== 'completed' && (
                        <button
                          onClick={() => moveTask(task.id, 'completed')}
                          className="text-[10px] font-semibold flex items-center gap-1 px-2 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-emerald-600 shadow-xs transition-colors"
                        >
                          <span>Complete</span>
                          <ArrowRight className="w-2.5 h-2.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
