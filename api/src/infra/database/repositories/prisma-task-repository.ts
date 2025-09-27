import { Injectable, Provider } from '@nestjs/common';

import { Task } from '@domain/entities/task';
import {
  TaskRepository,
  TaskRepositoryIdentifier,
} from '@domain/repositories/task-repository';

import { PrismaService } from '../prisma-service';
import { CreateTaskDTO } from '@application/dtos/create-task-dto';
import { UpdateTaskDTO } from '@application/dtos/update-task-dto';

@Injectable()
export class PrismaTaskRepository implements TaskRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(data: CreateTaskDTO): Promise<Task> {
    const task = await this.prismaService.task.create({
      data,
    });

    return new Task(
      task.id,
      task.title,
      task.description,
      task.completed,
      task.userId,
      task.createdAt,
      task.updatedAt,
    );
  }

  async findById(id: string): Promise<Task | null> {
    const task = await this.prismaService.task.findUnique({
      where: { id },
    });

    if (!task) return null;

    return new Task(
      task.id,
      task.title,
      task.description,
      task.completed,
      task.userId,
      task.createdAt,
      task.updatedAt,
    );
  }

  async findManyByUserId(userId: string): Promise<Task[]> {
    const tasks = await this.prismaService.task.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return tasks.map(
      (task) =>
        new Task(
          task.id,
          task.title,
          task.description,
          task.completed,
          task.userId,
          task.createdAt,
          task.updatedAt,
        ),
    );
  }

  async update(id: string, data: UpdateTaskDTO): Promise<Task> {
    const task = await this.prismaService.task.update({
      where: { id },
      data: {
        ...data,
      },
    });

    return new Task(
      task.id,
      task.title,
      task.description,
      task.completed,
      task.userId,
      task.createdAt,
      task.updatedAt,
    );
  }

  async delete(id: string): Promise<void> {
    await this.prismaService.task.delete({
      where: { id },
    });
  }
}

export const prismaTaskRepositoryProvider: Provider = {
  provide: TaskRepositoryIdentifier,
  useClass: PrismaTaskRepository,
};
