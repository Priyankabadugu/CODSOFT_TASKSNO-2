import React, { useState } from 'react';
import { useTasks } from '../context/TaskContext';
import { useTheme } from '../context/ThemeContext';
import { CheckCircle2, Trash2, Tag, X } from 'lucide-react';

export const BatchActionBar: React.FC = () => {
  const {
    selectedTaskIds,
    clearSelection,
    batchCompleteSelected,
    batchDeleteSelected,
    batchSetCategory,
    categories,
  } = useTasks();

  const { accentTheme } = useTheme();
  const [isCategoryPickerOpen, setIsCategoryPickerOpen] = useState(false);

  if (selectedTaskIds.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 sm:gap-3 px-4 py-2.5 bg-slate-900/95 dark:bg-white/95 backdrop-blur-xl text-white dark:text-slate-900 rounded-full shadow-2xl border border-slate-700/80 dark:border-slate-300/80 animate-in fade-in slide-in-from-bottom-4 duration-200">
      <div className="flex items-center gap-2 text-xs font-bold pr-2 border-r border-slate-700 dark:border-slate-300">
        <span
          className={`font-mono tabular-nums text-white w-5 h-5 rounded-full flex items-center justify-center text-[11px] shadow-xs ${accentTheme.primaryBg}`}
        >
          {selectedTaskIds.length}
        </span>
        <span className="hidden sm:inline">selected</span>
      </div>

      {/* Mark Complete */}
      <button
        onClick={batchCompleteSelected}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs transition-colors"
      >
        <CheckCircle2 className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Mark</span> Complete
      </button>

      {/* Move Category */}
      <div className="relative">
        <button
          onClick={() => setIsCategoryPickerOpen(!isCategoryPickerOpen)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full bg-slate-800 dark:bg-slate-200 text-slate-200 dark:text-slate-800 hover:bg-slate-700 dark:hover:bg-slate-300 transition-colors"
        >
          <Tag className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Category</span>
        </button>

        {isCategoryPickerOpen && (
          <div className="absolute bottom-full mb-2 left-0 w-48 py-1.5 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 z-50">
            <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Set Category
            </div>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  batchSetCategory(cat);
                  setIsCategoryPickerOpen(false);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors truncate font-medium"
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Delete */}
      <button
        onClick={batchDeleteSelected}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full bg-rose-600 hover:bg-rose-500 text-white shadow-xs transition-colors"
      >
        <Trash2 className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Delete</span>
      </button>

      {/* Dismiss / Clear Selection */}
      <button
        onClick={clearSelection}
        aria-label="Clear selection"
        className="p-1 rounded-full text-slate-400 hover:text-white dark:hover:text-slate-900 transition-colors ml-1"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
