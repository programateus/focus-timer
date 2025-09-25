import * as bcrypt from 'bcryptjs';
import { Injectable, Provider } from '@nestjs/common';

import {
  PasswordHasher,
  PasswordHasherIdentifier,
} from '@application/contracts/hasher/password-hasher';

@Injectable()
export class BcryptAdapter implements PasswordHasher {
  compare(value: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(value, hashed);
  }

  async hash(value: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(value, salt);
  }
}

export const bcryptAdapterProvider: Provider = {
  provide: PasswordHasherIdentifier,
  useClass: BcryptAdapter,
};
