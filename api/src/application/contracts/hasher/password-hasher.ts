import { InjectionToken } from '@nestjs/common';

export interface PasswordHasher {
  hash(value: string): Promise<string>;
  compare(value: string, hashed: string): Promise<boolean>;
}

export const PasswordHasherIdentifier: InjectionToken<PasswordHasher> =
  'HasherToken';
