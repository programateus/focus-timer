import { User } from '@domain/entities/user';

export class TokenPayloadDTO {
  constructor(public readonly id: string) {}

  static fromUser(user: User): TokenPayloadDTO {
    return new TokenPayloadDTO(user.id);
  }
}
