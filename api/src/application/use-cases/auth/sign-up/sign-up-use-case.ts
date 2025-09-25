import {
  ConflictException,
  Inject,
  Injectable,
  Provider,
} from '@nestjs/common';

import { SignUpDTO } from '@application/dtos/sign-up-dto';
import {
  UserRepository,
  UserRepositoryIdentifier,
} from '@domain/repositories/user-repository';
import { User } from '@domain/entities/user';
import {
  PasswordHasher,
  PasswordHasherIdentifier,
} from '@application/contracts/hasher/password-hasher';
import {
  TokenService,
  TokenServiceIdentifier,
} from '@application/contracts/auth/token-service';
import {
  TokenRepository,
  TokenRepositoryIdentifier,
} from '@domain/repositories/token-repository';
import { TokenPayloadDTO } from '@application/dtos/token-payload-dto';
import { StringValue } from 'ms';

@Injectable()
export class SignUpUseCase {
  constructor(
    @Inject(UserRepositoryIdentifier)
    private readonly userRepository: UserRepository,
    @Inject(PasswordHasherIdentifier)
    private readonly passwordHasher: PasswordHasher,
    @Inject(TokenServiceIdentifier)
    private readonly tokenService: TokenService,
    @Inject(TokenRepositoryIdentifier)
    private readonly tokenRepository: TokenRepository,
  ) {}

  async execute(data: SignUpDTO) {
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new ConflictException('User already exists');
    }
    const hashedPassword = await this.passwordHasher.hash(data.password);
    let user = User.create(
      '',
      data.name,
      data.email,
      hashedPassword,
      new Date(),
      new Date(),
    );
    user = await this.userRepository.create(user);
    const payload = TokenPayloadDTO.fromUser(user);
    const accessToken = await this.tokenService.sign(
      payload,
      process.env.JWT_ACCESS_TOKEN_EXPIRES_IN! as StringValue,
    );
    let refreshToken = await this.tokenRepository.findByUserId(user.id);
    if (!refreshToken) {
      refreshToken = await this.tokenService.sign(
        payload,
        process.env.JWT_REFRESH_TOKEN_EXPIRES_IN! as StringValue,
      );
      await this.tokenRepository.save({
        userId: user.id,
        value: refreshToken,
      });
    }
    return { accessToken, refreshToken };
  }
}

export const signUpUseCaseProvider: Provider = {
  provide: SignUpUseCase,
  useClass: SignUpUseCase,
};
