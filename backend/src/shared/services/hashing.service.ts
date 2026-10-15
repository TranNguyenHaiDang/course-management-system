import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { AUTH_CONSTANTS } from '../constants/auth.constant';

@Injectable()
export class HashingService {
  async hash(data: string): Promise<string> {
    return bcrypt.hash(data, AUTH_CONSTANTS.BCRYPT_SALT_ROUNDS);
  }

  async compare(plainText: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(plainText, hashed);
  }
}
