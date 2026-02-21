import type { Priority } from '../../types/task';

const config: Record<Priority, { color: string; label: string }> = {
  high: { color: 'bg-red-500', label: 'Hoch' },
  medium: { color: 'bg-amber-500', label: 'Mittel' },
  low: { color: 'bg-green-500', label: 'Niedrig' },
};

interface PriorityIndicatorProps {
  priority: Priority;
}

export function PriorityIndicator({ priority }: PriorityIndicatorProps) {
  const { color } = config[priority];

  return (
    <span
      className={`inline-block w-2 h-2 rounded-full ${color}`}
      title={config[priority].label}
    />
  );
}
