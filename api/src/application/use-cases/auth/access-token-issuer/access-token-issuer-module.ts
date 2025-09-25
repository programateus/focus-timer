import { Logger, Module } from '@nestjs/common';

import { PrismaModule } from '@infra/database/prisma-module';

import { accessTokenIssuerUseCaseProvider } from './access-token-issuer-use-case';
import { jwtAdapterProvider } from '@infra/auth/jwt-adapter';
import { redisTokenRepositoryProvider } from '@infra/redis/repositories/redis-token-repository';
import { prismaUserRepositoryProvider } from '@infra/database/repositories/prisma-user-repository';

@Module({
  imports: [PrismaModule],
  providers: [
    accessTokenIssuerUseCaseProvider,
    prismaUserRepositoryProvider,
    jwtAdapterProvider,
    redisTokenRepositoryProvider,
    Logger,
  ],
  exports: [accessTokenIssuerUseCaseProvider],
})
export class AccessTokenIssuerModule {}
