import { Pomodoro } from '@domain/entities/pomodoro';

export const PomodoroRepositoryIdentifier = Symbol('PomodoroRepository');

export interface CreatePomodoroDto {
  taskId: string;
  duration: number;
  startedAt: Date;
  completedAt: Date;
  type: 'work' | 'break';
}

export interface PomodoroRepository {
  create(data: CreatePomodoroDto): Promise<Pomodoro>;
  findById(id: string): Promise<Pomodoro | null>;
  findManyByTaskId(taskId: string): Promise<Pomodoro[]>;
  findManyByUserId(userId: string): Promise<Pomodoro[]>;
  delete(id: string): Promise<void>;
}
