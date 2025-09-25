import { InjectionToken } from '@nestjs/common';

import { User } from '@domain/entities/user';

export type FindUserOptions = {
  includePassword?: boolean;
};

export interface UserRepository {
  findById(id: string, options?: FindUserOptions): Promise<User | null>;
  findByEmail(email: string, options?: FindUserOptions): Promise<User | null>;
  create(user: User): Promise<User>;
  update(user: User): Promise<User>;
}

export const UserRepositoryIdentifier: InjectionToken<UserRepository> =
  'UserRepository';
