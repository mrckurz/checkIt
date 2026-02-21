import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  Bell,
  Sun,
  Moon,
  Monitor,
  Trash2,
  ChevronRight,
  FileText,
  Github,
} from 'lucide-react';
import { useSettings } from '../hooks/useSettings';
import { useNotifications } from '../hooks/useNotifications';
import { clearAllTasks } from '../lib/storage/taskStorage';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { CATEGORIES, PRIORITIES, type Category, type Priority } from '../types/task';

export function SettingsPage() {
  const { t, i18n } = useTranslation();
  const { settings, updateSettings } = useSettings();
  const { permission, requestPermission } = useNotifications();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleNotificationToggle = async () => {
    if (permission === 'granted') {
      updateSettings({ notificationsEnabled: !settings.notificationsEnabled });
    } else {
      const granted = await requestPermission();
      if (granted) {
        updateSettings({ notificationsEnabled: true });
      }
    }
  };

  const handleTheme = (theme: 'light' | 'dark' | 'system') => {
    updateSettings({ theme });
  };

  const handleLanguage = (lang: 'de' | 'en') => {
    updateSettings({ language: lang });
    i18n.changeLanguage(lang);
    localStorage.setItem('checkit-language', lang);
  };

  const handleDeleteAll = async () => {
    await clearAllTasks();
    setShowDeleteConfirm(false);
  };

  return (
    <div className="px-4 py-5 space-y-6">
      <h1 className="text-2xl font-bold">{t('settings.title')}</h1>

      {/* Notifications */}
      <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
        <button
          onClick={handleNotificationToggle}
          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-750"
        >
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
            <Bell className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 text-left">
            <p className="text-sm font-medium">{t('settings.notifications')}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {t('settings.notificationsDesc')}
            </p>
          </div>
          <div
            className={`w-11 h-6 rounded-full transition-colors flex items-center px-0.5 ${
              settings.notificationsEnabled && permission === 'granted'
                ? 'bg-primary'
                : 'bg-gray-300 dark:bg-gray-600'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                settings.notificationsEnabled && permission === 'granted'
                  ? 'translate-x-5'
                  : 'translate-x-0'
              }`}
            />
          </div>
        </button>
      </section>

      {/* Theme */}
      <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-4">
        <p className="text-sm font-medium mb-3">{t('settings.theme')}</p>
        <div className="flex gap-2">
          {([
            { value: 'light', icon: Sun, label: t('theme.light') },
            { value: 'dark', icon: Moon, label: t('theme.dark') },
            { value: 'system', icon: Monitor, label: t('theme.system') },
          ] as const).map(({ value, icon: Icon, label }) => (
            <button
              key={value}
              onClick={() => handleTheme(value)}
              className={`flex-1 flex flex-col items-center gap-1.5 py-2.5 rounded-lg border text-xs font-medium transition-all ${
                settings.theme === value
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'border-gray-200 dark:border-gray-700 text-gray-500 hover:border-gray-300'
              }`}
            >
              <Icon className="w-5 h-5" />
              {label}
            </button>
          ))}
        </div>
      </section>

      {/* Language */}
      <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-4">
        <p className="text-sm font-medium mb-3">{t('settings.language')}</p>
        <div className="flex gap-2">
          {([
            { value: 'de', label: 'Deutsch', flag: '🇦🇹' },
            { value: 'en', label: 'English', flag: '🇬🇧' },
          ] as const).map(({ value, label, flag }) => (
            <button
              key={value}
              onClick={() => handleLanguage(value)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border text-xs font-medium transition-all ${
                settings.language === value
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'border-gray-200 dark:border-gray-700 text-gray-500 hover:border-gray-300'
              }`}
            >
              <span className="text-base">{flag}</span>
              {label}
            </button>
          ))}
        </div>
      </section>

      {/* Defaults */}
      <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-4 space-y-4">
        <div>
          <p className="text-sm font-medium mb-2">{t('settings.defaultCategory')}</p>
          <select
            value={settings.defaultCategory}
            onChange={(e) =>
              updateSettings({ defaultCategory: e.target.value as Category })
            }
            className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {t(`category.${cat}`)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <p className="text-sm font-medium mb-2">{t('settings.defaultPriority')}</p>
          <select
            value={settings.defaultPriority}
            onChange={(e) =>
              updateSettings({ defaultPriority: e.target.value as Priority })
            }
            className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm"
          >
            {PRIORITIES.map((pri) => (
              <option key={pri} value={pri}>
                {t(`priority.${pri}`)}
              </option>
            ))}
          </select>
        </div>
      </section>

      {/* Links */}
      <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden divide-y divide-gray-100 dark:divide-gray-700">
        <Link
          to="/impressum"
          className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-750"
        >
          <FileText className="w-5 h-5 text-gray-400" />
          <span className="flex-1 text-sm">{t('settings.impressum')}</span>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </Link>
        <a
          href="https://github.com/mrckurz/checkIt"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-750"
        >
          <Github className="w-5 h-5 text-gray-400" />
          <span className="flex-1 text-sm">{t('settings.github')}</span>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </a>
      </section>

      {/* Danger Zone */}
      <section className="bg-white dark:bg-gray-800 rounded-xl border border-red-200 dark:border-red-900/50 overflow-hidden">
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 dark:hover:bg-red-900/10"
        >
          <Trash2 className="w-5 h-5 text-red-500" />
          <span className="text-sm text-red-600 dark:text-red-400 font-medium">
            {t('settings.deleteAll')}
          </span>
        </button>
      </section>

      {/* Version */}
      <p className="text-center text-xs text-gray-400 dark:text-gray-600">
        {t('settings.version', { version: '1.0.0' })}
      </p>

      <ConfirmDialog
        open={showDeleteConfirm}
        title={t('settings.deleteAll')}
        message={t('settings.deleteAllConfirm')}
        confirmLabel={t('settings.deleteAll')}
        danger
        onConfirm={handleDeleteAll}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </div>
  );
}
