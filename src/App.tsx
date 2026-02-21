import { HashRouter, Routes, Route } from 'react-router-dom';
import { Suspense, useEffect } from 'react';
import { Header } from './components/common/Header';
import { BottomNav } from './components/common/BottomNav';
import { DashboardPage } from './pages/DashboardPage';
import { TasksPage } from './pages/TasksPage';
import { WeekPage } from './pages/WeekPage';
import { CalendarPage } from './pages/CalendarPage';
import { SettingsPage } from './pages/SettingsPage';
import { ImpressumPage } from './pages/ImpressumPage';
import { startReminderChecker } from './lib/notifications';

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
    </div>
  );
}

export default function App() {
  useEffect(() => {
    startReminderChecker();
  }, []);

  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col" style={{ paddingBottom: 'calc(4rem + env(safe-area-inset-bottom, 0))' }}>
        <Header />
        <main className="flex-1 max-w-lg mx-auto w-full">
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/tasks" element={<TasksPage />} />
              <Route path="/week" element={<WeekPage />} />
              <Route path="/calendar" element={<CalendarPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/impressum" element={<ImpressumPage />} />
            </Routes>
          </Suspense>
        </main>
        <BottomNav />
      </div>
    </HashRouter>
  );
}
