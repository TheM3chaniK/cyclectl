'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save } from 'lucide-react';
import { Task } from '@/lib/database.types';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

interface TaskEditModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Task) => void;
  currentUserRole: 'owner' | 'editor' | 'viewer' | null;
}

export function TaskEditModal({ task, isOpen, onClose, onSave, currentUserRole }: TaskEditModalProps) {
  const [formData, setFormData] = useState<Partial<Task>>({});
  const [startDay, setStartDay] = useState<number | string>(1);
  const [endDay, setEndDay] = useState<number | string>(1);

  useEffect(() => {
    if (task) {
      setFormData(task);
      if (task.start) {
        setStartDay(new Date(task.start).getUTCDate());
      }
      if (task.end) {
        setEndDay(new Date(task.end).getUTCDate());
      }
    }
  }, [task]);

  useEffect(() => {
    if (formData.month && formData.year) {
      const monthIndex = MONTHS.indexOf(formData.month);
      const daysInMonth = new Date(formData.year, monthIndex + 1, 0).getDate();
      if (Number(startDay) > daysInMonth) {
        setStartDay(daysInMonth);
      }
      if (Number(endDay) > daysInMonth) {
        setEndDay(daysInMonth);
      }
    }
  }, [formData.month, formData.year, startDay, endDay]);

  useEffect(() => {
    if (startDay !== '' && endDay !== '' && Number(endDay) < Number(startDay)) {
      setEndDay(startDay);
    }
  }, [startDay, endDay]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUserRole === 'viewer') {
      toast.error('Viewers cannot edit tasks.');
      return;
    }
    if (formData._id) {
      const monthIndex = MONTHS.indexOf(formData.month!);
      const year = formData.year || new Date().getFullYear();
      const start = `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(startDay).padStart(2, '0')}`;
      const end = `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(endDay).padStart(2, '0')}`;
      const updatedTask = { ...formData, start, end } as Task;
      onSave(updatedTask);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && task && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-2xl rounded-xl border border-cyan-500/30 bg-gradient-to-br from-slate-900 to-slate-950 backdrop-blur-xl shadow-2xl shadow-cyan-500/20"
          >
            <div className="flex items-center justify-between p-6 border-b border-cyan-500/20">
              <h2 className="text-xl font-mono font-bold text-cyan-400">
                EDIT TASK
              </h2>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-cyan-500/20 transition-colors"
              >
                <X className="w-5 h-5 text-cyan-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-mono text-cyan-400 mb-2">
                  Task Title
                </label>
                <input
                  type="text"
                  value={formData.task_title || ''}
                  onChange={(e) => setFormData({ ...formData, task_title: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-black/50 border border-cyan-500/30 text-white font-mono text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                  required
                  disabled={currentUserRole === 'viewer'}
                />
              </div>

              <div>
                <label className="block text-sm font-mono text-cyan-400 mb-2">
                  Task Description
                </label>
                <textarea
                  value={formData.task_description || ''}
                  onChange={(e) => setFormData({ ...formData, task_description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg bg-black/50 border border-cyan-500/30 text-white font-mono text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all resize-none"
                  required
                  disabled={currentUserRole === 'viewer'}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-mono text-cyan-400 mb-2">
                    Month
                  </label>
                  <select
                    value={formData.month}
                    onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-black/50 border border-cyan-500/30 text-white font-mono text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                    disabled={currentUserRole === 'viewer'}
                  >
                    {MONTHS.map(month => (
                      <option key={month} value={month}>{month}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-mono text-cyan-400 mb-2">
                    Start Day
                  </label>
                  <input
                    type="number"
                    value={startDay}
                    onChange={(e) => setStartDay(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-black/50 border border-cyan-500/30 text-white font-mono text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                    required
                    min="1"
                    max={formData.month && formData.year ? new Date(formData.year, MONTHS.indexOf(formData.month) + 1, 0).getDate() : 31}
                    disabled={currentUserRole === 'viewer'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-mono text-cyan-400 mb-2">
                    End Day
                  </label>
                  <input
                    type="number"
                    value={endDay}
                    onChange={(e) => setEndDay(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-black/50 border border-cyan-500/30 text-white font-mono text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                    required
                    min="1"
                    max={formData.month && formData.year ? new Date(formData.year, MONTHS.indexOf(formData.month) + 1, 0).getDate() : 31}
                    disabled={currentUserRole === 'viewer'}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-mono text-cyan-400 mb-2">
                  Status
                </label>
                <select
                  value={formData.status || 'pending'}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as Task['status'] })}
                  className="w-full px-4 py-2 rounded-lg bg-black/50 border border-cyan-500/30 text-white font-mono text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                  disabled={currentUserRole === 'viewer'}
                >
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="overdue">Overdue</option>
                </select>
              </div>

              <div className="flex items-center gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gradient-to-r from-cyan-600 to-cyan-500 text-white font-mono text-sm font-bold hover:from-cyan-500 hover:to-cyan-400 transition-all shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50"
                  disabled={currentUserRole === 'viewer'}
                >
                  <Save className="w-4 h-4" />
                  SAVE CHANGES
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 rounded-lg border border-cyan-500/30 text-cyan-400 font-mono text-sm font-bold hover:bg-cyan-500/10 transition-all"
                >
                  CANCEL
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
