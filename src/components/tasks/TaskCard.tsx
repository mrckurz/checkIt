import { useTranslation } from 'react-i18next';
import { format, isPast, isToday, isTomorrow, startOfDay } from 'date-fns';
import { de, enUS } from 'date-fns/locale';
import { Check, Pencil, Trash2, RotateCcw } from 'lucide-react';
import { CategoryBadge } from './CategoryBadge';
import { PriorityIndicator } from './PriorityIndicator';
import { completeTask, reopenTask, deleteTask } from '../../lib/storage/taskStorage';
import { useTaskStore } from '../../store/taskStore';
import { useState } from 'react';
import { ConfirmDialog } from '../common/ConfirmDialog';
import type { Task } from '../../types/task';

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  const { t, i18n } = useTranslation();
  const openForm = useTaskStore((s) => s.openForm);
  const [showDelete, setShowDelete] = useState(false);
  const isDone = task.status === 'done';
  const locale = i18n.language === 'de' ? de : enUS;

  const isOverdue =
    !isDone && task.dueDate && isPast(startOfDay(task.dueDate)) && !isToday(task.dueDate);

  const getDueDateLabel = () => {
    if (!task.dueDate) return null;
    if (isToday(task.dueDate)) return t('task.dueToday');
    if (isTomorrow(task.dueDate)) return t('task.dueTomorrow');
    return format(task.dueDate, 'd. MMM', { locale });
  };

  const handleToggle = async () => {
    if (isDone) {
      await reopenTask(task.id!);
    } else {
      await completeTask(task.id!);
    }
  };

  return (
    <>
      <div
        className={`bg-white dark:bg-gray-800 rounded-xl p-3 shadow-sm border transition-all ${
          isOverdue
            ? 'border-red-300 dark:border-red-800'
            : 'border-gray-100 dark:border-gray-700'
        } ${isDone ? 'opacity-60' : ''}`}
      >
        <div className="flex items-start gap-3">
          {/* Checkbox */}
          <button
            onClick={handleToggle}
            className={`mt-0.5 flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
              isDone
                ? 'bg-primary border-primary text-white'
                : 'border-gray-300 dark:border-gray-600 hover:border-primary'
            }`}
          >
            {isDone && <Check className="w-3.5 h-3.5" />}
          </button>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span
                className={`font-medium text-sm ${
                  isDone ? 'line-through text-gray-400' : ''
                }`}
              >
                {task.title}
              </span>
              <PriorityIndicator priority={task.priority} />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <CategoryBadge category={task.category} />
              {task.subject && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {task.subject}
                </span>
              )}
              {task.dueDate && (
                <span
                  className={`text-xs font-medium ${
                    isOverdue
                      ? 'text-red-600 dark:text-red-400'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {isOverdue && `${t('task.overdue')} · `}
                  {getDueDateLabel()}
                  {task.dueTime && ` · ${task.dueTime}`}
                </span>
              )}
            </div>

            {task.description && (
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 line-clamp-2">
                {task.description}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 flex-shrink-0">
            {isDone ? (
              <button
                onClick={handleToggle}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400"
                title={t('status.open')}
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => openForm(task.id!)}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400"
                title={t('task.edit')}
              >
                <Pencil className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => setShowDelete(true)}
              className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500"
              title={t('task.delete')}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={showDelete}
        title={t('task.delete')}
        message={t('task.confirmDelete')}
        confirmLabel={t('task.delete')}
        danger
        onConfirm={async () => {
          await deleteTask(task.id!);
          setShowDelete(false);
        }}
        onCancel={() => setShowDelete(false)}
      />
    </>
  );
}
