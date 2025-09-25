import { UpdateProfileDTO } from '@application/dtos/update-profile-dto';
import { User } from '@domain/entities/user';
import {
  UserRepository,
  UserRepositoryIdentifier,
} from '@domain/repositories/user-repository';
import {
  Inject,
  Injectable,
  NotFoundException,
  Provider,
} from '@nestjs/common';

@Injectable()
export class ProfileUpdaterUseCase {
  constructor(
    @Inject(UserRepositoryIdentifier)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(data: UpdateProfileDTO) {
    const user = await this.userRepository.findById(data.id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const updatedUser = User.update(user, data);
    return this.userRepository.update(updatedUser);
  }
}

export const profileUpdaterUseCaseProvider: Provider = {
  provide: ProfileUpdaterUseCase,
  useClass: ProfileUpdaterUseCase,
};
