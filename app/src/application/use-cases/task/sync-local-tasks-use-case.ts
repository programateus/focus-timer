import { inject, injectable } from "inversify";
import type { BindingDefinition } from "@infra/inversify/types";

import {
  TaskClientIdentifier,
  type TaskClient,
} from "@application/contracts/clients/task-client";
import type { Task } from "@domain/entities/task";

@injectable()
export class SyncLocalTasksUseCase {
  constructor(
    @inject(TaskClientIdentifier) private readonly taskClient: TaskClient
  ) {}

  async execute(localTasks: Task[]) {
    const syncPromises = localTasks.map((task) =>
      this.taskClient.create({
        title: task.title,
        description: task.description || undefined,
      })
    );

    return Promise.all(syncPromises);
  }
}

export const syncLocalTasksUseCaseBinding: BindingDefinition = {
  token: SyncLocalTasksUseCase,
  implementation: SyncLocalTasksUseCase,
};
