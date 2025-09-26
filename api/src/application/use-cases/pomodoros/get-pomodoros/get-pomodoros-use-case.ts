import { Inject, Injectable, Provider } from '@nestjs/common';

import { Pomodoro } from '@domain/entities/pomodoro';
import {
  PomodoroRepository,
  PomodoroRepositoryIdentifier,
} from '@domain/repositories/pomodoro-repository';

@Injectable()
export class GetPomodorosUseCase {
  constructor(
    @Inject(PomodoroRepositoryIdentifier)
    private readonly pomodoroRepository: PomodoroRepository,
  ) {}

  async execute(userId: string): Promise<Pomodoro[]> {
    return this.pomodoroRepository.findManyByUserId(userId);
  }
}

export const getPomodorosUseCaseProvider: Provider = {
  provide: GetPomodorosUseCase,
  useClass: GetPomodorosUseCase,
};
