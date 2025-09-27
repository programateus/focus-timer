import { inject, injectable } from "inversify";
import type { BindingDefinition } from "@infra/inversify/types";

import {
  PomodoroClientIdentifier,
  type PomodoroClient,
} from "@application/contracts/clients/pomodoro-client";
import type { CreatePomodoroDTO } from "@application/dtos/create-pomodoro-dto";

@injectable()
export class CreatePomodoroUseCase {
  constructor(
    @inject(PomodoroClientIdentifier)
    private readonly pomodoroClient: PomodoroClient
  ) {}

  async execute(data: CreatePomodoroDTO) {
    return this.pomodoroClient.create(data);
  }
}

export const createPomodoroUseCaseBinding: BindingDefinition = {
  token: CreatePomodoroUseCase,
  implementation: CreatePomodoroUseCase,
};
