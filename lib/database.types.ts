export type Task = {
  _id: string;
  userId: string;
  task_title: string;
  task_description: string;
  start: string;
  end: string;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  month: string;
  year: number;
  project: string;
  order_index: number;
  created_at: string;
  updated_at: string;
};
