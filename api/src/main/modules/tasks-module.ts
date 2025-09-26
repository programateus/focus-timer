import { Module } from '@nestjs/common';

import { TasksModule } from '@application/use-cases/tasks/tasks-module';
import { TasksController } from '@presentation/controllers/tasks-controller';
import { jwtAdapterProvider } from '@infra/auth/jwt-adapter';

@Module({
  imports: [TasksModule],
  providers: [jwtAdapterProvider],
  controllers: [TasksController],
})
export class TasksControllerModule {}
