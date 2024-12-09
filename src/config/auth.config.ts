import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
  adminSecret: process.env.AUTH_JWT_SECRET || 'secret',
  userSecret: process.env.AUTH_JWT_SECRET_USER || 'secret2',
  sessionTTLInMinutes: process.env.AUTH_SESSION_TTL_MINUTES && parseInt(process.env.AUTH_SESSION_TTL_MINUTES) || 30,
  ottDigitsCount: process.env.OTT_DIGITS_COUNT && parseInt(process.env.OTT_DIGITS_COUNT) || 6,
  ottExpireDurationMinutes: process.env.OTT_EXPIRATION_MINUTES && parseInt(process.env.OTT_EXPIRATION_MINUTES) || 5,
  expires: process.env.AUTH_JWT_TOKEN_EXPIRES_IN || '7d',
  refreshTokenExpires: process.env.AUTH_JWT_REFRESH_TOKEN_EXPIRES_IN || '30d',
  superuserEmail: process.env.SUPERUSER_EMAIL || 'superuser@test.com',
  superuserPassword: process.env.SUPERUSER_PASSWORD || '123456',
  thirdPartyCredentials: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    },
    apple: {
      privateKey: process.env.APPLE_PRIVATE_KEY || '',
      clientSecret: process.env.APPLE_CLIENT_SECRET || '',
      teamId: process.env.APPLE_TEAM_ID || '',
      keyId: process.env.APPLE_KEY_ID || '',
      clientId: process.env.APPLE_CLIENT_ID || ''
    }
  }
}));
