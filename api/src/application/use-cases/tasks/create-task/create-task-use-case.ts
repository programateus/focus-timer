import { Inject, Injectable, Provider } from '@nestjs/common';

import { Task } from '@domain/entities/task';
import {
  TaskRepository,
  TaskRepositoryIdentifier,
} from '@domain/repositories/task-repository';
import { CreateTaskDTO } from '@application/dtos/create-task-dto';

@Injectable()
export class CreateTaskUseCase {
  constructor(
    @Inject(TaskRepositoryIdentifier)
    private readonly taskRepository: TaskRepository,
  ) {}

  async execute(data: CreateTaskDTO): Promise<Task> {
    return this.taskRepository.create(data);
  }
}

export const createTaskUseCaseProvider: Provider = {
  provide: CreateTaskUseCase,
  useClass: CreateTaskUseCase,
};
