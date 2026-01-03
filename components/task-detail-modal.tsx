'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Edit, Calendar, Clock, Tag, User } from 'lucide-react';
import { Task } from '@/lib/database.types';
import { cn } from '@/lib/utils';

interface TaskDetailModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (task: Task) => void;
  currentUserRole: 'owner' | 'editor' | 'viewer' | null;
}

export function TaskDetailModal({ task, isOpen, onClose, onEdit, currentUserRole }: TaskDetailModalProps) {
  if (!isOpen || !task) return null;

  const statusColors = {
    pending: 'text-cyan-400 bg-cyan-500/20 border-cyan-500/30',
    in_progress: 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30',
    completed: 'text-green-400 bg-green-500/20 border-green-500/30',
  };

  return (
    <AnimatePresence>
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
              TASK DETAILS
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => onEdit(task)}
                className="p-2 rounded-lg hover:bg-cyan-500/20 transition-colors"
                disabled={currentUserRole === 'viewer'}
              >
                <Edit className="w-5 h-5 text-cyan-400" />
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-cyan-500/20 transition-colors"
              >
                <X className="w-5 h-5 text-cyan-400" />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-4 text-white/90 font-mono">
            <div>
              <p className="text-sm text-cyan-500/60">Title</p>
              <p className="text-lg font-bold">{task.task_title}</p>
            </div>

            <div>
              <p className="text-sm text-cyan-500/60">Description</p>
              <p>{task.task_description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-cyan-500/60">Start Date</p>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-cyan-400" />
                  <p>{task.start}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-cyan-500/60">End Date</p>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-cyan-400" />
                  <p>{task.end}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-cyan-500/60">Month</p>
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-cyan-400" />
                  <p>{task.month}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-cyan-500/60">Status</p>
                <span className={cn(
                  "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase",
                  statusColors[task.status as keyof typeof statusColors]
                )}>
                  {task.status.replace('_', ' ')}
                </span>
              </div>
            </div>

            {task.project && (
              <div>
                <p className="text-sm text-cyan-500/60">Project</p>
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-cyan-400" />
                  <p>{task.project}</p>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
