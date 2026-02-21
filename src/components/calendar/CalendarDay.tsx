import { format } from 'date-fns';
import { getCategoryColor } from '../tasks/CategoryBadge';
import type { Task } from '../../types/task';

interface CalendarDayProps {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  tasks: Task[];
  onClick: () => void;
}

export function CalendarDay({
  date,
  isCurrentMonth,
  isToday,
  isSelected,
  tasks,
  onClick,
}: CalendarDayProps) {
  const openTasks = tasks.filter((t) => t.status !== 'done');
  const maxDots = 4;

  return (
    <button
      onClick={onClick}
      className={`relative flex flex-col items-center py-1.5 rounded-lg transition-all min-h-[3rem] ${
        !isCurrentMonth
          ? 'text-gray-300 dark:text-gray-600'
          : isSelected
            ? 'bg-primary text-white'
            : isToday
              ? 'bg-primary/10 text-primary font-semibold'
              : 'hover:bg-gray-100 dark:hover:bg-gray-800'
      }`}
    >
      <span className="text-sm">{format(date, 'd')}</span>
      {openTasks.length > 0 && (
        <div className="flex gap-0.5 mt-0.5">
          {openTasks.slice(0, maxDots).map((task, i) => (
            <span
              key={i}
              className="w-1.5 h-1.5 rounded-full"
              style={{
                backgroundColor: isSelected
                  ? 'white'
                  : getCategoryColor(task.category),
              }}
            />
          ))}
        </div>
      )}
    </button>
  );
}
