import type { AppSettings } from '../../types/settings';

const SETTINGS_KEY = 'checkit-settings';

const defaults: AppSettings = {
  theme: 'system',
  language: 'de',
  notificationsEnabled: false,
  defaultCategory: 'homework',
  defaultPriority: 'medium',
};

export function loadSettings(): AppSettings {
  const raw = localStorage.getItem(SETTINGS_KEY);
  if (!raw) return defaults;
  return { ...defaults, ...JSON.parse(raw) };
}

export function saveSettings(settings: AppSettings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}
