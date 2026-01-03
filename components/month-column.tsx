'use client';

import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { motion } from 'framer-motion';
import { Task } from '@/lib/database.types';
import { TaskCard } from './task-card';
import { cn } from '@/lib/utils';

interface MonthColumnProps {
  month: string;
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onViewDetails: (task: Task) => void;
  onToggleComplete: (task: Task) => void;
  currentUserRole: 'owner' | 'editor' | 'viewer' | null;
}

export function MonthColumn({ month, tasks, onEditTask, onViewDetails, onToggleComplete, currentUserRole }: MonthColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: month,
  });

  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const totalTasks = tasks.length;
  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'flex flex-col rounded-xl border border-cyan-500/20 backdrop-blur-xl',
        'bg-gradient-to-br from-slate-900/80 to-slate-950/80',
        'transition-all duration-300',
        isOver && 'border-cyan-500/60 shadow-lg shadow-cyan-500/30 scale-[1.02]'
      )}
    >
      <div className="p-4 border-b border-cyan-500/20">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold font-mono text-cyan-400 tracking-wider">
            {month.toUpperCase()}
          </h2>
          <div className="text-xs font-mono text-cyan-300/60">
            {completedTasks}/{totalTasks}
          </div>
        </div>

        <div className="relative h-1.5 rounded-full bg-black/50 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-500 to-cyan-400 rounded-full"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
          </motion.div>
        </div>
      </div>

      <div
        ref={setNodeRef}
        className="flex-1 p-4 space-y-3 h-[400px] max-h-[400px] overflow-y-auto"
      >
        <SortableContext
          items={tasks.map(t => t._id)}
          strategy={verticalListSortingStrategy}
        >
          {tasks.map((task) => (
            <TaskCard key={task._id} task={task} onEdit={onEditTask} onViewDetails={onViewDetails} onToggleComplete={onToggleComplete} currentUserRole={currentUserRole} />
          ))}
        </SortableContext>

        {tasks.length === 0 && (
          <div className="flex items-center justify-center h-full text-cyan-500/30 text-sm font-mono">
            Drop tasks here
          </div>
        )}
      </div>
    </motion.div>
  );
}
