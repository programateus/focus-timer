import { Injectable, Provider } from '@nestjs/common';

import { Task } from '@domain/entities/task';
import {
  CreateTaskDto,
  TaskRepository,
  TaskRepositoryIdentifier,
  UpdateTaskDto,
} from '@domain/repositories/task-repository';

import { PrismaService } from '../prisma-service';

@Injectable()
export class PrismaTaskRepository implements TaskRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(data: CreateTaskDto): Promise<Task> {
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

  async update(id: string, data: UpdateTaskDto): Promise<Task> {
    const task = await this.prismaService.task.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
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
