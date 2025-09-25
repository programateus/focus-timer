import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';

import { RequestUser, User } from '@presentation/decorators/user';
import { JwtAuthGuard } from '@presentation/guards/jwt-auth-guard';
import { ProfileUpdaterUseCase } from '@application/use-cases/profile/profile-updater/profile-updater-use-case';
import { UpdateProfileDTO } from '@presentation/dtos/update-profile-dto';
import { ProfileDataLoaderUseCase } from '@application/use-cases/profile/profile/profile-data-loader-use-case';

@Controller('profile')
export class ProfileController {
  constructor(
    private readonly profileDataLoaderUseCase: ProfileDataLoaderUseCase,
    private readonly profileUpdaterUseCase: ProfileUpdaterUseCase,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getProfile(@User() user: RequestUser) {
    return this.profileDataLoaderUseCase.execute(user.id);
  }

  @Patch()
  @UseGuards(JwtAuthGuard)
  async updateProfile(
    @User() user: RequestUser,
    @Body() body: UpdateProfileDTO,
  ) {
    return this.profileUpdaterUseCase.execute({ id: user.id, ...body });
  }
}
