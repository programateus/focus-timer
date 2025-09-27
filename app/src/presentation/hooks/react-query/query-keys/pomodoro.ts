import { createQueryKeys } from "@lukemorales/query-key-factory";

export const pomodoroKeys = createQueryKeys("pomodoro", {
  list: () => ["list"],
  detail: (id: string) => ["detail", id],
});
