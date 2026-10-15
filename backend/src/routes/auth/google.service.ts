import { Injectable } from '@nestjs/common';

@Injectable()
export class GoogleService {
  async verifyGoogleToken(token: string) {
    // Stub / Helper cho luồng tích hợp Google Authentication
    return {
      success: true,
      email: 'user@gmail.com',
      name: 'Google User',
    };
  }
}
