import React from 'react';
import { useTasks } from '../context/TaskContext';
import { useTheme } from '../context/ThemeContext';
import {
  CheckCircle2,
  AlertTriangle,
  Layers,
  PieChart,
  BarChart,
  TrendingUp,
  Flame,
} from 'lucide-react';
import { isOverdue, getCategoryColor } from '../utils/taskHelpers';

export const TaskAnalyticsView: React.FC = () => {
  const { tasks, stats, categories, openEditModal } = useTasks();
  const { accentTheme } = useTheme();

  // Category counts
  const categoryStats = categories.map((cat) => {
    const totalInCat = tasks.filter((t) => t.category === cat).length;
    const completedInCat = tasks.filter((t) => t.category === cat && t.status === 'completed').length;
    const rate = totalInCat > 0 ? Math.round((completedInCat / totalInCat) * 100) : 0;
    return {
      category: cat,
      total: totalInCat,
      completed: completedInCat,
      rate,
    };
  }).filter((c) => c.total > 0);

  // Priority counts
  const priorityStats = [
    {
      level: 'Critical',
      key: 'critical',
      count: tasks.filter((t) => t.priority === 'critical' && t.status !== 'completed').length,
      total: tasks.filter((t) => t.priority === 'critical').length,
      gradient: 'from-rose-500 to-pink-600',
      textColor: 'text-rose-600 dark:text-rose-400',
      badgeBg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
    },
    {
      level: 'High',
      key: 'high',
      count: tasks.filter((t) => t.priority === 'high' && t.status !== 'completed').length,
      total: tasks.filter((t) => t.priority === 'high').length,
      gradient: 'from-amber-500 to-orange-500',
      textColor: 'text-amber-600 dark:text-amber-400',
      badgeBg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    },
    {
      level: 'Medium',
      key: 'medium',
      count: tasks.filter((t) => t.priority === 'medium' && t.status !== 'completed').length,
      total: tasks.filter((t) => t.priority === 'medium').length,
      gradient: 'from-sky-500 to-blue-500',
      textColor: 'text-sky-600 dark:text-sky-400',
      badgeBg: 'bg-sky-500/10 text-sky-600 dark:text-sky-400',
    },
    {
      level: 'Low',
      key: 'low',
      count: tasks.filter((t) => t.priority === 'low' && t.status !== 'completed').length,
      total: tasks.filter((t) => t.priority === 'low').length,
      gradient: 'from-slate-400 to-slate-500',
      textColor: 'text-slate-600 dark:text-slate-400',
      badgeBg: 'bg-slate-500/10 text-slate-600 dark:text-slate-400',
    },
  ];

  // Urgent attention tasks
  const urgentTasks = tasks
    .filter((t) => t.status !== 'completed' && (isOverdue(t.dueDate, t.dueTime, t.status) || t.priority === 'critical'))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Top Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Completion Gauge Card */}
        <div className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/80 backdrop-blur-md shadow-xs">
          <div className="flex items-center justify-between mb-3 text-slate-500 dark:text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Completion Velocity</span>
            <div className="p-1 rounded-lg bg-emerald-500/10 text-emerald-500">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-3xl font-extrabold font-mono tabular-nums text-slate-900 dark:text-white">
              {stats.completionRate}%
            </span>
            <span className="text-xs text-slate-400 font-medium">
              ({stats.completed} of {stats.total} total)
            </span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden mt-1">
            <div
              className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-700"
              style={{ width: `${stats.completionRate}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-2.5 flex items-center gap-1 font-medium">
            <TrendingUp className="w-3 h-3 text-emerald-500" />
            <span>{stats.pending} remaining pending task items</span>
          </p>
        </div>

        {/* Overdue Health Card */}
        <div className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/80 backdrop-blur-md shadow-xs">
          <div className="flex items-center justify-between mb-3 text-slate-500 dark:text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Overdue Risk</span>
            <div className="p-1 rounded-lg bg-rose-500/10 text-rose-500">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className={`text-3xl font-extrabold font-mono tabular-nums ${stats.overdue > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-900 dark:text-white'}`}>
              {stats.overdue}
            </span>
            <span className="text-xs text-slate-400 font-medium">
              {stats.overdue === 0 ? 'Zero overdue items' : 'Items require immediate action'}
            </span>
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
            <div>
              <span>Critical: </span>
              <span className="font-mono tabular-nums font-bold text-rose-600 dark:text-rose-400">
                {stats.criticalCount}
              </span>
            </div>
            <div>
              <span>High: </span>
              <span className="font-mono tabular-nums font-bold text-amber-600 dark:text-amber-400">
                {stats.highCount}
              </span>
            </div>
          </div>
        </div>

        {/* Workload Distribution Card */}
        <div className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/80 backdrop-blur-md shadow-xs">
          <div className="flex items-center justify-between mb-3 text-slate-500 dark:text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Active Categories</span>
            <div className="p-1 rounded-lg bg-indigo-500/10 text-indigo-500">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-3xl font-extrabold font-mono tabular-nums text-slate-900 dark:text-white">
              {categoryStats.length}
            </span>
            <span className="text-xs text-slate-400 font-medium">Categorized domains</span>
          </div>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800/80">
            Average tasks per category: <strong className="text-slate-700 dark:text-slate-300 font-bold">{categoryStats.length > 0 ? (stats.total / categoryStats.length).toFixed(1) : 0}</strong>
          </p>
        </div>
      </div>

      {/* Two Column Grid: Category Breakdown + Priority Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5">
        {/* Category Breakdown Table */}
        <div className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/80 backdrop-blur-md shadow-xs">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
            <BarChart className="w-4 h-4 text-indigo-500" />
            <span>Category Progress</span>
          </h3>

          <div className="space-y-3.5">
            {categoryStats.map((item) => {
              const catColor = getCategoryColor(item.category);
              return (
                <div key={item.category} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${catColor.dot}`} />
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {item.category}
                      </span>
                    </div>
                    <span className="font-mono tabular-nums text-slate-500 dark:text-slate-400">
                      {item.completed}/{item.total} (<strong className="text-slate-700 dark:text-slate-300">{item.rate}%</strong>)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${catColor.dot}`}
                      style={{ width: `${item.rate}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Priority Breakdown */}
        <div className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/80 backdrop-blur-md shadow-xs">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
            <PieChart className="w-4 h-4 text-indigo-500" />
            <span>Priority Queue Distribution</span>
          </h3>

          <div className="space-y-3.5">
            {priorityStats.map((p) => {
              const percentage = stats.pending > 0 ? Math.round((p.count / stats.pending) * 100) : 0;
              return (
                <div key={p.level} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className={`font-semibold ${p.textColor} flex items-center gap-1.5`}>
                      <span className="w-2 h-2 rounded-full bg-current" />
                      <span>{p.level} Priority</span>
                    </span>
                    <span className="font-mono tabular-nums text-slate-500 dark:text-slate-400">
                      {p.count} active ({percentage}% of pending)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${p.gradient} transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Urgent Attention Items */}
      {urgentTasks.length > 0 && (
        <div className="p-5 rounded-2xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/40 dark:bg-rose-950/20 backdrop-blur-md shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-1 rounded-lg bg-rose-500 text-white shadow-xs">
                <Flame className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-300">
                Action Required ({urgentTasks.length})
              </h3>
            </div>
            <span className="text-[11px] font-medium text-rose-600 dark:text-rose-400">
              Critical or Overdue
            </span>
          </div>
          <div className="divide-y divide-rose-200/60 dark:divide-rose-900/40 text-xs">
            {urgentTasks.map((t) => (
              <div
                key={t.id}
                onClick={() => openEditModal(t)}
                className="py-2.5 flex items-center justify-between gap-3 hover:bg-rose-100/40 dark:hover:bg-rose-900/30 px-2 rounded-lg cursor-pointer transition-colors"
              >
                <div className="min-w-0">
                  <div className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                    {t.title}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {t.category} · Priority: <span className="font-bold text-rose-600 dark:text-rose-400 uppercase">{t.priority}</span>
                  </div>
                </div>
                <div className="font-mono tabular-nums text-rose-600 dark:text-rose-400 shrink-0 font-bold bg-white dark:bg-slate-900 px-2.5 py-1 rounded-lg border border-rose-200 dark:border-rose-900/50 shadow-xs">
                  {t.dueDate || 'No date'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
