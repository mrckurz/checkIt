export type Category = 'homework' | 'study' | 'test' | 'household' | 'other';

export type Priority = 'high' | 'medium' | 'low';

export type TaskStatus = 'open' | 'in_progress' | 'done';

export interface Task {
  id?: number;
  title: string;
  description?: string;
  category: Category;
  priority: Priority;
  status: TaskStatus;
  dueDate?: Date;
  dueTime?: string;
  subject?: string;
  reminderMinutesBefore?: number;
  reminderFired: boolean;
  createdAt: Date;
  completedAt?: Date;
}

export const CATEGORIES: Category[] = ['homework', 'study', 'test', 'household', 'other'];
export const PRIORITIES: Priority[] = ['high', 'medium', 'low'];
export const TASK_STATUSES: TaskStatus[] = ['open', 'in_progress', 'done'];
