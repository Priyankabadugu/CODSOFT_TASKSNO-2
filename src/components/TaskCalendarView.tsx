import React from 'react';
import { useTasks } from '../context/TaskContext';
import { useTheme } from '../context/ThemeContext';
import { Task } from '../types/task';
import { TaskItem } from './TaskItem';
import {
  getTodayDateString,
  getDateOffsetString,
  isOverdue,
  isDueToday,
  isDueTomorrow,
} from '../utils/taskHelpers';
import { Calendar, AlertCircle, Clock, CalendarDays } from 'lucide-react';

export const TaskCalendarView: React.FC = () => {
  const { filteredTasks } = useTasks();
  const { accentTheme } = useTheme();

  const overdueTasks: Task[] = [];
  const todayTasks: Task[] = [];
  const tomorrowTasks: Task[] = [];
  const thisWeekTasks: Task[] = [];
  const laterTasks: Task[] = [];
  const noDueDateTasks: Task[] = [];

  const todayStr = getTodayDateString();
  const nextWeekStr = getDateOffsetString(7);

  filteredTasks.forEach((task) => {
    if (task.status === 'completed') {
      laterTasks.push(task);
      return;
    }

    if (!task.dueDate) {
      noDueDateTasks.push(task);
      return;
    }

    if (isOverdue(task.dueDate, task.dueTime, task.status)) {
      overdueTasks.push(task);
    } else if (isDueToday(task.dueDate)) {
      todayTasks.push(task);
    } else if (isDueTomorrow(task.dueDate)) {
      tomorrowTasks.push(task);
    } else if (task.dueDate <= nextWeekStr) {
      thisWeekTasks.push(task);
    } else {
      laterTasks.push(task);
    }
  });

  const sections = [
    {
      id: 'overdue',
      title: 'Overdue Deadlines',
      tasks: overdueTasks,
      icon: <AlertCircle className="w-4 h-4 text-white" />,
      badgeColor: 'bg-rose-500 text-white',
      headerBg: 'bg-rose-500/10 dark:bg-rose-500/15 border-rose-200 dark:border-rose-900/50',
      titleColor: 'text-rose-600 dark:text-rose-400',
    },
    {
      id: 'today',
      title: 'Due Today',
      tasks: todayTasks,
      icon: <Clock className="w-4 h-4 text-white" />,
      badgeColor: 'bg-amber-500 text-white',
      headerBg: 'bg-amber-500/10 dark:bg-amber-500/15 border-amber-200 dark:border-amber-900/50',
      titleColor: 'text-amber-600 dark:text-amber-400',
    },
    {
      id: 'tomorrow',
      title: 'Due Tomorrow',
      tasks: tomorrowTasks,
      icon: <CalendarDays className="w-4 h-4 text-white" />,
      badgeColor: 'bg-indigo-600 text-white',
      headerBg: 'bg-indigo-500/10 dark:bg-indigo-500/15 border-indigo-200 dark:border-indigo-900/50',
      titleColor: 'text-indigo-600 dark:text-indigo-400',
    },
    {
      id: 'thisWeek',
      title: 'Upcoming (Next 7 Days)',
      tasks: thisWeekTasks,
      icon: <Calendar className="w-4 h-4 text-slate-700 dark:text-slate-300" />,
      badgeColor: 'bg-slate-700 text-white dark:bg-slate-300 dark:text-slate-900',
      headerBg: 'bg-slate-100 dark:bg-slate-800/60 border-slate-200 dark:border-slate-800',
      titleColor: 'text-slate-800 dark:text-slate-200',
    },
    {
      id: 'later',
      title: 'Later & Completed',
      tasks: laterTasks,
      icon: <Calendar className="w-4 h-4 text-slate-500" />,
      badgeColor: 'bg-slate-500 text-white',
      headerBg: 'bg-slate-100/60 dark:bg-slate-800/40 border-slate-200/60 dark:border-slate-800/60',
      titleColor: 'text-slate-600 dark:text-slate-400',
    },
  ];

  return (
    <div className="space-y-6">
      {sections.map((section) => {
        if (section.tasks.length === 0) return null;

        return (
          <div key={section.id} className="space-y-3">
            <div className={`flex items-center justify-between px-3.5 py-2 rounded-xl border ${section.headerBg}`}>
              <div className="flex items-center gap-2.5">
                <div className={`w-6 h-6 rounded-lg ${section.badgeColor} flex items-center justify-center shadow-xs`}>
                  {section.icon}
                </div>
                <h3 className={`text-xs font-bold uppercase tracking-wider ${section.titleColor}`}>
                  {section.title}
                </h3>
              </div>
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-full bg-white dark:bg-slate-900 shadow-xs border border-slate-200/60 dark:border-slate-800/60">
                {section.tasks.length}
              </span>
            </div>

            <div className="space-y-2.5 pl-1">
              {section.tasks.map((task) => (
                <TaskItem key={task.id} task={task} />
              ))}
            </div>
          </div>
        );
      })}

      {noDueDateTasks.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-3.5 py-2 rounded-xl border bg-slate-100/50 dark:bg-slate-800/30 border-slate-200 dark:border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              No Due Date Assigned
            </h3>
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              {noDueDateTasks.length}
            </span>
          </div>

          <div className="space-y-2.5 pl-1">
            {noDueDateTasks.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
