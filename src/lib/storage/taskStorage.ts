import { db } from './db';
import type { Task, TaskStatus } from '../../types/task';

export async function createTask(task: Omit<Task, 'id'>): Promise<number> {
  return db.tasks.add(task as Task);
}

export async function updateTask(id: number, changes: Partial<Task>): Promise<void> {
  await db.tasks.update(id, changes);
}

export async function deleteTask(id: number): Promise<void> {
  await db.tasks.delete(id);
}

export async function getTask(id: number): Promise<Task | undefined> {
  return db.tasks.get(id);
}

export async function getTasksByDateRange(start: Date, end: Date): Promise<Task[]> {
  return db.tasks
    .where('dueDate')
    .between(start, end, true, true)
    .toArray();
}

export async function getTasksByStatus(status: TaskStatus): Promise<Task[]> {
  return db.tasks.where('status').equals(status).toArray();
}

export async function getAllTasks(): Promise<Task[]> {
  return db.tasks.orderBy('createdAt').reverse().toArray();
}

export async function completeTask(id: number): Promise<void> {
  await db.tasks.update(id, { status: 'done', completedAt: new Date() });
}

export async function reopenTask(id: number): Promise<void> {
  await db.tasks.update(id, { status: 'open', completedAt: undefined });
}

export async function clearAllTasks(): Promise<void> {
  await db.tasks.clear();
}
