import { Module } from '@nestjs/common';

import { jwtAdapterProvider } from '@infra/auth/jwt-adapter';
import { ProfileController } from '@presentation/controllers/profile-controller';
import { ProfileDataLoaderModule } from '@application/use-cases/profile/profile/profile-data-loader-module';
import { ProfileUpdaterModule } from '@application/use-cases/profile/profile-updater/profile-updater-module';

@Module({
  imports: [ProfileDataLoaderModule, ProfileUpdaterModule],
  providers: [jwtAdapterProvider],
  controllers: [ProfileController],
})
export class ProfileModule {}
