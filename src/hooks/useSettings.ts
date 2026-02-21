import { useState, useCallback, useEffect } from 'react';
import { loadSettings, saveSettings } from '../lib/storage/settingsStorage';
import type { AppSettings } from '../types/settings';

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(loadSettings);

  const updateSettings = useCallback((changes: Partial<AppSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...changes };
      saveSettings(next);
      return next;
    });
  }, []);

  // Apply theme
  useEffect(() => {
    const applyTheme = () => {
      const isDark =
        settings.theme === 'dark' ||
        (settings.theme === 'system' &&
          window.matchMedia('(prefers-color-scheme: dark)').matches);
      document.documentElement.classList.toggle('dark', isDark);
      localStorage.setItem('checkit-theme', isDark ? 'dark' : 'light');
    };

    applyTheme();

    if (settings.theme === 'system') {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      mq.addEventListener('change', applyTheme);
      return () => mq.removeEventListener('change', applyTheme);
    }
  }, [settings.theme]);

  return { settings, updateSettings };
}
