import { Injectable, Provider } from '@nestjs/common';

import { User } from '@domain/entities/user';
import {
  FindUserOptions,
  UserRepository,
  UserRepositoryIdentifier,
} from '@domain/repositories/user-repository';

import { PrismaService } from '../prisma-service';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  findByEmail(email: string, options?: FindUserOptions): Promise<User | null> {
    return this.prismaService.user.findUnique({
      where: { email },
      omit: {
        password: !options?.includePassword,
      },
    });
  }

  create(user: User): Promise<User> {
    const { name, email, password } = user;
    return this.prismaService.user.create({
      data: { name, email, password: password! },
    });
  }

  findById(id: string, options?: FindUserOptions): Promise<User | null> {
    return this.prismaService.user.findUnique({
      where: { id },
      omit: {
        password: !options?.includePassword,
      },
    });
  }

  update(user: User): Promise<User> {
    const { id, name, email, password } = user;
    return this.prismaService.user.update({
      where: { id },
      data: { name, email, password },
    });
  }
}

export const prismaUserRepositoryProvider: Provider = {
  provide: UserRepositoryIdentifier,
  useClass: PrismaUserRepository,
};
