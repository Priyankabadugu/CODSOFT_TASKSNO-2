import React from 'react';
import { useTasks } from '../context/TaskContext';
import { useTheme } from '../context/ThemeContext';
import { CheckCircle2, Clock, AlertTriangle, Layers, TrendingUp } from 'lucide-react';
import { StatusFilterType } from '../types/task';

export const DashboardStats: React.FC = () => {
  const { stats, filterState, setStatusFilter } = useTasks();
  const { accentTheme } = useTheme();

  const handleStatClick = (targetStatus: StatusFilterType) => {
    if (filterState.status === targetStatus) {
      setStatusFilter('all');
    } else {
      setStatusFilter(targetStatus);
    }
  };

  const statCards: {
    label: string;
    value: number;
    sublabel: string;
    filterKey: StatusFilterType;
    icon: React.ReactNode;
    iconBg: string;
    borderHighlight: string;
    glowStyle?: string;
  }[] = [
    {
      label: 'Total Tasks',
      value: stats.total,
      sublabel: `${stats.criticalCount} critical tier`,
      filterKey: 'all',
      icon: <Layers className="w-4 h-4 text-white" />,
      iconBg: `bg-gradient-to-tr ${accentTheme.gradientBg}`,
      borderHighlight: filterState.status === 'all' ? accentTheme.activeRing : 'border-slate-200/80 dark:border-slate-800/80',
      glowStyle: filterState.status === 'all' ? accentTheme.glowColor : undefined,
    },
    {
      label: 'Pending Queue',
      value: stats.pending,
      sublabel: `${stats.dueToday} due today`,
      filterKey: 'pending',
      icon: <Clock className="w-4 h-4 text-white" />,
      iconBg: 'bg-gradient-to-tr from-amber-500 to-orange-500',
      borderHighlight: filterState.status === 'pending' ? 'ring-amber-500/40 border-amber-500' : 'border-slate-200/80 dark:border-slate-800/80',
      glowStyle: filterState.status === 'pending' ? 'rgba(245, 158, 11, 0.25)' : undefined,
    },
    {
      label: 'Overdue Risk',
      value: stats.overdue,
      sublabel: stats.overdue > 0 ? 'Requires attention' : 'Zero overdue items',
      filterKey: 'overdue',
      icon: <AlertTriangle className="w-4 h-4 text-white" />,
      iconBg: 'bg-gradient-to-tr from-rose-500 to-pink-600',
      borderHighlight: filterState.status === 'overdue' ? 'ring-rose-500/40 border-rose-500' : 'border-slate-200/80 dark:border-slate-800/80',
      glowStyle: filterState.status === 'overdue' ? 'rgba(244, 63, 94, 0.25)' : undefined,
    },
    {
      label: 'Completed',
      value: stats.completed,
      sublabel: `${stats.completionRate}% completion`,
      filterKey: 'completed',
      icon: <CheckCircle2 className="w-4 h-4 text-white" />,
      iconBg: 'bg-gradient-to-tr from-emerald-500 to-teal-600',
      borderHighlight: filterState.status === 'completed' ? 'ring-emerald-500/40 border-emerald-500' : 'border-slate-200/80 dark:border-slate-800/80',
      glowStyle: filterState.status === 'completed' ? 'rgba(16, 185, 129, 0.25)' : undefined,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
      {statCards.map((card) => {
        const isSelected = filterState.status === card.filterKey;
        return (
          <button
            key={card.label}
            onClick={() => handleStatClick(card.filterKey)}
            style={
              card.glowStyle
                ? { boxShadow: `0 8px 20px -4px ${card.glowStyle}` }
                : undefined
            }
            className={`text-left p-4 rounded-2xl border bg-white/90 dark:bg-slate-900/80 backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg group cursor-pointer relative overflow-hidden ${
              isSelected
                ? `${card.borderHighlight} ring-2`
                : 'border-slate-200/80 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            {/* Top row with icon badge and label */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-tight">
                {card.label}
              </span>
              <div className={`w-7 h-7 rounded-lg ${card.iconBg} flex items-center justify-center shadow-xs transition-transform group-hover:scale-110`}>
                {card.icon}
              </div>
            </div>

            {/* Metric number */}
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold font-mono tabular-nums tracking-tight text-slate-900 dark:text-white">
                {card.value}
              </span>
              {card.label === 'Completed' && (
                <div className="flex items-center gap-1 text-[11px] font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                  <TrendingUp className="w-3 h-3" />
                  <span>{stats.completionRate}%</span>
                </div>
              )}
            </div>

            {/* Sublabel / clean progress bar */}
            <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
              <span className="truncate font-medium">{card.sublabel}</span>
              {card.label === 'Completed' && (
                <div className="w-16 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shrink-0 ml-2">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-700"
                    style={{ width: `${stats.completionRate}%` }}
                  />
                </div>
              )}
              {card.label === 'Overdue' && stats.overdue > 0 && (
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping shrink-0 ml-1" />
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
};
