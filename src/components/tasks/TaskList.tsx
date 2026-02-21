import type { Task } from '../../types/task';
import { TaskCard } from './TaskCard';

interface TaskListProps {
  tasks: Task[];
  title?: string;
}

export function TaskList({ tasks, title }: TaskListProps) {
  if (tasks.length === 0) return null;

  return (
    <div>
      {title && (
        <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 px-1">
          {title}
        </h3>
      )}
      <div className="space-y-2">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}
