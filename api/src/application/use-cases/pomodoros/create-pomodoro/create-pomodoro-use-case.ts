import { Inject, Injectable, Provider } from '@nestjs/common';

import { Pomodoro } from '@domain/entities/pomodoro';
import {
  PomodoroRepository,
  PomodoroRepositoryIdentifier,
} from '@domain/repositories/pomodoro-repository';
import { CreatePomodoroDTO } from '@application/dtos/create-pomodoro-dto';

@Injectable()
export class CreatePomodoroUseCase {
  constructor(
    @Inject(PomodoroRepositoryIdentifier)
    private readonly pomodoroRepository: PomodoroRepository,
  ) {}

  async execute(data: CreatePomodoroDTO): Promise<Pomodoro> {
    return this.pomodoroRepository.create(data);
  }
}

export const createPomodoroUseCaseProvider: Provider = {
  provide: CreatePomodoroUseCase,
  useClass: CreatePomodoroUseCase,
};
