'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UserPlus, Send } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { Project, TeamMember } from '@/lib/database.types';

interface TeamManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
}

export function TeamManagementModal({ isOpen, onClose, project }: TeamManagementModalProps) {
  const { data: session } = useSession();
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [inviteEmail, setInviteEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [removingMemberId, setRemovingMemberId] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<'editor' | 'viewer'>('viewer');
  const [currentUserRole, setCurrentUserRole] = useState<'owner' | 'editor' | 'viewer' | null>(null);

  useEffect(() => {
    if (project && session?.user?.id) {
      setTeam(project.team);
      const userMember = project.team.find(member => member.userId === session.user?.id);
      if (userMember) {
        setCurrentUserRole(userMember.role);
      }
    }
  }, [project, session]);

  const handleInviteUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim() || !project || !currentUserRole) return;

    setLoading(true);
    try {
      const roleToAssign = currentUserRole === 'owner' ? selectedRole : currentUserRole;

      const response = await fetch(`/api/projects/${project._id}/team/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: inviteEmail, role: roleToAssign }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to invite user');
      }

      const newMember = await response.json();
      setTeam(prev => [...prev, newMember]);
      toast.success(`Invitation sent to ${inviteEmail} with role ${roleToAssign}`);
      setInviteEmail('');
      setSelectedRole('viewer'); // Reset role selection
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveUser = async (memberId: string) => {
    if (!project) return;
    setRemovingMemberId(memberId);
    try {
      const response = await fetch(`/api/projects/${project._id}/team/members/${memberId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to remove member');
      }

      setTeam(prev => prev.filter(member => member.userId !== memberId));
      toast.success('Team member removed successfully');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setRemovingMemberId(null);
    }
  };

  const isOwner = project?.ownerId === session?.user?.id;

  const handleChangeRole = async (memberId: string, newRole: 'owner' | 'editor' | 'viewer') => {
    if (!project || !isOwner) return; // Only owner can change roles
    
    // Prevent owner from changing their own role to non-owner if they are the sole owner
    if (memberId === session?.user?.id && newRole !== 'owner') {
      const ownerCount = team.filter(m => m.role === 'owner').length;
      if (ownerCount === 1) {
        toast.error('Cannot change your own role to a non-owner role if you are the sole owner.');
        return;
      }
    }

    try {
      const response = await fetch(`/api/projects/${project._id}/team/members/${memberId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newRole }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update member role');
      }

      setTeam(prev => prev.map(member => 
        member.userId === memberId ? { ...member, role: newRole } : member
      ));
      toast.success(`Role for ${team.find(m => m.userId === memberId)?.email} updated to ${newRole}`);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && project && (
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
                Manage Team for {project.name}
              </h2>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-cyan-500/20 transition-colors"
              >
                <X className="w-5 h-5 text-cyan-400" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {isOwner && (
                <div>
                                  <h3 className="text-lg font-mono font-bold text-cyan-400 mb-4">Invite New Member</h3>
                                  <form onSubmit={handleInviteUser} className="flex gap-4">
                                    <Input
                                      type="email"
                                      value={inviteEmail}
                                      onChange={(e) => setInviteEmail(e.target.value)}
                                      placeholder="Enter user's email"
                                      className="w-full px-4 py-2 rounded-lg bg-black/50 border border-cyan-500/30 text-white font-mono text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder:text-cyan-500/30"
                                    />
                                    {currentUserRole === 'owner' && (
                                      <select
                                        value={selectedRole}
                                        onChange={(e) => setSelectedRole(e.target.value as 'editor' | 'viewer')}
                                        className="px-4 py-2 rounded-lg bg-black/50 border border-cyan-500/30 text-white font-mono text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                                      >
                                        <option value="editor">Editor</option>
                                        <option value="viewer">Viewer</option>
                                      </select>
                                    )}
                                    <Button type="submit" disabled={loading || !inviteEmail.trim()}>
                                      <Send className="w-4 h-4 mr-2" />
                                      {loading ? 'Sending...' : 'Send Invite'}
                                    </Button>
                                  </form>                </div>
              )}

              <div>
                <h3 className="text-lg font-mono font-bold text-cyan-400 mb-4">Team Members</h3>
                <div className="space-y-4">
                  {team.map(member => (
                    <div key={member.userId} className="flex items-center justify-between p-4 rounded-lg bg-black/30">
                      <div>
                        <p className="font-mono text-white">{member.email}</p>
                        {isOwner ? (
                          <select
                            value={member.role}
                            onChange={(e) => handleChangeRole(member.userId, e.target.value as 'owner' | 'editor' | 'viewer')}
                            className="px-2 py-1 rounded-lg bg-black/50 border border-cyan-500/30 text-white font-mono text-xs focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                            disabled={member.role === 'owner' && team.filter(m => m.role === 'owner').length === 1}
                          >
                            <option value="owner">Owner</option>
                            <option value="editor">Editor</option>
                            <option value="viewer">Viewer</option>
                          </select>
                        ) : (
                          <p className="text-xs font-mono text-cyan-400/60">{member.role}</p>
                        )}
                      </div>
                      {isOwner && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleRemoveUser(member.userId)}
                          disabled={removingMemberId === member.userId || (member.role === 'owner' && team.filter(m => m.role === 'owner').length === 1)}
                        >
                          {removingMemberId === member.userId ? 'Removing...' : 'Remove'}
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
