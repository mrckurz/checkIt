import { db } from './storage/db';

let intervalId: ReturnType<typeof setInterval> | null = null;

export function startReminderChecker() {
  if (intervalId) return;

  intervalId = setInterval(async () => {
    if (!('Notification' in window) || Notification.permission !== 'granted') return;

    const now = new Date();
    const tasks = await db.tasks
      .filter(
        (t) =>
          t.status !== 'done' &&
          t.dueDate != null &&
          t.reminderMinutesBefore != null &&
          !t.reminderFired,
      )
      .toArray();

    for (const task of tasks) {
      const reminderTime = new Date(
        task.dueDate!.getTime() - task.reminderMinutesBefore! * 60 * 1000,
      );
      if (now >= reminderTime) {
        new Notification('CheckIt! Erinnerung', {
          body: task.title,
          icon: import.meta.env.BASE_URL + 'logo-192.png',
        });
        await db.tasks.update(task.id!, { reminderFired: true });
      }
    }
  }, 60_000);
}

export function stopReminderChecker() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
}
