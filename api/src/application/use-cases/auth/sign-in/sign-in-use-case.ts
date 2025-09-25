import { StringValue } from 'ms';
import {
  Inject,
  Injectable,
  Provider,
  UnauthorizedException,
} from '@nestjs/common';

import {
  TokenService,
  TokenServiceIdentifier,
} from '@application/contracts/auth/token-service';
import {
  PasswordHasher,
  PasswordHasherIdentifier,
} from '@application/contracts/hasher/password-hasher';
import {
  TokenRepository,
  TokenRepositoryIdentifier,
} from '@domain/repositories/token-repository';
import {
  UserRepository,
  UserRepositoryIdentifier,
} from '@domain/repositories/user-repository';
import { SignInDTO } from '@presentation/dtos/sign-in-dto';
import { TokenPayloadDTO } from '@application/dtos/token-payload-dto';

@Injectable()
export class SignInUseCase {
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

  async execute(signInDto: SignInDTO) {
    const { email, password } = signInDto;
    const user = await this.userRepository.findByEmail(email, {
      includePassword: true,
    });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    if (!user.password) {
      throw new UnauthorizedException('User has no password set');
    }
    if (!(await this.passwordHasher.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
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

export const signInUseCaseProvider: Provider = {
  provide: SignInUseCase,
  useClass: SignInUseCase,
};
