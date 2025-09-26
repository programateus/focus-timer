import { Module } from '@nestjs/common';

import { PomodorosModule } from '@application/use-cases/pomodoros/pomodoros-module';
import { PomodorosController } from '@presentation/controllers/pomodoros-controller';
import { jwtAdapterProvider } from '@infra/auth/jwt-adapter';

@Module({
  imports: [PomodorosModule],
  providers: [jwtAdapterProvider],
  controllers: [PomodorosController],
})
export class PomodorosControllerModule {}
