export interface CreatePomodoroDTO {
  taskId: string;
  duration: number;
  startedAt: Date;
  completedAt: Date;
  type: "work" | "break";
}
