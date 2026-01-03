'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Rocket, Plus, Folder } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSession, signOut } from 'next-auth/react'; // Added useSession and signOut
import { Project } from '@/lib/database.types';

export default function ProjectsPage() {
  const router = useRouter();
  const { data: session, status } = useSession(); // Get session status
  const [projects, setProjects] = useState<Project[]>([]);
  const [newProjectName, setNewProjectName] = useState('');
  const [loading, setLoading] = useState(true);

  // Redirect unauthenticated users to home page
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') { // Only fetch if authenticated
      fetchProjects();
    }
  }, [status]); // Dependency on status

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects');
      const data = await response.json();
      console.log('Fetched projects data:', data); // Debugging log
      if (Array.isArray(data)) {
        setProjects(data);
      } else {
        console.error('Fetched data is not an array:', data);
        setProjects([]); // Set to empty array to avoid crash
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newProjectName.trim()) {
      try {
        const response = await fetch('/api/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: newProjectName.trim() }),
        });
        if (!response.ok) {
          throw new Error('Failed to create project');
        }
        const newProject = await response.json();
        router.push(`/project/${encodeURIComponent(newProject.name)}`);
      } catch (error) {
        console.error('Failed to create project:', error);
      }
    }
  };

  if (loading || status === 'loading') { // Add status loading check
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="flex flex-col items-center gap-4">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <Folder className="w-12 h-12 text-cyan-400" />
          </motion.div>
          <p className="text-cyan-400 font-mono text-sm">LOADING PROJECTS...</p>
        </div>
      </div>
    );
  }

  // If not authenticated and not loading, it means status is 'unauthenticated'
  // The useEffect above will handle the redirect, so this part should not be reached for unauthenticated users.
  if (status === 'unauthenticated') {
    return null; // Or a simple message, as redirect is handled by useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="container mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-12"> {/* Added justify-between */}
          <div className="flex items-center gap-4">
            <Rocket className="w-10 h-10 text-cyan-400" />
            <div>
              <h1 className="text-4xl font-bold font-mono text-cyan-400 tracking-wider">
                CYCLECTL
              </h1>
              <p className="text-lg font-mono text-cyan-500/60">
                Select a project or create a new one to begin.
              </p>
            </div>
          </div>
          <Button onClick={() => signOut({ callbackUrl: '/' })}>Sign out</Button>
          {session?.user?.email && (
            <span className="text-sm font-mono text-cyan-400/80">{session.user.email}</span>
          )}
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-mono font-bold text-cyan-400 mb-6">Create New Project</h2>
          <form onSubmit={handleCreateProject} className="flex gap-4">
            <Input
              type="text"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              placeholder="Enter new project name..."
              className="w-full max-w-md px-4 py-2 rounded-lg bg-black/50 border border-cyan-500/30 text-white font-mono text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder:text-cyan-500/30"
            />
            <Button type="submit" disabled={!newProjectName.trim()}>
              <Plus className="w-5 h-5 mr-2" />
              Create
            </Button>
          </form>
        </div>

        <div>
          <h2 className="text-2xl font-mono font-bold text-cyan-400 mb-6">Existing Projects</h2>
          {projects.length === 0 ? (
            <p className="text-cyan-400/60 font-mono">No projects found. Create one to get started.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {projects.map((project, index) => (
                <motion.div
                  key={project._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Button
                    variant="outline"
                    className="w-full h-32 flex flex-col items-center justify-center gap-2 border-cyan-500/20 bg-slate-900/50 hover:bg-slate-800/50 hover:border-cyan-500/40"
                    onClick={() => router.push(`/project/${encodeURIComponent(project.name)}`)}
                  >
                    <Folder className="w-8 h-8 text-cyan-400" />
                    <span className="font-mono text-lg">{project.name}</span>
                  </Button>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
