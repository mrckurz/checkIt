import { useTranslation } from 'react-i18next';
import { Plus, Search, ListTodo } from 'lucide-react';
import { useTaskStore } from '../store/taskStore';
import { useAllTasks } from '../hooks/useTasks';
import { TaskList } from '../components/tasks/TaskList';
import { TaskForm } from '../components/tasks/TaskForm';
import { EmptyState } from '../components/common/EmptyState';
import { CATEGORIES, type Category } from '../types/task';

export function TasksPage() {
  const { t } = useTranslation();
  const {
    filterCategory,
    filterStatus,
    searchQuery,
    setFilterCategory,
    setFilterStatus,
    setSearchQuery,
    openForm,
  } = useTaskStore();

  const tasks =
    useAllTasks({
      category: filterCategory,
      status: filterStatus,
      search: searchQuery,
    }) ?? [];

  const statusFilters = ['all', 'open', 'in_progress', 'done'] as const;

  return (
    <div className="px-4 py-5 space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t('task.titlePlaceholder')}
          className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
        />
      </div>

      {/* Status Filter */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {statusFilters.map((s) => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
              filterStatus === s
                ? 'bg-primary text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {t(`status.${s}`)}
          </button>
        ))}
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setFilterCategory('all')}
          className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
            filterCategory === 'all'
              ? 'bg-primary text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          {t('category.all')}
        </button>
        {CATEGORIES.map((cat: Category) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
              filterCategory === cat
                ? 'bg-primary text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {t(`category.${cat}`)}
          </button>
        ))}
      </div>

      {/* Task List */}
      {tasks.length > 0 ? (
        <TaskList tasks={tasks} />
      ) : (
        <EmptyState icon={ListTodo} message={t('dashboard.noTasks')} />
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
