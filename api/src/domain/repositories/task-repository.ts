import { CreateTaskDTO } from '@application/dtos/create-task-dto';
import { UpdateTaskDTO } from '@application/dtos/update-task-dto';
import { Task } from '@domain/entities/task';

export const TaskRepositoryIdentifier = Symbol('TaskRepository');

export interface TaskRepository {
  create(data: CreateTaskDTO): Promise<Task>;
  findById(id: string): Promise<Task | null>;
  findManyByUserId(userId: string): Promise<Task[]>;
  update(id: string, data: UpdateTaskDTO): Promise<Task>;
  delete(id: string): Promise<void>;
}
