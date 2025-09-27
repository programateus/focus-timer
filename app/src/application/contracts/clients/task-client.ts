import type { ServiceIdentifier } from "inversify";

import type { CreateTaskDTO } from "@application/dtos/create-task-dto";
import type { Task } from "@domain/entities/task";

export interface TaskClient {
  create(data: CreateTaskDTO): Promise<Task>;
  list(): Promise<Task[]>;
}

export const TaskClientIdentifier: ServiceIdentifier<TaskClient> = "TaskClient";
