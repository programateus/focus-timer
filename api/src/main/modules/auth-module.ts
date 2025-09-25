import { Module } from '@nestjs/common';

import { AuthController } from '@presentation/controllers/auth-controller';
import { SignUpModule } from '@application/use-cases/auth/sign-up/sign-up-module';
import { SignInModule } from '@application/use-cases/auth/sign-in/sign-in-module';
import { AccessTokenIssuerModule } from '@application/use-cases/auth/access-token-issuer/access-token-issuer-module';

@Module({
  imports: [SignUpModule, SignInModule, AccessTokenIssuerModule],
  controllers: [AuthController],
})
export class AuthModule {}
