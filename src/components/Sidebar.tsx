import React from 'react';
import { useTasks } from '../context/TaskContext';
import { useTheme } from '../context/ThemeContext';
import {
  Layers,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Folder,
  Plus,
  HardDrive,
  X,
  Sparkles,
} from 'lucide-react';
import { StatusFilterType } from '../types/task';
import { getCategoryColor } from '../utils/taskHelpers';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenBackupModal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  onOpenBackupModal,
}) => {
  const {
    tasks,
    stats,
    filterState,
    setStatusFilter,
    setCategoryFilter,
    categories,
    openCreateModal,
  } = useTasks();

  const { accentTheme } = useTheme();

  const navFilters: {
    status: StatusFilterType;
    label: string;
    count: number;
    icon: React.ReactNode;
    color: string;
  }[] = [
    {
      status: 'all',
      label: 'All Tasks',
      count: stats.total,
      icon: <Layers className="w-4 h-4" />,
      color: 'text-slate-600 dark:text-slate-400',
    },
    {
      status: 'due_today',
      label: 'Due Today',
      count: stats.dueToday,
      icon: <Calendar className="w-4 h-4" />,
      color: 'text-amber-500',
    },
    {
      status: 'pending',
      label: 'Pending Queue',
      count: stats.pending,
      icon: <Clock className="w-4 h-4" />,
      color: 'text-sky-500',
    },
    {
      status: 'overdue',
      label: 'Overdue',
      count: stats.overdue,
      icon: <AlertTriangle className="w-4 h-4" />,
      color: stats.overdue > 0 ? 'text-rose-500' : 'text-slate-400',
    },
    {
      status: 'completed',
      label: 'Completed',
      count: stats.completed,
      icon: <CheckCircle2 className="w-4 h-4" />,
      color: 'text-emerald-500',
    },
  ];

  const handleFilterClick = (status: StatusFilterType) => {
    setStatusFilter(status);
    setCategoryFilter('all');
    if (window.innerWidth < 768) {
      onClose();
    }
  };

  const handleCategoryClick = (cat: string) => {
    setCategoryFilter(cat);
    if (window.innerWidth < 768) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-xs md:hidden"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:sticky top-0 md:top-16 z-40 md:z-20 h-screen md:h-[calc(100vh-4rem)] w-64 shrink-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-r border-slate-200/80 dark:border-slate-800/80 p-4 flex flex-col justify-between transition-transform duration-200 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="overflow-y-auto space-y-6 pr-1">
          {/* Mobile Close Button */}
          <div className="flex md:hidden items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <span className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              <span>Workspace</span>
            </span>
            <button
              onClick={onClose}
              aria-label="Close sidebar"
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Filters */}
          <div className="space-y-1">
            <div className="px-2 pb-1.5 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Views & Queues
            </div>
            {navFilters.map((item) => {
              const isActive =
                filterState.status === item.status && filterState.category === 'all';

              return (
                <button
                  key={item.status}
                  onClick={() => handleFilterClick(item.status)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-xl transition-all duration-150 ${
                    isActive
                      ? `${accentTheme.badgeBg} font-bold shadow-xs`
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={item.color}>{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                  <span className="font-mono tabular-nums text-xs opacity-80">
                    {item.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Categories */}
          <div className="space-y-1">
            <div className="flex items-center justify-between px-2 pb-1.5">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Categories
              </span>
              <button
                onClick={() => openCreateModal()}
                aria-label="Add task"
                className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 p-0.5"
                title="Add task in new category"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              onClick={() => handleCategoryClick('all')}
              className={`w-full flex items-center justify-between px-3 py-1.5 text-xs font-medium rounded-xl transition-colors ${
                filterState.category === 'all'
                  ? 'bg-slate-100 dark:bg-slate-800 font-bold text-slate-900 dark:text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60'
              }`}
            >
              <span>All Categories</span>
              <span className="font-mono tabular-nums text-xs opacity-75">{tasks.length}</span>
            </button>

            {categories.map((cat) => {
              const count = tasks.filter((t) => t.category === cat).length;
              const isCatActive = filterState.category === cat;
              const colorInfo = getCategoryColor(cat);

              return (
                <button
                  key={cat}
                  onClick={() => handleCategoryClick(cat)}
                  className={`w-full flex items-center justify-between px-3 py-1.5 text-xs font-medium rounded-xl transition-colors ${
                    isCatActive
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className={`w-2 h-2 rounded-full shrink-0 ${colorInfo.dot}`} />
                    <span className="truncate">{cat}</span>
                  </div>
                  <span className="font-mono tabular-nums text-xs opacity-75 shrink-0 ml-1">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer: Storage Status & Quick Backups */}
        <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800/80 text-xs">
          <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800/60 text-slate-600 dark:text-slate-300">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <span className="text-[11px] font-medium truncate">Storage: Active</span>
            </div>
            <button
              onClick={onOpenBackupModal}
              className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline shrink-0"
            >
              Backup
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
