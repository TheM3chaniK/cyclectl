'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Rocket } from 'lucide-react';

interface AddTaskButtonProps {
  onAdd: (task: {
    task_title: string;
    task_description: string;
    start: string;
    end: string;
    month: string;
    year: number;
    status: string;
  }) => void;
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export function AddTaskButton({ onAdd }: AddTaskButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    task_title: '',
    task_description: '',
    start: '',
    end: '',
    month: 'January',
    year: new Date().getFullYear(),
    status: 'pending',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData);
    setFormData({
      task_title: '',
      task_description: '',
      start: '',
      end: '',
      month: 'January',
      year: new Date().getFullYear(),
      status: 'pending',
    });
    setIsOpen(false);
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 left-8 z-40 flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-cyan-600 to-cyan-500 text-white font-mono text-sm font-bold shadow-2xl shadow-cyan-500/50 hover:shadow-cyan-500/70 transition-all"
      >
        <Plus className="w-5 h-5" />
        NEW TASK
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
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
                  CREATE NEW TASK
                </h2>
                <button
                  onClick={() => setIsOpen(false)}
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
                    value={formData.task_title}
                    onChange={(e) => setFormData({ ...formData, task_title: e.target.value })}
                    placeholder="e.g., Design Landing Page"
                    className="w-full px-4 py-2 rounded-lg bg-black/50 border border-cyan-500/30 text-white font-mono text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder:text-cyan-500/30"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-mono text-cyan-400 mb-2">
                    Task Description
                  </label>
                  <textarea
                    value={formData.task_description}
                    onChange={(e) => setFormData({ ...formData, task_description: e.target.value })}
                    placeholder="What needs to be done?"
                    rows={3}
                    className="w-full px-4 py-2 rounded-lg bg-black/50 border border-cyan-500/30 text-white font-mono text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all resize-none placeholder:text-cyan-500/30"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-mono text-cyan-400 mb-2">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={formData.start}
                      onChange={(e) => setFormData({ ...formData, start: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg bg-black/50 border border-cyan-500/30 text-white font-mono text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-mono text-cyan-400 mb-2">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={formData.end}
                      onChange={(e) => setFormData({ ...formData, end: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg bg-black/50 border border-cyan-500/30 text-white font-mono text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-mono text-cyan-400 mb-2">
                      Month
                    </label>
                    <select
                      value={formData.month}
                      onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg bg-black/50 border border-cyan-500/30 text-white font-mono text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                    >
                      {MONTHS.map(month => (
                        <option key={month} value={month}>{month}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-mono text-cyan-400 mb-2">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg bg-black/50 border border-cyan-500/30 text-white font-mono text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                    >
                      <option value="pending">Pending</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gradient-to-r from-cyan-600 to-cyan-500 text-white font-mono text-sm font-bold hover:from-cyan-500 hover:to-cyan-400 transition-all shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50"
                  >
                    <Rocket className="w-4 h-4" />
                    CREATE TASK
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
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
    </>
  );
}
