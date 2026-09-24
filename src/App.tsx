import React, { useState } from 'react';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { TaskProvider, useTasks } from './context/TaskContext';
import { TopBar } from './components/TopBar';
import { Sidebar } from './components/Sidebar';
import { DashboardStats } from './components/DashboardStats';
import { TaskFilterBar } from './components/TaskFilterBar';
import { TaskListView } from './components/TaskListView';
import { TaskBoardView } from './components/TaskBoardView';
import { TaskCalendarView } from './components/TaskCalendarView';
import { TaskAnalyticsView } from './components/TaskAnalyticsView';
import { TaskModal } from './components/TaskModal';
import { BatchActionBar } from './components/BatchActionBar';
import { DataBackupModal } from './components/DataBackupModal';
import { Plus } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { viewMode, openCreateModal } = useTasks();
  const { accentTheme } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);

  return (
    <div className="relative min-h-screen bg-slate-50/80 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200 overflow-x-hidden">
      {/* Ambient Color Glow Elements for modern visual depth */}
      <div
        className="pointer-events-none fixed top-0 left-1/4 -translate-x-1/2 w-96 h-96 rounded-full blur-3xl opacity-20 dark:opacity-15 transition-all duration-700"
        style={{ backgroundColor: accentTheme.dotColor }}
      />
      <div
        className="pointer-events-none fixed top-48 right-10 w-80 h-80 rounded-full blur-3xl opacity-15 dark:opacity-10 bg-indigo-500 transition-all duration-700"
      />

      {/* Top Bar adheres to 3-zone contract */}
      <TopBar
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        isSidebarOpen={isSidebarOpen}
        onOpenBackupModal={() => setIsBackupModalOpen(true)}
      />

      {/* Main Workspace Body */}
      <div className="relative z-10 flex-1 flex w-full max-w-[1520px] mx-auto">
        {/* Navigation Sidebar */}
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          onOpenBackupModal={() => setIsBackupModalOpen(true)}
        />

        {/* Content Viewport */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 max-w-6xl">
          {/* Dashboard Summary Statistics */}
          <DashboardStats />

          {/* Filter Bar (Search, Status tabs, Category, Priority, Sort) */}
          <TaskFilterBar />

          {/* Active View Container */}
          <div className="mt-2">
            {viewMode === 'list' && <TaskListView />}
            {viewMode === 'board' && <TaskBoardView />}
            {viewMode === 'calendar' && <TaskCalendarView />}
            {viewMode === 'analytics' && <TaskAnalyticsView />}
          </div>
        </main>
      </div>

      {/* Floating Action Button on Mobile */}
      <button
        onClick={() => openCreateModal()}
        aria-label="Create task"
        className={`md:hidden fixed right-5 bottom-5 z-30 w-14 h-14 rounded-2xl text-white shadow-xl flex items-center justify-center active:scale-95 transition-all focus:outline-none ${accentTheme.primaryBg} ${accentTheme.primaryHover}`}
        style={{ boxShadow: `0 8px 24px ${accentTheme.glowColor}` }}
      >
        <Plus className="w-6 h-6 stroke-[2.5]" />
      </button>

      {/* Multi-select Batch Action Dock */}
      <BatchActionBar />

      {/* Task Creation & Editing Modal */}
      <TaskModal />

      {/* Backup, Import, and Reset Dialog */}
      <DataBackupModal
        isOpen={isBackupModalOpen}
        onClose={() => setIsBackupModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <TaskProvider>
          <MainLayout />
        </TaskProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
