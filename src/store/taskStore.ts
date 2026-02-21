import { create } from 'zustand';
import type { Category, Priority, TaskStatus } from '../types/task';

interface TaskStoreState {
  filterCategory: Category | 'all';
  filterPriority: Priority | 'all';
  filterStatus: TaskStatus | 'all';
  searchQuery: string;
  isFormOpen: boolean;
  editingTaskId: number | null;
  selectedDate: Date | null;

  setFilterCategory: (cat: Category | 'all') => void;
  setFilterPriority: (pri: Priority | 'all') => void;
  setFilterStatus: (status: TaskStatus | 'all') => void;
  setSearchQuery: (query: string) => void;
  openForm: (editId?: number) => void;
  closeForm: () => void;
  setSelectedDate: (date: Date | null) => void;
}

export const useTaskStore = create<TaskStoreState>((set) => ({
  filterCategory: 'all',
  filterPriority: 'all',
  filterStatus: 'all',
  searchQuery: '',
  isFormOpen: false,
  editingTaskId: null,
  selectedDate: null,

  setFilterCategory: (filterCategory) => set({ filterCategory }),
  setFilterPriority: (filterPriority) => set({ filterPriority }),
  setFilterStatus: (filterStatus) => set({ filterStatus }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  openForm: (editId) => set({ isFormOpen: true, editingTaskId: editId ?? null }),
  closeForm: () => set({ isFormOpen: false, editingTaskId: null }),
  setSelectedDate: (selectedDate) => set({ selectedDate }),
}));
