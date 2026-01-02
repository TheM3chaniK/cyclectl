'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Clock, CheckCircle, Circle, PlayCircle } from 'lucide-react';
import { Task } from '@/lib/database.types';
import { format, parseISO } from 'date-fns';

export default function MonthPage() {
  const params = useParams();
  const router = useRouter();
  const monthName = params.name as string;
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMonthTasks();
  }, [monthName]);

  const fetchMonthTasks = async () => {
    try {
      const response = await fetch(`/api/tasks?year=${new Date().getFullYear()}`);
      const data = await response.json();
      const monthSchedule = data.schedule?.find(
        (s: any) => s.month.toLowerCase() === monthName.toLowerCase()
      );
      setTasks(monthSchedule?.tasks || []);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'in_progress':
        return <PlayCircle className="w-5 h-5 text-yellow-400" />;
      default:
        return <Circle className="w-5 h-5 text-cyan-400" />;
    }
  };

  const completedCount = tasks.filter(t => t.status === 'completed').length;
  const progressPercentage = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="flex flex-col items-center gap-4">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <Calendar className="w-12 h-12 text-cyan-400" />
          </motion.div>
          <p className="text-cyan-400 font-mono text-sm">LOADING {monthName.toUpperCase()}...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-cyan-900/20 via-transparent to-transparent" />

        <div className="relative">
          <header className="border-b border-cyan-500/20 backdrop-blur-xl bg-slate-950/50">
            <div className="container mx-auto px-6 py-6">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => router.push('/')}
                  className="p-2 rounded-lg hover:bg-cyan-500/20 transition-colors"
                >
                  <ArrowLeft className="w-6 h-6 text-cyan-400" />
                </button>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold font-mono text-cyan-400 tracking-wider">
                    {monthName.toUpperCase()}
                  </h1>
                  <p className="text-sm font-mono text-cyan-500/60">
                    {tasks.length} tasks · {completedCount} completed
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <div className="relative h-2 rounded-full bg-black/50 overflow-hidden">
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
            </div>
          </header>

          <main className="container mx-auto px-6 py-8">
            {tasks.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-20"
              >
                <Calendar className="w-20 h-20 text-cyan-500/20 mb-4" />
                <p className="text-cyan-400/60 font-mono text-lg">No tasks scheduled</p>
              </motion.div>
            ) : (
              <div className="space-y-4">
                {tasks.map((task, index) => (
                  <motion.div
                    key={task._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group relative rounded-xl border border-cyan-500/20 backdrop-blur-xl bg-gradient-to-br from-slate-900/80 to-slate-950/80 p-6 hover:border-cyan-500/40 hover:shadow-lg hover:shadow-cyan-500/20 transition-all"
                  >
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                    <div className="relative flex items-start gap-4">
                      <div className="pt-1">
                        {getStatusIcon(task.status)}
                      </div>

                      <div className="flex-1 space-y-3">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-xs font-mono px-2 py-1 rounded-full bg-black/50 text-cyan-400 border border-cyan-500/30">
                              {task.task_title}
                            </span>
                            <span className={`text-xs font-mono px-2 py-1 rounded-full ${
                              task.status === 'completed'
                                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                : task.status === 'in_progress'
                                ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                                : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                            }`}>
                              {task.status.replace('_', ' ').toUpperCase()}
                            </span>
                          </div>
                          <h3 className="text-lg font-mono text-white/90 mb-3">
                            {task.task_description}
                          </h3>
                        </div>

                        <div className="flex items-center gap-6 text-sm text-cyan-300/60">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span className="font-mono">{task.start}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span className="font-mono">{task.end}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
