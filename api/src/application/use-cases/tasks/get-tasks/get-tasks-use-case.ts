import { Inject, Injectable, Provider } from '@nestjs/common';

import { Task } from '@domain/entities/task';
import {
  TaskRepository,
  TaskRepositoryIdentifier,
} from '@domain/repositories/task-repository';

@Injectable()
export class GetTasksUseCase {
  constructor(
    @Inject(TaskRepositoryIdentifier)
    private readonly taskRepository: TaskRepository,
  ) {}

  async execute(userId: string): Promise<Task[]> {
    return this.taskRepository.findManyByUserId(userId);
  }
}

export const getTasksUseCaseProvider: Provider = {
  provide: GetTasksUseCase,
  useClass: GetTasksUseCase,
};
