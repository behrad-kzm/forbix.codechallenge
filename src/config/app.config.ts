import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  nodeEnv: process.env.NODE_ENV,
  name: process.env.APP_NAME,
  envStage: process.env.ENV_STAGE,
  workingDirectory: process.env.PWD || process.cwd(),
  backendDomain: process.env.BACKEND_DOMAIN,
  clientUrl: process.env.APP_CLIENT_URL,
  port:
    parseInt(process.env.APP_PORT || process.env.PORT || '3000', 10) || 3000,
  apiPrefix: process.env.API_PREFIX || 'api',
  fallbackLanguage: process.env.APP_FALLBACK_LANGUAGE || 'en',
  headerLanguage: process.env.APP_HEADER_LANGUAGE || 'x-custom-lang',
}));
