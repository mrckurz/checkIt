import { useTranslation } from 'react-i18next';
import { BookOpen, Brain, ClipboardList, Home, MoreHorizontal } from 'lucide-react';
import type { Category } from '../../types/task';

const config: Record<
  Category,
  { icon: typeof BookOpen; colorClass: string }
> = {
  homework: {
    icon: BookOpen,
    colorClass: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  },
  study: {
    icon: Brain,
    colorClass: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  },
  test: {
    icon: ClipboardList,
    colorClass: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  },
  household: {
    icon: Home,
    colorClass: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  },
  other: {
    icon: MoreHorizontal,
    colorClass: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
  },
};

interface CategoryBadgeProps {
  category: Category;
  showLabel?: boolean;
}

export function CategoryBadge({ category, showLabel = true }: CategoryBadgeProps) {
  const { t } = useTranslation();
  const { icon: Icon, colorClass } = config[category];

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${colorClass}`}
    >
      <Icon className="w-3 h-3" />
      {showLabel && <span>{t(`category.${category}`)}</span>}
    </span>
  );
}

export function getCategoryColor(category: Category): string {
  const colors: Record<Category, string> = {
    homework: '#f59e0b',
    study: '#3b82f6',
    test: '#ef4444',
    household: '#10b981',
    other: '#8b5cf6',
  };
  return colors[category];
}
