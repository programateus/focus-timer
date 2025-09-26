import { Task } from '@domain/entities/task';

export const TaskRepositoryIdentifier = Symbol('TaskRepository');

export interface CreateTaskDto {
  title: string;
  description?: string;
  userId: string;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  completed?: boolean;
}

export interface TaskRepository {
  create(data: CreateTaskDto): Promise<Task>;
  findById(id: string): Promise<Task | null>;
  findManyByUserId(userId: string): Promise<Task[]>;
  update(id: string, data: UpdateTaskDto): Promise<Task>;
  delete(id: string): Promise<void>;
}
