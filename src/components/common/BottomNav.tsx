import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ListTodo, Calendar, Menu } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const tabs = [
  { path: '/', icon: LayoutDashboard, labelKey: 'nav.dashboard' },
  { path: '/tasks', icon: ListTodo, labelKey: 'nav.tasks' },
  { path: '/calendar', icon: Calendar, labelKey: 'nav.calendar' },
  { path: '/settings', icon: Menu, labelKey: 'nav.settings' },
] as const;

export function BottomNav() {
  const { t } = useTranslation();

  return (
    <nav className="bottom-nav fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-50 flex justify-around items-center h-16">
      {tabs.map((tab) => (
        <NavLink
          key={tab.path}
          to={tab.path}
          end={tab.path === '/'}
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              isActive
                ? 'text-primary'
                : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
            }`
          }
        >
          <tab.icon className="w-5 h-5" />
          <span>{t(tab.labelKey)}</span>
        </NavLink>
      ))}
    </nav>
  );
}
