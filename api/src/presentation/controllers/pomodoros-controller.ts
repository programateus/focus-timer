import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

import { CreatePomodoroUseCase } from '@application/use-cases/pomodoros/create-pomodoro/create-pomodoro-use-case';
import { GetPomodorosUseCase } from '@application/use-cases/pomodoros/get-pomodoros/get-pomodoros-use-case';
import { JwtAuthGuard } from '@presentation/guards/jwt-auth-guard';

import { CreatePomodoroDto } from '@presentation/dtos/create-pomodoro-dto';
import { RequestUser, User } from '@presentation/decorators/user';

@ApiTags('pomodoros')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('pomodoros')
export class PomodorosController {
  constructor(
    private readonly createPomodoroUseCase: CreatePomodoroUseCase,
    private readonly getPomodorosUseCase: GetPomodorosUseCase,
  ) {}

  @Post()
  async create(@Body() body: CreatePomodoroDto) {
    return this.createPomodoroUseCase.execute({
      ...body,
      startedAt: new Date(body.startedAt),
      completedAt: new Date(body.completedAt),
    });
  }

  @Get()
  async findAll(@User() user: RequestUser) {
    return this.getPomodorosUseCase.execute(user.id);
  }
}
