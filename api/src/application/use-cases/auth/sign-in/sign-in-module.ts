import { Module } from '@nestjs/common';

import { PrismaModule } from '@infra/database/prisma-module';
import { prismaUserRepositoryProvider } from '@infra/database/repositories/prisma-user-repository';

import { signInUseCaseProvider } from './sign-in-use-case';
import { bcryptAdapterProvider } from '@infra/password-hasher/bcrypt-adapter';
import { redisTokenRepositoryProvider } from '@infra/redis/repositories/redis-token-repository';
import { jwtAdapterProvider } from '@infra/auth/jwt-adapter';

@Module({
  imports: [PrismaModule],
  providers: [
    signInUseCaseProvider,
    prismaUserRepositoryProvider,
    bcryptAdapterProvider,
    redisTokenRepositoryProvider,
    jwtAdapterProvider,
  ],
  exports: [signInUseCaseProvider],
})
export class SignInModule {}
