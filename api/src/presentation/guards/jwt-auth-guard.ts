import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import {
  TokenService,
  TokenServiceIdentifier,
} from '@application/contracts/auth/token-service';
import { RequestWithUser } from './types';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    @Inject(TokenServiceIdentifier)
    private readonly tokenVerifier: TokenService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: RequestWithUser = context.switchToHttp().getRequest();
    const [, token] = request.headers.authorization?.split(' ') || '';
    if (!token) {
      return false;
    }
    try {
      const payload = await this.tokenVerifier.verify(token);
      request.user = payload;
      return true;
    } catch {
      throw new UnauthorizedException({
        message: 'Expired access token',
        code: 'access_token_expired',
      });
    }
  }
}
