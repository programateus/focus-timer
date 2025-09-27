import type { ServiceIdentifier } from "inversify";

import type { CreateTaskDTO } from "@application/dtos/create-task-dto";
import type { UpdateTaskDTO } from "@application/dtos/update-task-dto";
import type { Task } from "@domain/entities/task";

export interface TaskClient {
  create(data: CreateTaskDTO): Promise<Task>;
  list(): Promise<Task[]>;
  update(id: string, data: UpdateTaskDTO): Promise<Task>;
  delete(id: string): Promise<void>;
}

export const TaskClientIdentifier: ServiceIdentifier<TaskClient> = "TaskClient";
