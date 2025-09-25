import {
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
  Provider,
  UnauthorizedException,
} from '@nestjs/common';
import { StringValue } from 'ms';

import {
  UserRepository,
  UserRepositoryIdentifier,
} from '@domain/repositories/user-repository';
import {
  TokenRepository,
  TokenRepositoryIdentifier,
} from '@domain/repositories/token-repository';
import {
  TokenService,
  TokenServiceIdentifier,
} from '@application/contracts/auth/token-service';

@Injectable()
export class AccessTokenIssuerUseCase {
  constructor(
    @Inject(UserRepositoryIdentifier)
    private readonly userRepository: UserRepository,
    @Inject(TokenRepositoryIdentifier)
    private readonly tokenRepository: TokenRepository,
    @Inject(TokenServiceIdentifier)
    private readonly tokenService: TokenService,
    private readonly logger: Logger,
  ) {}

  async execute(refreshToken: string): Promise<string> {
    try {
      const payload = await this.tokenService.verify(refreshToken);
      const user = await this.userRepository.findById(payload.id);
      if (!user) {
        throw new ForbiddenException();
      }
      const token = await this.tokenRepository.findByUserId(payload.id);
      if (!token) {
        throw new UnauthorizedException();
      }
      const accessToken = await this.tokenService.sign(
        payload,
        process.env.JWT_ACCESS_TOKEN_EXPIRES_IN! as StringValue,
      );
      return accessToken;
    } catch (e) {
      this.logger.log(`Token expired`, (e as Error).message);
      const payload = await this.tokenService.decode(refreshToken);
      await this.tokenRepository.removeTokenByUserId(payload.id);
      throw new UnauthorizedException();
    }
  }
}

export const accessTokenIssuerUseCaseProvider: Provider = {
  provide: AccessTokenIssuerUseCase,
  useClass: AccessTokenIssuerUseCase,
};
