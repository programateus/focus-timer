import { Module } from '@nestjs/common';

import { PrismaModule } from '@infra/database/prisma-module';
import { prismaTaskRepositoryProvider } from '@infra/database/repositories/prisma-task-repository';

import { createTaskUseCaseProvider } from './create-task/create-task-use-case';
import { getTasksUseCaseProvider } from './get-tasks/get-tasks-use-case';
import { updateTaskUseCaseProvider } from './update-task/update-task-use-case';
import { deleteTaskUseCaseProvider } from './delete-task/delete-task-use-case';

@Module({
  imports: [PrismaModule],
  providers: [
    prismaTaskRepositoryProvider,
    createTaskUseCaseProvider,
    getTasksUseCaseProvider,
    updateTaskUseCaseProvider,
    deleteTaskUseCaseProvider,
  ],
  exports: [
    createTaskUseCaseProvider,
    getTasksUseCaseProvider,
    updateTaskUseCaseProvider,
    deleteTaskUseCaseProvider,
  ],
})
export class TasksModule {}
