import {
  Inject,
  Injectable,
  NotFoundException,
  Provider,
} from '@nestjs/common';

import { Task } from '@domain/entities/task';
import {
  TaskRepository,
  TaskRepositoryIdentifier,
} from '@domain/repositories/task-repository';
import { UpdateTaskDTO } from '@application/dtos/update-task-dto';

@Injectable()
export class UpdateTaskUseCase {
  constructor(
    @Inject(TaskRepositoryIdentifier)
    private readonly taskRepository: TaskRepository,
  ) {}

  async execute(
    id: string,
    data: UpdateTaskDTO,
    userId: string,
  ): Promise<Task> {
    const task = await this.taskRepository.findById(id);
    if (!task || task.userId !== userId) {
      throw new NotFoundException('Task not found');
    }
    return this.taskRepository.update(id, data);
  }
}

export const updateTaskUseCaseProvider: Provider = {
  provide: UpdateTaskUseCase,
  useClass: UpdateTaskUseCase,
};
