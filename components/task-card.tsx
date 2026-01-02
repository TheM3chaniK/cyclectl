'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';
import { Calendar, Clock, Edit2, GripVertical } from 'lucide-react';
import { Task } from '@/lib/database.types';
import { cn } from '@/lib/utils';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onViewDetails: (task: Task) => void;
}

export function TaskCard({ task, onEdit, onViewDetails }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const statusColors = {
    pending: 'border-cyan-500/30 bg-cyan-950/20',
    in_progress: 'border-yellow-500/30 bg-yellow-950/20',
    completed: 'border-green-500/30 bg-green-950/20',
    overdue: 'border-red-500/30 bg-red-950/20', // New overdue style
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      onClick={() => onViewDetails(task)}
      className={cn(
        'group relative rounded-lg border backdrop-blur-xl p-4',
        'transition-all duration-300',
        'hover:shadow-lg hover:shadow-cyan-500/20',
        statusColors[task.status as keyof typeof statusColors] || statusColors.pending,
        isDragging && 'opacity-50 shadow-2xl shadow-cyan-500/40'
      )}
    >
      <div
        {...listeners}
        className="absolute top-1/2 -left-3 -translate-y-1/2 p-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
      >
        <GripVertical className="w-4 h-4 text-cyan-400/50" />
      </div>

      <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="relative space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-mono text-white/90 leading-tight flex-1">
            {task.task_title}
          </h3>
        </div>

        <div className="flex items-center gap-4 text-xs text-cyan-300/60">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3 h-3" />
            <span className="font-mono">{task.start}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3 h-3" />
            <span className="font-mono">{task.end}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className={cn(
            "text-[10px] font-mono px-2 py-0.5 rounded-full",
            task.status === 'completed' && 'bg-green-500/20 text-green-400 border border-green-500/30',
            task.status === 'in_progress' && 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
            task.status === 'pending' && 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30',
            task.status === 'overdue' && 'bg-red-500/20 text-red-400 border border-red-500/30' // New overdue style
          )}>
            {task.status.replace('_', ' ').toUpperCase()}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
