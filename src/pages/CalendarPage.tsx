import { useState } from 'react';
import { Plus } from 'lucide-react';
import { CalendarGrid } from '../components/calendar/CalendarGrid';
import { DayDetail } from '../components/calendar/DayDetail';
import { TaskForm } from '../components/tasks/TaskForm';
import { useTaskStore } from '../store/taskStore';

export function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const openForm = useTaskStore((s) => s.openForm);

  return (
    <div className="px-4 py-5">
      <CalendarGrid
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
      />

      <DayDetail date={selectedDate} />

      {/* FAB */}
      <button
        onClick={() => openForm()}
        className="fixed bottom-20 right-4 w-14 h-14 rounded-full bg-primary hover:bg-primary-dark text-white shadow-lg flex items-center justify-center transition-all hover:scale-105 active:scale-95 z-40"
      >
        <Plus className="w-6 h-6" />
      </button>

      <TaskForm preselectedDate={selectedDate} />
    </div>
  );
}
