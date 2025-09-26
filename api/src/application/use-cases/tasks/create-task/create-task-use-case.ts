import { Inject, Injectable, Provider } from '@nestjs/common';

import { Task } from '@domain/entities/task';
import {
  CreateTaskDto,
  TaskRepository,
  TaskRepositoryIdentifier,
} from '@domain/repositories/task-repository';

@Injectable()
export class CreateTaskUseCase {
  constructor(
    @Inject(TaskRepositoryIdentifier)
    private readonly taskRepository: TaskRepository,
  ) {}

  async execute(data: CreateTaskDto): Promise<Task> {
    return this.taskRepository.create(data);
  }
}

export const createTaskUseCaseProvider: Provider = {
  provide: CreateTaskUseCase,
  useClass: CreateTaskUseCase,
};
