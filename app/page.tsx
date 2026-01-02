'use client';

import { useState, useEffect } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { motion } from 'framer-motion';
import { Rocket, Calendar, Trash } from 'lucide-react';
import { Task } from '@/lib/database.types';
import { MonthColumn } from '@/components/month-column';
import { TaskCard } from '@/components/task-card';
import { TrashBin } from '@/components/trash-bin';
import { TaskEditModal } from '@/components/task-edit-modal';
import { TaskDetailModal } from '@/components/task-detail-modal'; // New Import
import { AddTaskButton } from '@/components/add-task-button';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { JsonUpload } from '@/components/json-upload';
import { // New Import for AlertDialog
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [viewingTask, setViewingTask] = useState<Task | null>(null); // New State
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false); // New State
  
  const loading = status === 'loading';

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (status === 'authenticated') {
      fetchTasks();
    }
  }, [status]);

  const fetchTasks = async () => {
    try {
      const cached = localStorage.getItem('shipctrl_tasks');
      if (cached) {
        setTasks(JSON.parse(cached));
      }

      const response = await fetch(`/api/tasks?year=${new Date().getFullYear()}`);
      const data = await response.json();

      let allTasks: Task[] = data.schedule?.flatMap((s: any) => s.tasks) || [];

      // Auto-update task status
      const today = new Date();
      const tasksToUpdate: Task[] = [];
      
      allTasks.forEach(task => {
        const startDate = new Date(task.start);
        const endDate = new Date(task.end);
        
        if (task.status !== 'completed' && today > endDate) {
          tasksToUpdate.push({ ...task, status: 'overdue' });
        } else if (task.status === 'pending' && today >= startDate && today <= endDate) {
          tasksToUpdate.push({ ...task, status: 'in_progress' });
        }
      });
      
      if (tasksToUpdate.length > 0) {
        // Optimistically update the UI
        const updatedTasks = allTasks.map(task => {
          const taskToUpdate = tasksToUpdate.find(t => t._id === task._id);
          return taskToUpdate ? taskToUpdate : task;
        });
        setTasks(updatedTasks);
        localStorage.setItem('shipctrl_tasks', JSON.stringify(updatedTasks));

        // Send updates to the server
        await Promise.all(tasksToUpdate.map(task => 
          fetch(`/api/tasks/${task._id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(task),
          })
        ));
      } else {
        setTasks(allTasks);
        localStorage.setItem('shipctrl_tasks', JSON.stringify(allTasks));
      }
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      toast.error('Failed to load tasks');
    }
  };

  const handleAddTask = async (taskData: any) => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData),
      });

      if (!response.ok) throw new Error('Failed to create task');

      const newTask = await response.json();
      setTasks(prev => [...prev, newTask]);
      localStorage.setItem('shipctrl_tasks', JSON.stringify([...tasks, newTask]));
      toast.success('Task created successfully');
    } catch (error) {
      console.error('Failed to add task:', error);
      toast.error('Failed to create task');
    }
  };

  const handleUpdateTask = async (updatedTask: Task) => {
    try {
      const response = await fetch(`/api/tasks/${updatedTask._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTask),
      });

      if (!response.ok) throw new Error('Failed to update task');

      const updated = await response.json();
      setTasks(prev => prev.map(t => t._id === updated._id ? updated : t));
      localStorage.setItem('shipctrl_tasks', JSON.stringify(tasks.map(t => t._id === updated._id ? updated : t)));
      setIsEditModalOpen(false);
      setEditingTask(null);
      setIsDetailModalOpen(false); // Close detail modal after update
      setViewingTask(null); // Clear viewing task after update
    } catch (error) {
      console.error('Failed to update task:', error);
      toast.error('Failed to update task');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete task');

      const { deleted } = await response.json();
      setTasks(prev => prev.filter(t => t._id !== taskId));
      localStorage.setItem('shipctrl_tasks', JSON.stringify(tasks.filter(t => t._id !== taskId)));

      toast.success('Task deleted', {
        action: {
          label: 'Undo',
          onClick: () => handleAddTask(deleted),
        },
      });
      setIsDetailModalOpen(false); // Close detail modal after delete
      setViewingTask(null); // Clear viewing task after delete
    } catch (error) {
      console.error('Failed to delete task:', error);
      toast.error('Failed to delete task');
    }
  };

  const handleClearBoard = async () => {
    try {
      const response = await fetch('/api/tasks/clear', {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to clear board');

      toast.success('Board cleared successfully');
      setTasks([]);
      localStorage.removeItem('shipctrl_tasks');
    } catch (error) {
      console.error('Failed to clear board:', error);
      toast.error('Failed to clear board');
    }
  };

  const handleToggleComplete = async (task: Task) => { // New function
    const newStatus: Task['status'] = task.status === 'completed' ? 'pending' : 'completed';
    const updatedTask = { ...task, status: newStatus };
    await handleUpdateTask(updatedTask);
  };

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find(t => t._id === event.active.id);
    setActiveTask(task || null);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    if (over.id === 'trash') {
      await handleDeleteTask(active.id as string);
      return;
    }

    const activeTask = tasks.find(t => t._id === active.id);
    if (!activeTask) return;

    if (MONTHS.includes(over.id as string)) {
      const newMonth = over.id as string;
      if (activeTask.month !== newMonth) {
        const updatedTask = { ...activeTask, month: newMonth };
        await handleUpdateTask(updatedTask);
      }
    }
  };

  const handleEditTask = (task: Task) => {
    setIsDetailModalOpen(false); // Close detail modal before opening edit modal
    setViewingTask(null); // Clear viewing task
    setEditingTask(task);
    setIsEditModalOpen(true);
  };

  const handleViewTask = (task: Task) => { // New function
    setViewingTask(task);
    setIsDetailModalOpen(true);
  };

  const tasksByMonth = MONTHS.reduce((acc, month) => {
    acc[month] = tasks.filter(t => t.month === month);
    return acc;
  }, {} as Record<string, Task[]>);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="flex flex-col items-center gap-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          >
            <Rocket className="w-12 h-12 text-cyan-400" />
          </motion.div>
          <p className="text-cyan-400 font-mono text-sm">LOADING CYCLECTL...</p>
        </div>
      </div>
    );
  }

  if (status !== 'authenticated') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="flex flex-col items-center gap-4">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Rocket className="w-16 h-16 text-cyan-400" />
          </motion.div>
          <h1 className="text-4xl font-bold font-mono text-cyan-400 tracking-wider">
            CYCLECTL
          </h1>
          <p className="text-lg font-mono text-cyan-500/60">
            The system that exists only to ship.
          </p>
          <div className="flex gap-4 mt-8">
            <Button onClick={() => signIn('github')}>Sign in with GitHub</Button>
            <Button onClick={() => signIn('google')}>Sign in with Google</Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-cyan-900/20 via-transparent to-transparent" />

          <div className="relative">
            <header className="border-b border-cyan-500/20 backdrop-blur-xl bg-slate-950/50">
              <div className="container mx-auto px-6 py-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Rocket className="w-8 h-8 text-cyan-400" />
                    </motion.div>
                    <div>
                      <h1 className="text-3xl font-bold font-mono text-cyan-400 tracking-wider">
                        CYCLECTL
                      </h1>
                      <p className="text-sm font-mono text-cyan-500/60">
                        The system that exists only to ship.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <JsonUpload onUploadSuccess={fetchTasks} />
                    <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-black/30 border border-cyan-500/30">
                      <Calendar className="w-4 h-4 text-cyan-400" />
                      <span className="text-sm font-mono text-cyan-400">
                        {new Date().getFullYear()}
                      </span>
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive">
                          <Trash className="w-4 h-4 mr-2" />
                          Clear Board
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete all your tasks from the board.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={handleClearBoard}>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    <Button onClick={() => signOut()}>Sign out</Button>
                  </div>
                </div>
              </div>
            </header>

            <main className="container mx-auto px-6 py-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {MONTHS.map((month) => (
                  <MonthColumn
                    key={month}
                    month={month}
                    tasks={tasksByMonth[month]}
                    onEditTask={handleEditTask}
                    onViewDetails={handleViewTask}
                    onToggleComplete={handleToggleComplete} // New Prop
                  />
                ))}
              </div>
            </main>
          </div>
        </div>

        <TrashBin isDragging={!!activeTask} />
        <AddTaskButton onAdd={handleAddTask} />

        <DragOverlay>
          {activeTask && (
            <div className="opacity-80">
              <TaskCard task={activeTask} onEdit={() => {}} onViewDetails={() => {}} onToggleComplete={() => {}} /> // New Prop
            </div>
          )}
        </DragOverlay>

        <TaskEditModal
          task={editingTask}
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingTask(null);
          }}
          onSave={handleUpdateTask}
        />
        <TaskDetailModal
          task={viewingTask}
          isOpen={isDetailModalOpen}
          onClose={() => {
            setIsDetailModalOpen(false);
            setViewingTask(null);
          }}
          onEdit={handleEditTask}
        />
      </div>
    </DndContext>
  );
}