import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsDateString,
  IsIn,
  IsNotEmpty,
} from 'class-validator';

export class CreatePomodoroDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  taskId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  duration: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsDateString()
  startedAt: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsDateString()
  completedAt: string;

  @ApiProperty({ enum: ['work', 'break'] })
  @IsNotEmpty()
  @IsIn(['work', 'break'])
  type: 'work' | 'break';
}
