import { inject, injectable } from "inversify";
import type { BindingDefinition } from "@infra/inversify/types";

import {
  TaskClientIdentifier,
  type TaskClient,
} from "@application/contracts/clients/task-client";

@injectable()
export class DeleteTaskUseCase {
  constructor(
    @inject(TaskClientIdentifier) private readonly taskClient: TaskClient
  ) {}

  async execute(id: string) {
    return this.taskClient.delete(id);
  }
}

export const deleteTaskUseCaseBinding: BindingDefinition = {
  token: DeleteTaskUseCase,
  implementation: DeleteTaskUseCase,
};
