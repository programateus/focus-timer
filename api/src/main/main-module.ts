import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth-module';
import { RedisModule } from '@infra/redis/redis-module';
import { ProfileModule } from './modules/profile-module';

@Module({
  imports: [
    RedisModule.forRoot({
      host: process.env.REDIS_HOST!,
      port: Number(process.env.REDIS_PORT),
      username: process.env.REDIS_USERNAME,
      password: process.env.REDIS_PASSWORD,
    }),

    AuthModule,
    ProfileModule,
  ],
})
export class MainModule {}
