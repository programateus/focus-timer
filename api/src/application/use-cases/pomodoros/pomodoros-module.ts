import { Module } from '@nestjs/common';

import { PrismaModule } from '@infra/database/prisma-module';
import { prismaPomodoroRepositoryProvider } from '@infra/database/repositories/prisma-pomodoro-repository';

import { createPomodoroUseCaseProvider } from './create-pomodoro/create-pomodoro-use-case';
import { getPomodorosUseCaseProvider } from './get-pomodoros/get-pomodoros-use-case';

@Module({
  imports: [PrismaModule],
  providers: [
    prismaPomodoroRepositoryProvider,
    createPomodoroUseCaseProvider,
    getPomodorosUseCaseProvider,
  ],
  exports: [createPomodoroUseCaseProvider, getPomodorosUseCaseProvider],
})
export class PomodorosModule {}
