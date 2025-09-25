import { InjectionToken } from '@nestjs/common';

export interface TokenRepository {
  findByUserId(userId: string): Promise<string | null>;
  removeTokenByUserId(userId: string): Promise<void>;
  save(params: TokenSaverRepositoryParams): Promise<void>;
}

export type TokenSaverRepositoryParams = {
  userId: string;
  value: string;
};

export const TokenRepositoryIdentifier: InjectionToken<TokenRepository> =
  'TokenRepositoryIdentifier';
