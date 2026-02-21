import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ListTodo, CalendarRange, Calendar, Menu } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const tabs = [
  { path: '/', icon: LayoutDashboard, labelKey: 'nav.dashboard' },
  { path: '/tasks', icon: ListTodo, labelKey: 'nav.tasks' },
  { path: '/week', icon: CalendarRange, labelKey: 'nav.week' },
  { path: '/calendar', icon: Calendar, labelKey: 'nav.calendar' },
  { path: '/settings', icon: Menu, labelKey: 'nav.settings' },
] as const;

export function BottomNav() {
  const { t } = useTranslation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-50 flex justify-around items-center pt-2 pb-2" style={{ paddingBottom: 'calc(0.5rem + env(safe-area-inset-bottom, 0))' }}>
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
