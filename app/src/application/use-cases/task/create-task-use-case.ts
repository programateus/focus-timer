import { inject, injectable } from "inversify";
import type { BindingDefinition } from "@infra/inversify/types";

import {
  TaskClientIdentifier,
  type TaskClient,
} from "@application/contracts/clients/task-client";
import type { CreateTaskDTO } from "@application/dtos/create-task-dto";

@injectable()
export class CreateTaskUseCase {
  constructor(
    @inject(TaskClientIdentifier) private readonly taskClient: TaskClient
  ) {}

  async execute(data: CreateTaskDTO) {
    return this.taskClient.create(data);
  }
}

export const createTaskUseCaseBinding: BindingDefinition = {
  token: CreateTaskUseCase,
  implementation: CreateTaskUseCase,
};
