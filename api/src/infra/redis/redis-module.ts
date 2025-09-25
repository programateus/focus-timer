import Redis from 'ioredis';
import {
  DynamicModule,
  Global,
  InjectionToken,
  Module,
  Provider,
} from '@nestjs/common';

export type RedisModuleOptions = {
  port: number;
  host: string;
  username?: string;
  password?: string;
  db?: number;
};

export const RedisIdentifier: InjectionToken<Redis> = 'REDIS';

@Global()
@Module({})
export class RedisModule {
  static forRoot(options: RedisModuleOptions): DynamicModule {
    const redis = new Redis(options);
    const redisProvider: Provider = {
      provide: RedisIdentifier,
      useValue: redis,
    };
    return {
      module: RedisModule,
      providers: [redisProvider],
      exports: [redisProvider],
    };
  }
}
