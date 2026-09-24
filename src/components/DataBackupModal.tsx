import React, { useState, useRef } from 'react';
import { useTasks } from '../context/TaskContext';
import { Download, Upload, RotateCcw, X, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

interface DataBackupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DataBackupModal: React.FC<DataBackupModalProps> = ({ isOpen, onClose }) => {
  const { exportJSON, exportCSV, importJSON, resetToDefaults, tasks } = useTasks();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [importStatus, setImportStatus] = useState<{ message: string; isError: boolean } | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const res = importJSON(content);
      if (res.success) {
        setImportStatus({ message: res.message, isError: false });
        setTimeout(() => {
          onClose();
        }, 1200);
      } else {
        setImportStatus({ message: res.message, isError: true });
      }
    };
    reader.onerror = () => {
      setImportStatus({ message: 'Failed to read file.', isError: true });
    };
    reader.readAsText(file);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="backup-modal-title"
    >
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h2 id="backup-modal-title" className="text-base font-bold text-slate-900 dark:text-white">
              Data Management & Backup
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Manage your local storage records ({tasks.length} tasks)
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs">
          {importStatus && (
            <div
              className={`p-3 rounded-lg flex items-center gap-2 ${
                importStatus.isError
                  ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900'
                  : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900'
              }`}
            >
              {importStatus.isError ? (
                <AlertCircle className="w-4 h-4 shrink-0" />
              ) : (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              )}
              <span>{importStatus.message}</span>
            </div>
          )}

          {/* Export Options */}
          <div className="space-y-2">
            <h3 className="font-semibold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[11px]">
              Export Data
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={exportJSON}
                className="flex items-center justify-center gap-2 p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 font-medium text-slate-700 dark:text-slate-300 transition-colors"
              >
                <Download className="w-4 h-4 text-indigo-500" />
                <span>Export JSON</span>
              </button>
              <button
                onClick={exportCSV}
                className="flex items-center justify-center gap-2 p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 font-medium text-slate-700 dark:text-slate-300 transition-colors"
              >
                <FileText className="w-4 h-4 text-emerald-500" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          {/* Import Options */}
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <h3 className="font-semibold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[11px]">
              Restore / Import
            </h3>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center justify-center gap-2 p-3 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-400 hover:bg-indigo-50/20 dark:hover:bg-indigo-950/20 font-medium text-slate-700 dark:text-slate-300 transition-colors"
            >
              <Upload className="w-4 h-4 text-indigo-500" />
              <span>Select JSON Backup File</span>
            </button>
          </div>

          {/* Reset Option */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <h3 className="font-semibold text-rose-600 dark:text-rose-400 uppercase tracking-wider text-[11px] mb-2">
              Danger Zone
            </h3>
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to restore default sample tasks? Any unsaved edits will be replaced.')) {
                  resetToDefaults();
                  onClose();
                }
              }}
              className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 font-medium transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Sample Tasks</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
