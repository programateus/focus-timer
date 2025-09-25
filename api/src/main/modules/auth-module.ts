import { Module } from '@nestjs/common';

import { AuthController } from '@presentation/controllers/auth-controller';
import { SignUpModule } from '@application/use-cases/auth/sign-up/sign-up-module';
import { SignInModule } from '@application/use-cases/auth/sign-in/sign-in-module';

@Module({
  imports: [SignUpModule, SignInModule],
  controllers: [AuthController],
})
export class AuthModule {}
