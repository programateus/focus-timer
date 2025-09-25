import { inject, injectable } from "inversify";

import {
  type TokenStorage,
  TokenStorageIdentifier,
} from "@application/contracts/jwt/token-storage";
import Cookies from "universal-cookie";
import type { BindingDefinition } from "@infra/inversify/types";

@injectable()
export class CookieTokenStorage implements TokenStorage {
  constructor(@inject(Cookies) private readonly cookie: Cookies) {}

  save(name: string, value: string): void {
    this.cookie.set(name, value, {
      domain: "localhost",
      secure: import.meta.env.MODE === "production",
      httpOnly: false,
      sameSite: import.meta.env.MODE === "production" ? "none" : "strict",
      path: "/",
    });
  }

  get(name: string): string | null {
    return this.cookie.get(name);
  }

  remove(name: string): void {
    this.cookie.remove(name);
  }
}

export const cookieTokenStorageBinding: BindingDefinition = {
  token: TokenStorageIdentifier,
  implementation: CookieTokenStorage,
};
