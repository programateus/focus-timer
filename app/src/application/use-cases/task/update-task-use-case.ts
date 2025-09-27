import { inject, injectable } from "inversify";
import type { BindingDefinition } from "@infra/inversify/types";

import {
  TaskClientIdentifier,
  type TaskClient,
} from "@application/contracts/clients/task-client";
import type { UpdateTaskDTO } from "@application/dtos/update-task-dto";

@injectable()
export class UpdateTaskUseCase {
  constructor(
    @inject(TaskClientIdentifier) private readonly taskClient: TaskClient
  ) {}

  async execute(id: string, data: UpdateTaskDTO) {
    return this.taskClient.update(id, data);
  }
}

export const updateTaskUseCaseBinding: BindingDefinition = {
  token: UpdateTaskUseCase,
  implementation: UpdateTaskUseCase,
};
