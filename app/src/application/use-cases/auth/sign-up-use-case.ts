import { inject, injectable } from "inversify";

import type { SignUpDTO } from "@application/dtos/sign-up-dto";
import type { BindingDefinition } from "@infra/inversify/types";
import {
  AuthClientIdentifier,
  type AuthClient,
} from "@application/contracts/clients/auth-client";
import {
  TokenStorageIdentifier,
  type TokenStorage,
} from "@application/contracts/jwt/token-storage";

@injectable()
export class SignUpUseCase {
  constructor(
    @inject(AuthClientIdentifier) private authClient: AuthClient,
    @inject(TokenStorageIdentifier) private tokenStorage: TokenStorage
  ) {}

  async execute(data: SignUpDTO): Promise<void> {
    const tokens = await this.authClient.signUp(data);
    this.tokenStorage.save("access_token", tokens.accessToken);
    this.tokenStorage.save("refresh_token", tokens.refreshToken);
  }
}

export const signUpUseCaseBinding: BindingDefinition = {
  token: SignUpUseCase,
  implementation: SignUpUseCase,
};
