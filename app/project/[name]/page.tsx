'use client';

import { useState, useEffect } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
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
import { Rocket, Calendar, Trash, Download } from 'lucide-react';
import { Task, Project } from '@/lib/database.types';
import { MonthColumn } from '@/components/month-column';
import { TaskCard } from '@/components/task-card';
import { TrashBin } from '@/components/trash-bin';
import { TaskEditModal } from '@/components/task-edit-modal';
import { TaskDetailModal } from '@/components/task-detail-modal';
import { AddTaskButton } from '@/components/add-task-button';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { JsonUpload } from '@/components/json-upload';
import { TeamManagementModal } from '@/components/team-management-modal';
import {
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

export default function ProjectDashboard() {
  const params = useParams();
  const projectName = decodeURIComponent(params.name as string);
  const { data: session, status } = useSession();
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [viewingTask, setViewingTask] = useState<Task | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [currentUserRole, setCurrentUserRole] = useState<'owner' | 'editor' | 'viewer' | null>(null);
  
  const loading = status === 'loading';

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (status === 'authenticated' && projectName && session?.user?.id) {
      const fetchProject = async () => {
        try {
          const response = await fetch(`/api/projects?name=${encodeURIComponent(projectName)}`);
          if (!response.ok) {
            throw new Error('Failed to fetch project');
          }
          const data = await response.json();
          setProject(data);
          const userMember = data.team.find((member: any) => member.userId === session.user?.id);
          if (userMember) {
            setCurrentUserRole(userMember.role);
          }
        } catch (error) {
          console.error(error);
          toast.error('Failed to load project.');
        }
      };
      fetchProject();
    }
  }, [status, projectName, session?.user?.id]);

  useEffect(() => {
    if (project) {
      fetchTasks();
    }
  }, [project]);

  const fetchTasks = async () => {
    if (!project) return;
    try {
      const cached = localStorage.getItem(`cyclectl_tasks_${project._id}`);
      if (cached) {
        setTasks(JSON.parse(cached));
      }

      const response = await fetch(`/api/tasks?projectId=${project._id}&year=${new Date().getFullYear()}`);
      const data = await response.json();

      let allTasks: Task[] = data.schedule?.flatMap((s: any) => s.tasks) || [];

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
        const updatedTasks = allTasks.map(task => {
          const taskToUpdate = tasksToUpdate.find(t => t._id === task._id);
          return taskToUpdate ? taskToUpdate : task;
        });
        setTasks(updatedTasks);
        localStorage.setItem(`cyclectl_tasks_${project._id}`, JSON.stringify(updatedTasks));

        await Promise.all(tasksToUpdate.map(task => 
          fetch(`/api/tasks/${task._id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(task),
          })
        ));
      } else {
        setTasks(allTasks);
        localStorage.setItem(`cyclectl_tasks_${project._id}`, JSON.stringify(allTasks));
      }
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      toast.error('Failed to load tasks');
    }
  };

  const handleAddTask = async (taskData: any) => {
    if (!project) return;
    const taskWithProject = { ...taskData, projectId: project._id };
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskWithProject),
      });

      if (!response.ok) throw new Error('Failed to create task');

      const newTask = await response.json();
      setTasks(prev => [...prev, newTask]);
      localStorage.setItem(`cyclectl_tasks_${project._id}`, JSON.stringify([...tasks, newTask]));
      toast.success('Task created successfully');
    } catch (error) {
      console.error('Failed to add task:', error);
      toast.error('Failed to create task');
    }
  };

  const handleUpdateTask = async (updatedTask: Task) => {
    if (!project) return;
    try {
      const response = await fetch(`/api/tasks/${updatedTask._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTask),
      });

      if (!response.ok) throw new Error('Failed to update task');

      const updated = await response.json();
      setTasks(prev => prev.map(t => t._id === updated._id ? updated : t));
      localStorage.setItem(`cyclectl_tasks_${project._id}`, JSON.stringify(tasks.map(t => t._id === updated._id ? updated : t)));
      setIsEditModalOpen(false);
      setEditingTask(null);
      setIsDetailModalOpen(false);
      setViewingTask(null);
    } catch (error) {
      console.error('Failed to update task:', error);
      toast.error('Failed to update task');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!project) return;
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete task');

      const { deleted } = await response.json();
      setTasks(prev => prev.filter(t => t._id !== taskId));
      localStorage.setItem(`cyclectl_tasks_${project._id}`, JSON.stringify(tasks.filter(t => t._id !== taskId)));

      toast.success('Task deleted', {
        action: {
          label: 'Undo',
          onClick: () => handleAddTask(deleted),
        },
      });
      setIsDetailModalOpen(false);
      setViewingTask(null);
    } catch (error) {
      console.error('Failed to delete task:', error);
      toast.error('Failed to delete task');
    }
  };

  const handleClearBoard = async () => {
    if (!project) return;
    try {
      const response = await fetch('/api/tasks/clear', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ projectId: project._id }),
      });

      if (!response.ok) throw new Error('Failed to clear board');

      toast.success('Board cleared successfully');
      setTasks([]);
      localStorage.removeItem(`cyclectl_tasks_${project._id}`);
    } catch (error) {
      console.error('Failed to clear board:', error);
      toast.error('Failed to clear board');
    }
  };

  const handleExportJson = () => {
    if (!project || tasks.length === 0) {
      toast.info('No tasks to export or project not loaded.');
      return;
    }

    // Filter out internal fields like _id, userId, projectId, order_index, created_at, updated_at
    const exportableTasks = tasks.map(({ _id, userId, projectId, order_index, created_at, updated_at, ...rest }) => ({
      ...rest,
      start: new Date(rest.start).getUTCDate(), // Convert full date string back to day number
      end: new Date(rest.end).getUTCDate(), // Convert full date string back to day number
    }));

    const jsonString = JSON.stringify(exportableTasks, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.name}_tasks_${new Date().getFullYear()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Tasks exported successfully!');
  };


  const handleToggleComplete = async (task: Task) => {
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
    setIsDetailModalOpen(false);
    setViewingTask(null);
    setEditingTask(task);
    setIsEditModalOpen(true);
  };

  const handleViewTask = (task: Task) => {
    setViewingTask(task);
    setIsDetailModalOpen(true);
  };

  const tasksByMonth = MONTHS.reduce((acc, month) => {
    acc[month] = tasks.filter(t => t.month === month);
    return acc;
  }, {} as Record<string, Task[]>);

  if (loading) {
    // ...
  }

  if (status !== 'authenticated') {
    // ...
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      // Disable drag and drop for tasks if currentUserRole is not 'owner' (Permissions 4 & 6)
      // Permission 4: move tasks between months (only owner)
      // Permission 6: reorder tasks within a month (owner and editor)
      // The DndContext itself is not directly disabled here, but individual drag operations
      // are controlled by `canDrag` in TaskCard and checks in `handleDragEnd`.
      // The `useSortable` hook in TaskCard already disables reordering for 'viewer'.
      // For moving tasks between months (Permission 4), a check will be added in handleDragEnd.
      // So, DndContext itself does not need to be disabled based on role here.
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
                        {projectName ? projectName.toUpperCase() : 'CYCLECTL'}
                      </h1>
                      <p className="text-sm font-mono text-cyan-500/60">
                        Control the cycle. Ship the outcome.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <JsonUpload onUploadSuccess={fetchTasks} projectId={project?._id} disabled={currentUserRole !== 'owner'} />
                    <Button onClick={handleExportJson} disabled={!project || tasks.length === 0 || currentUserRole !== 'owner'}>
                      <Download className="w-4 h-4 mr-2" />
                      Export JSON
                    </Button>
                    <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-black/30 border border-cyan-500/30">
                      <Calendar className="w-4 h-4 mr-2 text-cyan-400" />
                      <span className="text-sm font-mono text-cyan-400">
                        {new Date().getFullYear()}
                      </span>
                    </div>
                    <Button onClick={() => setIsTeamModalOpen(true)} disabled={!project}>Share</Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" disabled={currentUserRole !== 'owner'}>
                          <Trash className="w-4 h-4 mr-2" />
                          Clear Board
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete all your tasks from the board for this project.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={handleClearBoard}>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    <Button onClick={() => signOut({ callbackUrl: '/' })}>Sign out</Button>
                    {session?.user?.email && (
                      <span className="text-sm font-mono text-cyan-400/80">{session.user.email}</span>
                    )}
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
                    onToggleComplete={handleToggleComplete}
                    currentUserRole={currentUserRole}
                  />
                ))}
              </div>
            </main>
          </div>
        </div>

        <TrashBin isDragging={!!activeTask} currentUserRole={currentUserRole} />
        <AddTaskButton onAdd={handleAddTask} disabled={currentUserRole === 'viewer'} />

        <DragOverlay>
          {activeTask && (
            <div className="opacity-80">
              <TaskCard task={activeTask} onEdit={() => {}} onViewDetails={() => {}} onToggleComplete={() => {}} currentUserRole={currentUserRole} />
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
          currentUserRole={currentUserRole}
        />
        <TaskDetailModal
          task={viewingTask}
          isOpen={isDetailModalOpen}
          onClose={() => {
            setIsDetailModalOpen(false);
            setViewingTask(null);
          }}
          onEdit={handleEditTask}
          currentUserRole={currentUserRole}
        />
        <TeamManagementModal
          isOpen={isTeamModalOpen}
          onClose={() => setIsTeamModalOpen(false)}
          project={project}
        />
      </div>
    </DndContext>
  );
}