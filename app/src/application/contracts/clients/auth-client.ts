import type { ServiceIdentifier } from "inversify";

import type { SignInDTO } from "@application/dtos/sign-in.dto";
import type { SignUpDTO } from "@application/dtos/sign-up-dto";

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

export interface AuthClient {
  signIn(data: SignInDTO): Promise<AuthTokens>;
  signUp(data: SignUpDTO): Promise<AuthTokens>;
}

export const AuthClientIdentifier: ServiceIdentifier<AuthClient> =
  Symbol.for("AuthClient");
