import React from 'react';
import { useTasks } from '../context/TaskContext';
import { useTheme } from '../context/ThemeContext';
import {
  Search,
  X,
  ArrowUpDown,
  Filter,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { StatusFilterType, SortOption } from '../types/task';

export const TaskFilterBar: React.FC = () => {
  const {
    filterState,
    setSearchQuery,
    setCategoryFilter,
    setPriorityFilter,
    setStatusFilter,
    setSortBy,
    resetFilters,
    categories,
    tasks,
    filteredTasks,
  } = useTasks();

  const { accentTheme } = useTheme();

  const isFiltered =
    filterState.searchQuery.trim() !== '' ||
    filterState.category !== 'all' ||
    filterState.priority !== 'all' ||
    filterState.status !== 'all' ||
    filterState.selectedTag !== 'all' ||
    filterState.sortBy !== 'dueDateAsc';

  const statusOptions: { value: StatusFilterType; label: string }[] = [
    { value: 'all', label: 'All Tasks' },
    { value: 'pending', label: 'Pending' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'due_today', label: 'Due Today' },
    { value: 'overdue', label: 'Overdue' },
    { value: 'completed', label: 'Completed' },
  ];

  return (
    <div className="space-y-3 mb-6 p-1">
      {/* Top row: Search input + Category & Priority dropdowns + Sort */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5">
        {/* Search */}
        <div className="relative flex-1 group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors pointer-events-none" />
          <input
            type="text"
            value={filterState.searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks, descriptions, categories, or tags..."
            className="w-full pl-10 pr-9 py-2.5 text-xs bg-white/90 dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800/90 rounded-xl text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 shadow-xs transition-all"
          />
          {filterState.searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter controls row */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {/* Category Dropdown */}
          <div className="flex items-center gap-1.5 bg-white/90 dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800/90 rounded-xl px-3 py-2 shrink-0 shadow-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <select
              value={filterState.category}
              onChange={(e) => setCategoryFilter(e.target.value)}
              aria-label="Filter by category"
              className="bg-transparent text-xs text-slate-700 dark:text-slate-300 font-semibold focus:outline-none cursor-pointer pr-1"
            >
              <option value="all" className="dark:bg-slate-900">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat} className="dark:bg-slate-900">
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Priority Dropdown */}
          <div className="flex items-center gap-1.5 bg-white/90 dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800/90 rounded-xl px-3 py-2 shrink-0 shadow-xs">
            <select
              value={filterState.priority}
              onChange={(e) => setPriorityFilter(e.target.value)}
              aria-label="Filter by priority"
              className="bg-transparent text-xs text-slate-700 dark:text-slate-300 font-semibold focus:outline-none cursor-pointer pr-1"
            >
              <option value="all" className="dark:bg-slate-900">All Priorities</option>
              <option value="critical" className="dark:bg-slate-900">Critical</option>
              <option value="high" className="dark:bg-slate-900">High</option>
              <option value="medium" className="dark:bg-slate-900">Medium</option>
              <option value="low" className="dark:bg-slate-900">Low</option>
            </select>
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-1.5 bg-white/90 dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800/90 rounded-xl px-3 py-2 shrink-0 shadow-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <select
              value={filterState.sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              aria-label="Sort tasks by"
              className="bg-transparent text-xs text-slate-700 dark:text-slate-300 font-semibold focus:outline-none cursor-pointer pr-1"
            >
              <option value="dueDateAsc" className="dark:bg-slate-900">Due Date (Earliest)</option>
              <option value="dueDateDesc" className="dark:bg-slate-900">Due Date (Latest)</option>
              <option value="priorityDesc" className="dark:bg-slate-900">Priority (High to Low)</option>
              <option value="priorityAsc" className="dark:bg-slate-900">Priority (Low to High)</option>
              <option value="createdDesc" className="dark:bg-slate-900">Date Created (Newest)</option>
              <option value="alphabetical" className="dark:bg-slate-900">Title (A to Z)</option>
            </select>
          </div>

          {/* Reset Filters button */}
          {isFiltered && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl border border-rose-200 dark:border-rose-900/60 transition-colors whitespace-nowrap shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Bottom row: Interactive segmented status pills & counter */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200/60 dark:border-slate-800/60">
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
          {statusOptions.map((opt) => {
            const isActive = filterState.status === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => setStatusFilter(opt.value)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? `${accentTheme.primaryBg} shadow-sm`
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/70'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>

        {/* Counter Badge */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-mono tabular-nums whitespace-nowrap bg-white/60 dark:bg-slate-900/60 px-2.5 py-1 rounded-lg border border-slate-200/50 dark:border-slate-800/50">
          <Sparkles className="w-3 h-3 text-indigo-500" />
          <span>Showing <strong className="text-slate-800 dark:text-slate-200 font-bold">{filteredTasks.length}</strong> of {tasks.length}</span>
        </div>
      </div>
    </div>
  );
};
