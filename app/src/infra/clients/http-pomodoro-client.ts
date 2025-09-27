import { inject, injectable } from "inversify";

import {
  PomodoroClientIdentifier,
  type PomodoroClient,
} from "@application/contracts/clients/pomodoro-client";
import {
  HttpClientIdentifier,
  type HttpClient,
} from "@application/contracts/http-client";
import type { CreatePomodoroDTO } from "@application/dtos/create-pomodoro-dto";
import type { Pomodoro } from "@domain/entities/pomodoro";
import type { BindingDefinition } from "@infra/inversify/types";

@injectable()
export class HttpPomodoroClient implements PomodoroClient {
  constructor(
    @inject(HttpClientIdentifier) private readonly httpClient: HttpClient
  ) {}

  create(data: CreatePomodoroDTO): Promise<Pomodoro> {
    return this.httpClient.post("/api/pomodoros", data);
  }

  list(): Promise<Pomodoro[]> {
    return this.httpClient.get("/api/pomodoros");
  }
}

export const httpPomodoroClientBinding: BindingDefinition = {
  token: PomodoroClientIdentifier,
  implementation: HttpPomodoroClient,
};
