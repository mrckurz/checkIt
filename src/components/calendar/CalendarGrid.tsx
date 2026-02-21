import { useTranslation } from 'react-i18next';
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  format,
  addMonths,
  subMonths,
} from 'date-fns';
import { de, enUS } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { CalendarDay } from './CalendarDay';
import { useTasksForMonth } from '../../hooks/useTasks';
import type { Task } from '../../types/task';

interface CalendarGridProps {
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
}

export function CalendarGrid({ selectedDate, onSelectDate }: CalendarGridProps) {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === 'de' ? de : enUS;
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const tasks = useTasksForMonth(currentMonth.getFullYear(), currentMonth.getMonth()) ?? [];

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: calStart, end: calEnd });

  const weekDays = [
    t('calendar.mon'),
    t('calendar.tue'),
    t('calendar.wed'),
    t('calendar.thu'),
    t('calendar.fri'),
    t('calendar.sat'),
    t('calendar.sun'),
  ];

  const getTasksForDay = (day: Date): Task[] =>
    tasks.filter((task) => task.dueDate && isSameDay(task.dueDate, day));

  return (
    <div>
      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-4 px-1">
        <button
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold capitalize">
            {format(currentMonth, 'MMMM yyyy', { locale })}
          </h2>
          {!isSameMonth(currentMonth, new Date()) && (
            <button
              onClick={() => setCurrentMonth(new Date())}
              className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium"
            >
              {t('calendar.today')}
            </button>
          )}
        </div>
        <button
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 mb-1">
        {weekDays.map((day) => (
          <div
            key={day}
            className="text-center text-xs font-medium text-gray-400 dark:text-gray-500 py-1"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Day Grid */}
      <div className="grid grid-cols-7 gap-0.5">
        {days.map((day) => (
          <CalendarDay
            key={day.toISOString()}
            date={day}
            isCurrentMonth={isSameMonth(day, currentMonth)}
            isToday={isToday(day)}
            isSelected={selectedDate ? isSameDay(day, selectedDate) : false}
            tasks={getTasksForDay(day)}
            onClick={() => onSelectDate(day)}
          />
        ))}
      </div>
    </div>
  );
}
