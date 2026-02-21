import 'fake-indexeddb/auto';
import { describe, it, expect, beforeEach } from 'vitest';
import { db } from '../db';
import {
  createTask,
  getAllTasks,
  updateTask,
  deleteTask,
  completeTask,
  reopenTask,
  getTask,
  clearAllTasks,
} from '../taskStorage';
import type { Task } from '../../../types/task';

function makeSampleTask(overrides?: Partial<Omit<Task, 'id'>>): Omit<Task, 'id'> {
  return {
    title: 'Mathe Hausübung',
    category: 'homework',
    priority: 'high',
    status: 'open',
    reminderFired: false,
    createdAt: new Date(),
    ...overrides,
  };
}

beforeEach(async () => {
  await db.delete();
  await db.open();
});

describe('taskStorage', () => {
  it('creates and retrieves a task', async () => {
    const id = await createTask(makeSampleTask());
    const tasks = await getAllTasks();
    expect(tasks).toHaveLength(1);
    expect(tasks[0].title).toBe('Mathe Hausübung');
    expect(tasks[0].id).toBe(id);
  });

  it('retrieves a single task by id', async () => {
    const id = await createTask(makeSampleTask());
    const task = await getTask(id);
    expect(task).toBeDefined();
    expect(task!.title).toBe('Mathe Hausübung');
  });

  it('updates a task', async () => {
    const id = await createTask(makeSampleTask());
    await updateTask(id, { title: 'Deutsch Hausübung' });
    const task = await getTask(id);
    expect(task!.title).toBe('Deutsch Hausübung');
  });

  it('completes a task', async () => {
    const id = await createTask(makeSampleTask());
    await completeTask(id);
    const task = await getTask(id);
    expect(task!.status).toBe('done');
    expect(task!.completedAt).toBeDefined();
  });

  it('reopens a task', async () => {
    const id = await createTask(makeSampleTask());
    await completeTask(id);
    await reopenTask(id);
    const task = await getTask(id);
    expect(task!.status).toBe('open');
    expect(task!.completedAt).toBeUndefined();
  });

  it('deletes a task', async () => {
    const id = await createTask(makeSampleTask());
    await deleteTask(id);
    const tasks = await getAllTasks();
    expect(tasks).toHaveLength(0);
  });

  it('clears all tasks', async () => {
    await createTask(makeSampleTask({ createdAt: new Date('2026-01-01') }));
    await createTask(
      makeSampleTask({ title: 'Englisch Hausübung', createdAt: new Date('2026-01-02') }),
    );
    await clearAllTasks();
    const tasks = await getAllTasks();
    expect(tasks).toHaveLength(0);
  });

  it('creates multiple tasks and retrieves them in order', async () => {
    await createTask(makeSampleTask({ title: 'First', createdAt: new Date('2026-01-01') }));
    await createTask(makeSampleTask({ title: 'Second', createdAt: new Date('2026-01-02') }));
    const tasks = await getAllTasks();
    expect(tasks).toHaveLength(2);
    expect(tasks[0].title).toBe('Second');
    expect(tasks[1].title).toBe('First');
  });
});
