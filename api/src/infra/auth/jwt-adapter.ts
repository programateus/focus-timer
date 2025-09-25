/* eslint-disable @typescript-eslint/require-await */
import * as jwt from 'jsonwebtoken';
import { StringValue } from 'ms';

import { Injectable, Provider } from '@nestjs/common';

import { TokenPayloadDTO } from '@application/dtos/token-payload-dto';
import {
  TokenService,
  TokenServiceIdentifier,
} from '@application/contracts/auth/token-service';

type JwtPayload = {
  id: string;
};

@Injectable()
export class JwtAdapter implements TokenService {
  async sign(
    payload: TokenPayloadDTO,
    expiresIn: StringValue,
  ): Promise<string> {
    return jwt.sign(
      {
        id: payload.id,
      },
      process.env.JWT_PRIVATE_KEY!,
      {
        expiresIn,
        algorithm: 'RS256',
      },
    );
  }

  async verify(token: string): Promise<TokenPayloadDTO> {
    const payload = jwt.verify(
      token,
      process.env.JWT_PUBLIC_KEY!,
    ) as JwtPayload;
    return new TokenPayloadDTO(payload.id);
  }

  async decode(token: string): Promise<TokenPayloadDTO> {
    const payload = jwt.decode(token) as JwtPayload;
    return new TokenPayloadDTO(payload.id);
  }
}

export const jwtAdapterProvider: Provider = {
  provide: TokenServiceIdentifier,
  useClass: JwtAdapter,
};
