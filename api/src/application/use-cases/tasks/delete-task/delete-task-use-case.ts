import {
  Inject,
  Injectable,
  NotFoundException,
  Provider,
} from '@nestjs/common';

import {
  TaskRepository,
  TaskRepositoryIdentifier,
} from '@domain/repositories/task-repository';

@Injectable()
export class DeleteTaskUseCase {
  constructor(
    @Inject(TaskRepositoryIdentifier)
    private readonly taskRepository: TaskRepository,
  ) {}

  async execute(id: string, userId: string): Promise<void> {
    const task = await this.taskRepository.findById(id);
    if (!task || task.userId !== userId) {
      throw new NotFoundException('Task not found');
    }
    return this.taskRepository.delete(id);
  }
}

export const deleteTaskUseCaseProvider: Provider = {
  provide: DeleteTaskUseCase,
  useClass: DeleteTaskUseCase,
};
