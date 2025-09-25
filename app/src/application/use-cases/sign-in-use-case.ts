import {
  AuthClientIdentifier,
  type AuthClient,
} from "@application/contracts/clients/auth-client";
import {
  TokenStorageIdentifier,
  type TokenStorage,
} from "@application/contracts/jwt/token-storage";
import type { SignInDTO } from "@application/dtos/sign-in.dto";
import type { BindingDefinition } from "@infra/inversify/types";
import { inject, injectable } from "inversify";

@injectable()
export class SignInUseCase {
  constructor(
    @inject(AuthClientIdentifier) private authClient: AuthClient,
    @inject(TokenStorageIdentifier) private tokenStorage: TokenStorage
  ) {}

  async execute(data: SignInDTO): Promise<void> {
    const tokens = await this.authClient.signIn(data);
    this.tokenStorage.save("access-token", tokens.accessToken);
    this.tokenStorage.save("refresh-token", tokens.refreshToken);
  }
}

export const signInUseCaseBinding: BindingDefinition = {
  token: SignInUseCase,
  implementation: SignInUseCase,
};
