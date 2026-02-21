import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { de, enUS } from 'date-fns/locale';
import { useTasksForDay } from '../../hooks/useTasks';
import { TaskList } from '../tasks/TaskList';
import { EmptyState } from '../common/EmptyState';
import { CalendarOff } from 'lucide-react';

interface DayDetailProps {
  date: Date | null;
}

export function DayDetail({ date }: DayDetailProps) {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === 'de' ? de : enUS;
  const tasks = useTasksForDay(date) ?? [];

  if (!date) return null;

  const dateLabel = format(date, 'EEEE, d. MMMM', { locale });

  return (
    <div className="mt-4">
      <h3 className="text-sm font-semibold mb-3 px-1 capitalize">{dateLabel}</h3>
      {tasks.length > 0 ? (
        <TaskList tasks={tasks} />
      ) : (
        <EmptyState icon={CalendarOff} message={t('calendar.noTasks')} />
      )}
    </div>
  );
}
