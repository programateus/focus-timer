import { CreatePomodoroDTO } from '@application/dtos/create-pomodoro-dto';
import { Pomodoro } from '@domain/entities/pomodoro';

export const PomodoroRepositoryIdentifier = Symbol('PomodoroRepository');

export interface PomodoroRepository {
  create(data: CreatePomodoroDTO): Promise<Pomodoro>;
  findById(id: string): Promise<Pomodoro | null>;
  findManyByTaskId(taskId: string): Promise<Pomodoro[]>;
  findManyByUserId(userId: string): Promise<Pomodoro[]>;
  delete(id: string): Promise<void>;
}
