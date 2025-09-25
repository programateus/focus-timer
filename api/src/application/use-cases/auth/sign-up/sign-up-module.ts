import { Module } from '@nestjs/common';

import { PrismaModule } from '@infra/database/prisma-module';
import { jwtAdapterProvider } from '@infra/auth/jwt-adapter';
import { bcryptAdapterProvider } from '@infra/password-hasher/bcrypt-adapter';
import { redisTokenRepositoryProvider } from '@infra/redis/repositories/redis-token-repository';
import { prismaUserRepositoryProvider } from '@infra/database/repositories/prisma-user-repository';

import { signUpUseCaseProvider } from './sign-up-use-case';

@Module({
  imports: [PrismaModule],
  providers: [
    signUpUseCaseProvider,
    prismaUserRepositoryProvider,
    bcryptAdapterProvider,
    jwtAdapterProvider,
    redisTokenRepositoryProvider,
  ],
  exports: [signUpUseCaseProvider],
})
export class SignUpModule {}
