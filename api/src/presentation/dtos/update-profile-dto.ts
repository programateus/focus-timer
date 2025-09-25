import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class UpdateProfileDTO {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;
}
