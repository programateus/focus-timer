import { Inject, Injectable, Provider } from '@nestjs/common';

import { Pomodoro } from '@domain/entities/pomodoro';
import {
  CreatePomodoroDto,
  PomodoroRepository,
  PomodoroRepositoryIdentifier,
} from '@domain/repositories/pomodoro-repository';

@Injectable()
export class CreatePomodoroUseCase {
  constructor(
    @Inject(PomodoroRepositoryIdentifier)
    private readonly pomodoroRepository: PomodoroRepository,
  ) {}

  async execute(data: CreatePomodoroDto): Promise<Pomodoro> {
    return this.pomodoroRepository.create(data);
  }
}

export const createPomodoroUseCaseProvider: Provider = {
  provide: CreatePomodoroUseCase,
  useClass: CreatePomodoroUseCase,
};
