import {
  PomodoroClientIdentifier,
  type PomodoroClient,
} from "@application/contracts/clients/pomodoro-client";
import type { BindingDefinition } from "@infra/inversify/types";
import { inject, injectable } from "inversify";

@injectable()
export class ListPomodoroUseCase {
  constructor(
    @inject(PomodoroClientIdentifier)
    private readonly pomodoroClient: PomodoroClient
  ) {}

  async execute() {
    return this.pomodoroClient.list();
  }
}

export const listPomodoroUseCaseBinding: BindingDefinition = {
  token: ListPomodoroUseCase,
  implementation: ListPomodoroUseCase,
};
