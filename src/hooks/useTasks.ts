import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../lib/storage/db';
import { startOfDay, endOfDay, startOfMonth, endOfMonth } from 'date-fns';
import type { Category, Priority, TaskStatus } from '../types/task';

export function useAllTasks(filters?: {
  category?: Category | 'all';
  priority?: Priority | 'all';
  status?: TaskStatus | 'all';
  search?: string;
}) {
  return useLiveQuery(async () => {
    let results = await db.tasks.orderBy('createdAt').reverse().toArray();

    if (filters?.category && filters.category !== 'all') {
      results = results.filter((t) => t.category === filters.category);
    }
    if (filters?.priority && filters.priority !== 'all') {
      results = results.filter((t) => t.priority === filters.priority);
    }
    if (filters?.status && filters.status !== 'all') {
      results = results.filter((t) => t.status === filters.status);
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      results = results.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description?.toLowerCase().includes(q) ||
          t.subject?.toLowerCase().includes(q),
      );
    }
    return results;
  }, [filters?.category, filters?.priority, filters?.status, filters?.search]);
}

export function useTasksForMonth(year: number, month: number) {
  return useLiveQuery(async () => {
    const start = startOfMonth(new Date(year, month));
    const end = endOfMonth(new Date(year, month));
    return db.tasks
      .where('dueDate')
      .between(start, end, true, true)
      .toArray();
  }, [year, month]);
}

export function useTasksForDay(date: Date | null) {
  return useLiveQuery(async () => {
    if (!date) return [];
    return db.tasks
      .where('dueDate')
      .between(startOfDay(date), endOfDay(date), true, true)
      .toArray();
  }, [date?.toISOString()]);
}

export function useOverdueTasks() {
  return useLiveQuery(async () => {
    const now = startOfDay(new Date());
    return db.tasks
      .where('dueDate')
      .below(now)
      .filter((t) => t.status !== 'done')
      .toArray();
  });
}

export function useUpcomingTasks(days: number = 7) {
  return useLiveQuery(async () => {
    const now = startOfDay(new Date());
    const future = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
    return db.tasks
      .where('dueDate')
      .between(now, future, true, true)
      .filter((t) => t.status !== 'done')
      .toArray();
  }, [days]);
}

export function useTodayTasks() {
  return useLiveQuery(async () => {
    const now = new Date();
    return db.tasks
      .where('dueDate')
      .between(startOfDay(now), endOfDay(now), true, true)
      .filter((t) => t.status !== 'done')
      .toArray();
  });
}

export function useTaskStats() {
  return useLiveQuery(async () => {
    const all = await db.tasks.toArray();
    const now = startOfDay(new Date());
    const todayEnd = endOfDay(new Date());
    return {
      total: all.length,
      open: all.filter((t) => t.status !== 'done').length,
      overdue: all.filter(
        (t) => t.status !== 'done' && t.dueDate && t.dueDate < now,
      ).length,
      doneToday: all.filter(
        (t) =>
          t.status === 'done' &&
          t.completedAt &&
          t.completedAt >= now &&
          t.completedAt <= todayEnd,
      ).length,
    };
  });
}
