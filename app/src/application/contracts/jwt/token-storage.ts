import type { ServiceIdentifier } from "inversify";

export interface TokenStorage {
  save(name: string, value: string): void;
  get(name: string): string | null;
  remove(name: string): void;
}

export const TokenStorageIdentifier: ServiceIdentifier<TokenStorage> =
  "TokenStorageIdentifier";
