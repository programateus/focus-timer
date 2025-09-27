import {
  TaskClientIdentifier,
  type TaskClient,
} from "@application/contracts/clients/task-client";
import type { BindingDefinition } from "@infra/inversify/types";
import { inject, injectable } from "inversify";

@injectable()
export class ListTaskUseCase {
  constructor(
    @inject(TaskClientIdentifier) private readonly taskClient: TaskClient
  ) {}

  async execute() {
    return this.taskClient.list();
  }
}

export const listTaskUseCaseBinding: BindingDefinition = {
  token: ListTaskUseCase,
  implementation: ListTaskUseCase,
};
