import {
  Inject,
  Injectable,
  NotFoundException,
  Provider,
} from '@nestjs/common';

import {
  UserRepository,
  UserRepositoryIdentifier,
} from '@domain/repositories/user-repository';
import { ProfileDataDTO } from '@application/dtos/profile-data-dto';

@Injectable()
export class ProfileDataLoaderUseCase {
  constructor(
    @Inject(UserRepositoryIdentifier)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(userId: string): Promise<ProfileDataDTO> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const { id, name, email } = user;
    return { id, name, email };
  }
}

export const profileDataLoaderUseCaseProvider: Provider = {
  provide: ProfileDataLoaderUseCase,
  useClass: ProfileDataLoaderUseCase,
};
