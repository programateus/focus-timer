import type { ServiceIdentifier } from "inversify";

import type { CreatePomodoroDTO } from "@application/dtos/create-pomodoro-dto";
import type { Pomodoro } from "@domain/entities/pomodoro";

export interface PomodoroClient {
  create(data: CreatePomodoroDTO): Promise<Pomodoro>;
  list(): Promise<Pomodoro[]>;
}

export const PomodoroClientIdentifier: ServiceIdentifier<PomodoroClient> =
  "PomodoroClient";
