import type { Category, Priority } from './task';

export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  language: 'de' | 'en';
  notificationsEnabled: boolean;
  defaultCategory: Category;
  defaultPriority: Priority;
}
