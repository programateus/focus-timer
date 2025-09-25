import Redis from 'ioredis';
import { Inject, Injectable, Provider } from '@nestjs/common';

import {
  TokenRepository,
  TokenRepositoryIdentifier,
  TokenSaverRepositoryParams,
} from '@domain/repositories/token-repository';

import { RedisIdentifier } from '../redis-module';

@Injectable()
export class RedisTokenRepository implements TokenRepository {
  constructor(@Inject(RedisIdentifier) private readonly redis: Redis) {}

  async save(params: TokenSaverRepositoryParams): Promise<void> {
    const { userId, value } = params;
    await this.redis.set(userId, value);
  }

  findByUserId(userId: string): Promise<string | null> {
    return this.redis.get(userId);
  }

  async removeTokenByUserId(userId: string): Promise<void> {
    await this.redis.del(userId);
  }
}

export const redisTokenRepositoryProvider: Provider = {
  provide: TokenRepositoryIdentifier,
  useClass: RedisTokenRepository,
};
