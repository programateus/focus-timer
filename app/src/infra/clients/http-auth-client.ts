import { inject, injectable } from "inversify";

import type { SignUpDTO } from "@application/dtos/sign-up-dto";
import {
  AuthClientIdentifier,
  type AuthClient,
  type AuthTokens,
} from "@application/contracts/clients/auth-client";
import {
  HttpClientIdentifier,
  type HttpClient,
} from "@application/contracts/http-client";
import type { SignInDTO } from "@application/dtos/sign-in.dto";

@injectable()
export class HttpAuthClient implements AuthClient {
  constructor(@inject(HttpClientIdentifier) private httpClient: HttpClient) {}

  signIn(data: SignInDTO): Promise<AuthTokens> {
    return this.httpClient.post<AuthTokens>("/api/auth/sign-in", data);
  }

  signUp(data: SignUpDTO): Promise<AuthTokens> {
    return this.httpClient.post<AuthTokens>("/api/auth/sign-up", data);
  }
}

export const httpAuthClientBinding = {
  token: AuthClientIdentifier,
  implementation: HttpAuthClient,
};
