import Dexie, { type Table } from 'dexie';
import type { Task } from '../../types/task';

class CheckItDB extends Dexie {
  tasks!: Table<Task>;

  constructor() {
    super('checkit-db');
    this.version(1).stores({
      tasks: '++id, category, priority, status, dueDate, createdAt',
    });
  }
}

export const db = new CheckItDB();
