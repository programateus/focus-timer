import { StringValue } from 'ms';
import { InjectionToken } from '@nestjs/common';

import { TokenPayloadDTO } from '@application/dtos/token-payload-dto';

export interface TokenService {
  sign(payload: TokenPayloadDTO, expiresIn: StringValue): Promise<string>;
  verify(token: string): Promise<TokenPayloadDTO>;
  decode(token: string): Promise<TokenPayloadDTO>;
}

export const TokenServiceIdentifier: InjectionToken<TokenService> =
  'TokenServiceIdentifier';
