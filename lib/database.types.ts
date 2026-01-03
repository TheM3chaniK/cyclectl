export type TeamMember = {
  userId: string;
  email: string;
  role: 'owner' | 'editor' | 'viewer';
};

export type Project = {
  _id: string;
  name: string;
  ownerId: string;
  team: TeamMember[];
  created_at: string;
  updated_at: string;
};

export type Task = {
  _id: string;
  userId: string;
  projectId: string;
  task_title: string;
  task_description: string;
  start: string;
  end: string;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  month: string;
  year: number;
  order_index: number;
  created_at: string;
  updated_at: string;
};
