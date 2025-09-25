import { Module } from '@nestjs/common';

import { PrismaModule } from '@infra/database/prisma-module';
import { prismaUserRepositoryProvider } from '@infra/database/repositories/prisma-user-repository';

import { profileDataLoaderUseCaseProvider } from './profile-data-loader-use-case';

@Module({
  imports: [PrismaModule],
  providers: [profileDataLoaderUseCaseProvider, prismaUserRepositoryProvider],
  exports: [profileDataLoaderUseCaseProvider],
})
export class ProfileDataLoaderModule {}
