import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';
import { useTaskStore } from '../../store/taskStore';
import { createTask, updateTask, getTask } from '../../lib/storage/taskStorage';
import { useSettings } from '../../hooks/useSettings';
import { CATEGORIES, PRIORITIES, type Category, type Priority, type TaskStatus } from '../../types/task';
import { CategoryBadge } from './CategoryBadge';
import { format } from 'date-fns';

interface TaskFormProps {
  preselectedDate?: Date | null;
}

export function TaskForm({ preselectedDate }: TaskFormProps) {
  const { t } = useTranslation();
  const { isFormOpen, editingTaskId, closeForm } = useTaskStore();
  const { settings } = useSettings();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category>(settings.defaultCategory);
  const [priority, setPriority] = useState<Priority>(settings.defaultPriority);
  const [status, setStatus] = useState<TaskStatus>('open');
  const [subject, setSubject] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');
  const [reminderMinutes, setReminderMinutes] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (!isFormOpen) return;

    if (editingTaskId) {
      getTask(editingTaskId).then((task) => {
        if (!task) return;
        setTitle(task.title);
        setDescription(task.description ?? '');
        setCategory(task.category);
        setPriority(task.priority);
        setStatus(task.status);
        setSubject(task.subject ?? '');
        setDueDate(task.dueDate ? format(task.dueDate, 'yyyy-MM-dd') : '');
        setDueTime(task.dueTime ?? '');
        setReminderMinutes(task.reminderMinutesBefore);
      });
    } else {
      setTitle('');
      setDescription('');
      setCategory(settings.defaultCategory);
      setPriority(settings.defaultPriority);
      setStatus('open');
      setSubject('');
      setDueDate(preselectedDate ? format(preselectedDate, 'yyyy-MM-dd') : '');
      setDueTime('');
      setReminderMinutes(undefined);
    }
  }, [isFormOpen, editingTaskId, preselectedDate, settings.defaultCategory, settings.defaultPriority]);

  if (!isFormOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const taskData = {
      title: title.trim(),
      description: description.trim() || undefined,
      category,
      priority,
      status,
      subject: subject.trim() || undefined,
      dueDate: dueDate ? new Date(dueDate + 'T00:00:00') : undefined,
      dueTime: dueTime || undefined,
      reminderMinutesBefore: reminderMinutes,
      reminderFired: false,
      createdAt: new Date(),
    };

    if (editingTaskId) {
      await updateTask(editingTaskId, taskData);
    } else {
      await createTask(taskData);
    }
    closeForm();
  };

  const priorityColors: Record<Priority, string> = {
    high: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800',
    medium:
      'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800',
    low: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800',
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={closeForm} />
      <div className="relative bg-white dark:bg-gray-800 rounded-t-2xl sm:rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 px-4 py-3 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-lg font-semibold">
            {editingTaskId ? t('task.edit') : t('task.newTask')}
          </h2>
          <button
            onClick={closeForm}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Title */}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t('task.titlePlaceholder')}
            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            autoFocus
          />

          {/* Description */}
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t('task.descriptionPlaceholder')}
            rows={2}
            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary resize-none"
          />

          {/* Category */}
          <div>
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 block">
              {t('task.category')}
            </label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`transition-all rounded-full ${
                    category === cat
                      ? 'ring-2 ring-primary ring-offset-1 dark:ring-offset-gray-800'
                      : 'opacity-60 hover:opacity-100'
                  }`}
                >
                  <CategoryBadge category={cat} />
                </button>
              ))}
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 block">
              {t('task.priority')}
            </label>
            <div className="flex gap-2">
              {PRIORITIES.map((pri) => (
                <button
                  key={pri}
                  type="button"
                  onClick={() => setPriority(pri)}
                  className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                    priorityColors[pri]
                  } ${
                    priority === pri
                      ? 'ring-2 ring-primary ring-offset-1 dark:ring-offset-gray-800'
                      : 'opacity-50 hover:opacity-100'
                  }`}
                >
                  {t(`priority.${pri}`)}
                </button>
              ))}
            </div>
          </div>

          {/* Subject */}
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder={t('task.subjectPlaceholder')}
            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
          />

          {/* Date & Time */}
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 block">
                {t('task.dueDate')}
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
              />
            </div>
            <div className="w-28">
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 block">
                {t('task.dueTime')}
              </label>
              <input
                type="time"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
              />
            </div>
          </div>

          {/* Reminder */}
          <div>
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 block">
              {t('task.reminder')}
            </label>
            <select
              value={reminderMinutes ?? ''}
              onChange={(e) =>
                setReminderMinutes(
                  e.target.value ? Number(e.target.value) : undefined,
                )
              }
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            >
              <option value="">{t('task.reminderNone')}</option>
              <option value="15">{t('task.reminder15')}</option>
              <option value="30">{t('task.reminder30')}</option>
              <option value="60">{t('task.reminder60')}</option>
              <option value="1440">{t('task.reminder1440')}</option>
            </select>
          </div>

          {/* Status (only when editing) */}
          {editingTaskId && (
            <div>
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 block">
                {t('task.status')}
              </label>
              <div className="flex gap-2">
                {(['open', 'in_progress', 'done'] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStatus(s)}
                    className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                      status === s
                        ? 'bg-primary text-white border-primary'
                        : 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 hover:border-primary'
                    }`}
                  >
                    {t(`status.${s}`)}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={!title.trim()}
            className="w-full py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {editingTaskId ? t('task.save') : t('task.create')}
          </button>
        </form>
      </div>
    </div>
  );
}
