import { IsNotEmpty, IsString } from 'class-validator';

export class IssueTokenDTO {
  @IsNotEmpty()
  @IsString()
  refreshToken: string;
}
