import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { de, enUS } from 'date-fns/locale';
import { Plus, ListTodo } from 'lucide-react';
import { useTaskStats, useOverdueTasks, useTodayTasks, useUpcomingTasks } from '../hooks/useTasks';
import { useTaskStore } from '../store/taskStore';
import { TaskList } from '../components/tasks/TaskList';
import { TaskForm } from '../components/tasks/TaskForm';
import { EmptyState } from '../components/common/EmptyState';

export function DashboardPage() {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === 'de' ? de : enUS;
  const openForm = useTaskStore((s) => s.openForm);

  const stats = useTaskStats();
  const overdueTasks = useOverdueTasks() ?? [];
  const todayTasks = useTodayTasks() ?? [];
  const upcomingTasks = useUpcomingTasks(7) ?? [];

  const todayDate = format(new Date(), 'EEEE, d. MMMM yyyy', { locale });

  const hasAnyTasks = (stats?.total ?? 0) > 0;
  const allDone = hasAnyTasks && (stats?.open ?? 0) === 0;

  return (
    <div className="px-4 py-5 space-y-6">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-bold">{t('dashboard.greeting')}</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
          {todayDate}
        </p>
      </div>

      {/* Stats */}
      {hasAnyTasks && (
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-3 text-center border border-gray-100 dark:border-gray-700">
            <p className="text-2xl font-bold text-primary">{stats?.open ?? 0}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {t('dashboard.open')}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-3 text-center border border-gray-100 dark:border-gray-700">
            <p className={`text-2xl font-bold ${(stats?.overdue ?? 0) > 0 ? 'text-red-500' : 'text-gray-300 dark:text-gray-600'}`}>
              {stats?.overdue ?? 0}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {t('dashboard.overdue')}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-3 text-center border border-gray-100 dark:border-gray-700">
            <p className="text-2xl font-bold text-emerald-500">
              {stats?.doneToday ?? 0}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {t('dashboard.doneToday')}
            </p>
          </div>
        </div>
      )}

      {/* All Done State */}
      {allDone && (
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-6 text-center">
          <p className="text-4xl mb-2">&#127881;</p>
          <p className="font-semibold text-primary">{t('dashboard.allDone')}</p>
        </div>
      )}

      {/* No Tasks State */}
      {!hasAnyTasks && (
        <EmptyState
          icon={ListTodo}
          message={t('dashboard.noTasks')}
          action={
            <button
              onClick={() => openForm()}
              className="px-4 py-2 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary-dark"
            >
              {t('task.newTask')}
            </button>
          }
        />
      )}

      {/* Overdue */}
      {overdueTasks.length > 0 && (
        <TaskList tasks={overdueTasks} title={t('dashboard.overdueSection')} />
      )}

      {/* Today */}
      {todayTasks.length > 0 && (
        <TaskList tasks={todayTasks} title={t('dashboard.todaySection')} />
      )}

      {/* Upcoming */}
      {upcomingTasks.length > 0 && (
        <TaskList tasks={upcomingTasks} title={t('dashboard.upcomingSection')} />
      )}

      {/* FAB */}
      <button
        onClick={() => openForm()}
        className="fixed right-4 w-14 h-14 rounded-full bg-primary hover:bg-primary-dark text-white shadow-lg flex items-center justify-center transition-all hover:scale-105 active:scale-95 z-40"
        style={{ bottom: 'calc(4.5rem + env(safe-area-inset-bottom, 0))' }}
      >
        <Plus className="w-6 h-6" />
      </button>

      <TaskForm />
    </div>
  );
}
