import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

import { CreateTaskUseCase } from '@application/use-cases/tasks/create-task/create-task-use-case';
import { GetTasksUseCase } from '@application/use-cases/tasks/get-tasks/get-tasks-use-case';
import { UpdateTaskUseCase } from '@application/use-cases/tasks/update-task/update-task-use-case';
import { DeleteTaskUseCase } from '@application/use-cases/tasks/delete-task/delete-task-use-case';
import { JwtAuthGuard } from '@presentation/guards/jwt-auth-guard';

import { CreateTaskDto } from '@presentation/dtos/create-task-dto';
import { UpdateTaskDto } from '@presentation/dtos/update-task-dto';
import { RequestUser, User } from '@presentation/decorators/user';

@ApiTags('tasks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(
    private readonly createTaskUseCase: CreateTaskUseCase,
    private readonly getTasksUseCase: GetTasksUseCase,
    private readonly updateTaskUseCase: UpdateTaskUseCase,
    private readonly deleteTaskUseCase: DeleteTaskUseCase,
  ) {}

  @Post()
  async create(@User() user: RequestUser, @Body() body: CreateTaskDto) {
    return this.createTaskUseCase.execute({
      ...body,
      userId: user.id,
    });
  }

  @Get()
  async findAll(@User() user: RequestUser) {
    return this.getTasksUseCase.execute(user.id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: UpdateTaskDto,
    @User() user: RequestUser,
  ) {
    return this.updateTaskUseCase.execute(id, body, user.id);
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @User() user: RequestUser) {
    await this.deleteTaskUseCase.execute(id, user.id);
  }
}
