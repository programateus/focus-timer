import { Module } from '@nestjs/common';

import { PrismaModule } from '@infra/database/prisma-module';
import { prismaUserRepositoryProvider } from '@infra/database/repositories/prisma-user-repository';

import { profileUpdaterUseCaseProvider } from './profile-updater-use-case';

@Module({
  imports: [PrismaModule],
  providers: [profileUpdaterUseCaseProvider, prismaUserRepositoryProvider],
  exports: [profileUpdaterUseCaseProvider],
})
export class ProfileUpdaterModule {}
