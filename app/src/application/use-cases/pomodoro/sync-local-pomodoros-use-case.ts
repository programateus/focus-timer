import { inject, injectable } from "inversify";
import type { BindingDefinition } from "@infra/inversify/types";

import {
  PomodoroClientIdentifier,
  type PomodoroClient,
} from "@application/contracts/clients/pomodoro-client";
export interface PomodoroSession {
  id: string;
  taskId: string;
  duration: number;
  startedAt: Date;
  completedAt: Date;
  type: "work" | "break";
}

@injectable()
export class SyncLocalPomodorosUseCase {
  constructor(
    @inject(PomodoroClientIdentifier)
    private readonly pomodoroClient: PomodoroClient
  ) {}

  async execute(localPomodoros: PomodoroSession[]) {
    const syncPromises = localPomodoros.map((pomodoro) =>
      this.pomodoroClient.create({
        taskId: pomodoro.taskId,
        duration: pomodoro.duration,
        startedAt: pomodoro.startedAt.toISOString(),
        completedAt: pomodoro.completedAt.toISOString(),
        type: pomodoro.type,
      })
    );

    return Promise.all(syncPromises);
  }
}

export const syncLocalPomodorosUseCaseBinding: BindingDefinition = {
  token: SyncLocalPomodorosUseCase,
  implementation: SyncLocalPomodorosUseCase,
};
