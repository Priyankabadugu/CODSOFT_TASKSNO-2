import React, { useState, useRef, useEffect } from 'react';
import { useTasks } from '../context/TaskContext';
import { useTheme, ACCENT_THEMES, AccentColor } from '../context/ThemeContext';
import {
  Plus,
  Sun,
  Moon,
  Laptop,
  Download,
  Upload,
  RotateCcw,
  SlidersHorizontal,
  LayoutList,
  Kanban,
  CalendarDays,
  BarChart2,
  Menu,
  X,
  Palette,
  Sparkles,
  Check,
} from 'lucide-react';
import { ViewMode } from '../types/task';

interface TopBarProps {
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
  onOpenBackupModal: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  onToggleSidebar,
  isSidebarOpen,
  onOpenBackupModal,
}) => {
  const { viewMode, setViewMode, openCreateModal, exportJSON, exportCSV, resetToDefaults } = useTasks();
  const { theme, setTheme, resolvedTheme, accent, setAccent, accentTheme } = useTheme();
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const [isColorMenuOpen, setIsColorMenuOpen] = useState(false);
  const [isDataMenuOpen, setIsDataMenuOpen] = useState(false);

  const themeMenuRef = useRef<HTMLDivElement>(null);
  const colorMenuRef = useRef<HTMLDivElement>(null);
  const dataMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (themeMenuRef.current && !themeMenuRef.current.contains(e.target as Node)) {
        setIsThemeMenuOpen(false);
      }
      if (colorMenuRef.current && !colorMenuRef.current.contains(e.target as Node)) {
        setIsColorMenuOpen(false);
      }
      if (dataMenuRef.current && !dataMenuRef.current.contains(e.target as Node)) {
        setIsDataMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems: { mode: ViewMode; label: string; icon: React.ReactNode }[] = [
    { mode: 'list', label: 'Tasks', icon: <LayoutList className="w-4 h-4" /> },
    { mode: 'board', label: 'Board', icon: <Kanban className="w-4 h-4" /> },
    { mode: 'calendar', label: 'Agenda', icon: <CalendarDays className="w-4 h-4" /> },
    { mode: 'analytics', label: 'Analytics', icon: <BarChart2 className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 md:px-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
      {/* Zone 1: Logo & Brand */}
      <div className="flex items-center gap-3">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
            className="md:hidden p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        )}
        <div className="flex items-center gap-2.5 group cursor-pointer" onClick={() => setViewMode('list')}>
          <div
            className={`w-8 h-8 rounded-xl bg-gradient-to-tr ${accentTheme.gradientBg} flex items-center justify-center text-white font-bold text-sm shadow-md transition-all duration-300 group-hover:scale-105 group-hover:rotate-1`}
            style={{ boxShadow: `0 4px 14px ${accentTheme.glowColor}` }}
          >
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold tracking-tight bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 dark:from-white dark:via-slate-200 dark:to-white bg-clip-text text-transparent">
              AuraTask
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 -mt-1 font-mono">
              Workspace
            </span>
          </div>
        </div>
      </div>

      {/* Zone 2: Navigation views */}
      <nav className="hidden sm:flex items-center gap-1 p-1 bg-slate-100/90 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-700/60 shadow-inner">
        {navItems.map((item) => {
          const isActive = viewMode === item.mode;
          return (
            <button
              key={item.mode}
              onClick={() => setViewMode(item.mode)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-all duration-200 ${
                isActive
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-white/50 dark:hover:bg-slate-800/40'
              }`}
            >
              <span className={isActive ? accentTheme.badgeText : 'text-slate-400'}>
                {item.icon}
              </span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Zone 3: Primary Actions */}
      <div className="flex items-center gap-2">
        {/* Accent Color Palette Switcher */}
        <div className="relative" ref={colorMenuRef}>
          <button
            onClick={() => setIsColorMenuOpen((prev) => !prev)}
            aria-label="Customize accent color"
            aria-expanded={isColorMenuOpen}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800 transition-colors"
            title="Theme Accent Colors"
          >
            <span
              className="w-3.5 h-3.5 rounded-full shadow-xs border border-white dark:border-slate-900 shrink-0"
              style={{ backgroundColor: accentTheme.dotColor }}
            />
            <span className="hidden xl:inline text-xs font-medium">{accentTheme.name.split(' ')[0]}</span>
          </button>

          {isColorMenuOpen && (
            <div className="absolute right-0 mt-2 w-52 p-2 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 text-xs z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Accent Theme
              </div>
              <div className="space-y-1 mt-1">
                {(Object.keys(ACCENT_THEMES) as AccentColor[]).map((key) => {
                  const item = ACCENT_THEMES[key];
                  const isSelected = accent === key;
                  return (
                    <button
                      key={key}
                      onClick={() => {
                        setAccent(key);
                        setIsColorMenuOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between transition-colors ${
                        isSelected
                          ? 'bg-slate-100 dark:bg-slate-800 font-semibold text-slate-900 dark:text-white'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className="w-3.5 h-3.5 rounded-full shadow-xs shrink-0"
                          style={{ backgroundColor: item.dotColor }}
                        />
                        <span>{item.name}</span>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 text-slate-700 dark:text-slate-300" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Theme Light/Dark Toggle */}
        <div className="relative" ref={themeMenuRef}>
          <button
            onClick={() => setIsThemeMenuOpen((prev) => !prev)}
            aria-label="Toggle theme mode"
            aria-expanded={isThemeMenuOpen}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800 transition-colors"
          >
            {resolvedTheme === 'dark' ? (
              <Moon className="w-4 h-4 text-indigo-400" />
            ) : (
              <Sun className="w-4 h-4 text-amber-500" />
            )}
          </button>

          {isThemeMenuOpen && (
            <div className="absolute right-0 mt-2 w-36 py-1 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 text-xs z-50 animate-in fade-in zoom-in-95 duration-100">
              <button
                onClick={() => {
                  setTheme('light');
                  setIsThemeMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 flex items-center gap-2 transition-colors ${
                  theme === 'light'
                    ? 'text-slate-900 dark:text-white font-semibold bg-slate-50 dark:bg-slate-800/60'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <span>Light</span>
              </button>
              <button
                onClick={() => {
                  setTheme('dark');
                  setIsThemeMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 flex items-center gap-2 transition-colors ${
                  theme === 'dark'
                    ? 'text-slate-900 dark:text-white font-semibold bg-slate-50 dark:bg-slate-800/60'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <Moon className="w-3.5 h-3.5 text-indigo-400" />
                <span>Dark</span>
              </button>
              <button
                onClick={() => {
                  setTheme('system');
                  setIsThemeMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 flex items-center gap-2 transition-colors ${
                  theme === 'system'
                    ? 'text-slate-900 dark:text-white font-semibold bg-slate-50 dark:bg-slate-800/60'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <Laptop className="w-3.5 h-3.5 text-slate-400" />
                <span>System</span>
              </button>
            </div>
          )}
        </div>

        {/* Data & Backup Options Dropdown */}
        <div className="relative" ref={dataMenuRef}>
          <button
            onClick={() => setIsDataMenuOpen((prev) => !prev)}
            aria-label="Backup and data options"
            aria-expanded={isDataMenuOpen}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800 transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>

          {isDataMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 py-1.5 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 text-xs z-50 animate-in fade-in zoom-in-95 duration-100">
              <button
                onClick={() => {
                  exportJSON();
                  setIsDataMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 flex items-center gap-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-indigo-500" />
                <span>Export JSON Backup</span>
              </button>
              <button
                onClick={() => {
                  exportCSV();
                  setIsDataMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 flex items-center gap-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-emerald-500" />
                <span>Export CSV Spreadsheet</span>
              </button>
              <button
                onClick={() => {
                  onOpenBackupModal();
                  setIsDataMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 flex items-center gap-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <Upload className="w-3.5 h-3.5 text-sky-500" />
                <span>Import JSON Data</span>
              </button>
              <div className="my-1 border-t border-slate-100 dark:border-slate-800" />
              <button
                onClick={() => {
                  if (window.confirm('Reset all tasks to sample initial data? Your current changes will be overwritten.')) {
                    resetToDefaults();
                  }
                  setIsDataMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 flex items-center gap-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to Sample Data</span>
              </button>
            </div>
          )}
        </div>

        {/* Primary CTA: Add Task with Glowing Accent */}
        <button
          onClick={() => openCreateModal()}
          className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl shadow-md transition-all duration-200 active:scale-95 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 ${accentTheme.primaryBg} ${accentTheme.primaryHover}`}
          style={{ boxShadow: `0 4px 14px ${accentTheme.glowColor}` }}
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>New Task</span>
        </button>
      </div>
    </header>
  );
};
