import { InjectionToken } from '@nestjs/common';

import { User } from '@domain/entities/user';

export type FindUserOptions = {
  includePassword?: boolean;
};

export interface UserRepository {
  findByEmail(email: string, options?: FindUserOptions): Promise<User | null>;
  create(user: User): Promise<User>;
}

export const UserRepositoryIdentifier: InjectionToken<UserRepository> =
  'UserRepository';
