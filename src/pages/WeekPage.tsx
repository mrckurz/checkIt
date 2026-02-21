import { Fragment, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  startOfWeek,
  endOfWeek,
  addWeeks,
  subWeeks,
  eachDayOfInterval,
  isSameDay,
  isToday,
  format,
  isSameWeek,
} from 'date-fns';
import { de, enUS } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../lib/storage/db';
import { getCategoryColor } from '../components/tasks/CategoryBadge';
import { PriorityIndicator } from '../components/tasks/PriorityIndicator';
import { TaskForm } from '../components/tasks/TaskForm';
import { useTaskStore } from '../store/taskStore';
import { completeTask, reopenTask } from '../lib/storage/taskStorage';
import { Check } from 'lucide-react';
import type { Task } from '../types/task';

const HOURS = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

export function WeekPage() {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === 'de' ? de : enUS;
  const [currentWeekStart, setCurrentWeekStart] = useState(
    startOfWeek(new Date(), { weekStartsOn: 1 }),
  );
  const openForm = useTaskStore((s) => s.openForm);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const weekEnd = endOfWeek(currentWeekStart, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: currentWeekStart, end: weekEnd });
  // Show Mon-Fri by default (5 days), optionally Sat-Sun
  const weekDays = days.slice(0, 5);

  const tasks = useLiveQuery(async () => {
    return db.tasks
      .where('dueDate')
      .between(currentWeekStart, weekEnd, true, true)
      .toArray();
  }, [currentWeekStart.toISOString()]) ?? [];

  const getTasksForDayAndHour = (day: Date, hour: number): Task[] => {
    return tasks.filter((task) => {
      if (!task.dueDate || !isSameDay(task.dueDate, day)) return false;
      if (!task.dueTime) return false;
      const taskHour = parseInt(task.dueTime.split(':')[0], 10);
      return taskHour === hour;
    });
  };

  const getUntimed = (day: Date): Task[] => {
    return tasks.filter(
      (task) => task.dueDate && isSameDay(task.dueDate, day) && !task.dueTime,
    );
  };

  const handleToggle = async (task: Task) => {
    if (task.status === 'done') {
      await reopenTask(task.id!);
    } else {
      await completeTask(task.id!);
    }
  };

  const isCurrentWeek = isSameWeek(currentWeekStart, new Date(), { weekStartsOn: 1 });

  return (
    <div className="px-2 py-4">
      {/* Week Navigation */}
      <div className="flex items-center justify-between mb-3 px-2">
        <button
          onClick={() => setCurrentWeekStart(subWeeks(currentWeekStart, 1))}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold">
            {format(currentWeekStart, 'd. MMM', { locale })} – {format(weekEnd, 'd. MMM yyyy', { locale })}
          </h2>
          {!isCurrentWeek && (
            <button
              onClick={() =>
                setCurrentWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }))
              }
              className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium"
            >
              {t('calendar.today')}
            </button>
          )}
        </div>
        <button
          onClick={() => setCurrentWeekStart(addWeeks(currentWeekStart, 1))}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Untimed tasks row */}
      <div className="grid grid-cols-[2.5rem_repeat(5,1fr)] gap-px mb-1">
        <div className="text-[10px] text-gray-400 text-center py-1"></div>
        {weekDays.map((day) => {
          const untimedTasks = getUntimed(day);
          return (
            <div key={day.toISOString()} className="min-h-[1.5rem]">
              {untimedTasks.map((task) => (
                <TaskChip key={task.id} task={task} onToggle={handleToggle} onEdit={openForm} />
              ))}
            </div>
          );
        })}
      </div>

      {/* Week Grid */}
      <div className="overflow-x-auto">
        <div className="grid grid-cols-[2.5rem_repeat(5,1fr)] gap-px min-w-0">
          {/* Day headers */}
          <div />
          {weekDays.map((day) => (
            <div
              key={day.toISOString()}
              className={`text-center py-1.5 rounded-lg ${
                isToday(day)
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 dark:bg-gray-800'
              }`}
            >
              <div className="text-[10px] font-medium uppercase">
                {format(day, 'EEE', { locale })}
              </div>
              <div className="text-sm font-bold">{format(day, 'd')}</div>
            </div>
          ))}

          {/* Hour rows */}
          {HOURS.map((hour) => (
            <Fragment key={hour}>
              {/* Time label */}
              <div
                className="text-[10px] text-gray-400 dark:text-gray-500 text-right pr-1 pt-0.5"
              >
                {hour}:00
              </div>
              {/* Day cells */}
              {weekDays.map((day) => {
                const cellTasks = getTasksForDayAndHour(day, hour);
                return (
                  <div
                    key={`${day.toISOString()}-${hour}`}
                    className="min-h-[2.5rem] border-t border-gray-100 dark:border-gray-800 relative"
                    onClick={() => {
                      setSelectedDate(day);
                      openForm();
                    }}
                  >
                    {cellTasks.map((task) => (
                      <TaskChip
                        key={task.id}
                        task={task}
                        onToggle={handleToggle}
                        onEdit={openForm}
                      />
                    ))}
                  </div>
                );
              })}
            </Fragment>
          ))}
        </div>
      </div>

      {/* FAB */}
      <button
        onClick={() => openForm()}
        className="fixed right-4 w-14 h-14 rounded-full bg-primary hover:bg-primary-dark text-white shadow-lg flex items-center justify-center transition-all hover:scale-105 active:scale-95 z-40"
        style={{ bottom: 'calc(4.5rem + env(safe-area-inset-bottom, 0))' }}
      >
        <Plus className="w-6 h-6" />
      </button>

      <TaskForm preselectedDate={selectedDate} />
    </div>
  );
}

function TaskChip({
  task,
  onToggle,
  onEdit,
}: {
  task: Task;
  onToggle: (t: Task) => void;
  onEdit: (id?: number) => void;
}) {
  const isDone = task.status === 'done';
  return (
    <div
      className={`flex items-center gap-1 px-1 py-0.5 rounded text-[10px] leading-tight mb-0.5 cursor-pointer ${
        isDone ? 'opacity-50' : ''
      }`}
      style={{ backgroundColor: getCategoryColor(task.category) + '22', borderLeft: `2px solid ${getCategoryColor(task.category)}` }}
      onClick={(e) => {
        e.stopPropagation();
        onEdit(task.id!);
      }}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggle(task);
        }}
        className={`flex-shrink-0 w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
          isDone
            ? 'bg-primary border-primary text-white'
            : 'border-gray-300 dark:border-gray-500'
        }`}
      >
        {isDone && <Check className="w-2 h-2" />}
      </button>
      <span className={`truncate font-medium ${isDone ? 'line-through' : ''}`}>
        {task.title}
      </span>
      <PriorityIndicator priority={task.priority} />
    </div>
  );
}
