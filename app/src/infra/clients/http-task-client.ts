import { inject, injectable } from "inversify";

import {
  TaskClientIdentifier,
  type TaskClient,
} from "@application/contracts/clients/task-client";
import {
  HttpClientIdentifier,
  type HttpClient,
} from "@application/contracts/http-client";
import type { CreateTaskDTO } from "@application/dtos/create-task-dto";
import type { UpdateTaskDTO } from "@application/dtos/update-task-dto";
import type { Task } from "@domain/entities/task";
import type { BindingDefinition } from "@infra/inversify/types";

@injectable()
export class HttpTaskClient implements TaskClient {
  constructor(
    @inject(HttpClientIdentifier) private readonly httpClient: HttpClient
  ) {}

  create(data: CreateTaskDTO): Promise<Task> {
    return this.httpClient.post("/api/tasks", data);
  }

  list(): Promise<Task[]> {
    return this.httpClient.get("/api/tasks");
  }

  update(id: string, data: UpdateTaskDTO): Promise<Task> {
    return this.httpClient.put(`/api/tasks/${id}`, data);
  }

  delete(id: string): Promise<void> {
    return this.httpClient.delete(`/api/tasks/${id}`);
  }
}

export const httpTaskClientBinding: BindingDefinition = {
  token: TaskClientIdentifier,
  implementation: HttpTaskClient,
};
