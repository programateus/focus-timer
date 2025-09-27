import { Injectable, Provider } from '@nestjs/common';

import { Pomodoro } from '@domain/entities/pomodoro';
import {
  PomodoroRepository,
  PomodoroRepositoryIdentifier,
} from '@domain/repositories/pomodoro-repository';

import { PrismaService } from '../prisma-service';
import { CreatePomodoroDTO } from '@application/dtos/create-pomodoro-dto';

@Injectable()
export class PrismaPomodoroRepository implements PomodoroRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(data: CreatePomodoroDTO): Promise<Pomodoro> {
    const pomodoro = await this.prismaService.pomodoro.create({
      data,
    });

    return new Pomodoro(
      pomodoro.id,
      pomodoro.taskId,
      pomodoro.duration,
      pomodoro.startedAt,
      pomodoro.completedAt,
      pomodoro.type as 'work' | 'break',
      pomodoro.createdAt,
      pomodoro.updatedAt,
    );
  }

  async findById(id: string): Promise<Pomodoro | null> {
    const pomodoro = await this.prismaService.pomodoro.findUnique({
      where: { id },
    });

    if (!pomodoro) return null;

    return new Pomodoro(
      pomodoro.id,
      pomodoro.taskId,
      pomodoro.duration,
      pomodoro.startedAt,
      pomodoro.completedAt,
      pomodoro.type as 'work' | 'break',
      pomodoro.createdAt,
      pomodoro.updatedAt,
    );
  }

  async findManyByTaskId(taskId: string): Promise<Pomodoro[]> {
    const pomodoros = await this.prismaService.pomodoro.findMany({
      where: { taskId },
      orderBy: { createdAt: 'desc' },
    });

    return pomodoros.map(
      (pomodoro) =>
        new Pomodoro(
          pomodoro.id,
          pomodoro.taskId,
          pomodoro.duration,
          pomodoro.startedAt,
          pomodoro.completedAt,
          pomodoro.type as 'work' | 'break',
          pomodoro.createdAt,
          pomodoro.updatedAt,
        ),
    );
  }

  async findManyByUserId(userId: string): Promise<Pomodoro[]> {
    const pomodoros = await this.prismaService.pomodoro.findMany({
      where: {
        task: {
          userId,
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return pomodoros.map(
      (pomodoro) =>
        new Pomodoro(
          pomodoro.id,
          pomodoro.taskId,
          pomodoro.duration,
          pomodoro.startedAt,
          pomodoro.completedAt,
          pomodoro.type as 'work' | 'break',
          pomodoro.createdAt,
          pomodoro.updatedAt,
        ),
    );
  }

  async delete(id: string): Promise<void> {
    await this.prismaService.pomodoro.delete({
      where: { id },
    });
  }
}

export const prismaPomodoroRepositoryProvider: Provider = {
  provide: PomodoroRepositoryIdentifier,
  useClass: PrismaPomodoroRepository,
};
