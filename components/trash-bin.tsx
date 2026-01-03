'use client';

import { useDroppable } from '@dnd-kit/core';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TrashBinProps {
  isDragging: boolean;
  currentUserRole: 'owner' | 'editor' | 'viewer' | null;
}

export function TrashBin({ isDragging, currentUserRole }: TrashBinProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: 'trash',
    disabled: currentUserRole !== 'owner', // Only owner can delete
  });

  return (
    <AnimatePresence>
      {isDragging && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          className="fixed bottom-8 right-8 z-50"
        >
          <div
            ref={setNodeRef}
            className={cn(
              'relative flex items-center justify-center w-24 h-24 rounded-full',
              'backdrop-blur-xl border-2 transition-all duration-300',
              'shadow-2xl',
              isOver
                ? 'border-red-500 bg-red-950/80 shadow-red-500/50 scale-110'
                : 'border-cyan-500/30 bg-slate-950/80 shadow-cyan-500/30'
            )}
          >
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-red-500/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

            <motion.div
              animate={{
                scale: isOver ? [1, 1.2, 1] : 1,
                rotate: isOver ? [0, 10, -10, 0] : 0,
              }}
              transition={{ duration: 0.5, repeat: isOver ? Infinity : 0 }}
            >
              <Trash2
                className={cn(
                  'w-10 h-10 transition-colors',
                  isOver ? 'text-red-400' : 'text-cyan-400'
                )}
              />
            </motion.div>

            {isOver && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -inset-2 rounded-full border-2 border-red-500 opacity-50"
              />
            )}
          </div>

          <div
            className={cn(
              'absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap',
              'text-xs font-mono px-3 py-1 rounded-full',
              'backdrop-blur-xl border transition-all',
              isOver
                ? 'border-red-500/50 bg-red-950/80 text-red-400'
                : 'border-cyan-500/30 bg-slate-950/80 text-cyan-400'
            )}
          >
            {isOver ? 'RELEASE TO DELETE' : 'DROP HERE'}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
