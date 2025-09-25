import { ApiProperty } from '@nestjs/swagger';
import { Match } from '@presentation/decorators/match';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class SignUpDTO {
  @ApiProperty({
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  name: string;

  @ApiProperty({
    type: String,
  })
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(255)
  email: string;

  @ApiProperty({
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message:
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
    },
  )
  @MinLength(8)
  @MaxLength(32)
  password: string;

  @ApiProperty({
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  @Match('password', { message: 'Passwords do not match.' })
  @MinLength(8)
  @MaxLength(32)
  passwordConfirmation: string;
}
