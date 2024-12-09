import winston from 'winston';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const LokiTransport = require('winston-loki');

export class Logger {
  static loki: winston.Logger;

  static setup() {
    if (process.env.NODE_ENV.includes('test')) {
      return;
    }
    Logger.loki = winston.createLogger({
      // Define the transports
      exitOnError: false,
      transports: [
        new LokiTransport({
          host: process.env.MONITORING_LOKI_URL,
        }),
        ...(process.env.NODE_ENV !== 'production'
          ? [new winston.transports.Console()]
          : []),
      ],
      format: winston.format.combine(
        winston.format.errors({ stack: true }),
        winston.format.json(),
        winston.format.prettyPrint(),
      ),
    });
  }
  static async logResponseError({
    exception,
    status,
    url,
    method,
    isCritical = false,
    message,
    metaInfo,
  }: {
    exception?: any;
    status: number;
    method: string;
    url: string;
    isCritical?: boolean;
    message?: string;
    metaInfo?: any;
  }) {
    if (process.env.NODE_ENV.includes('test')) {
      return;
    }
    const timestamp = new Date().toISOString();

    try {
      console.log(`APIResponseError-${status}`, message, {
        isCritical,
        appName: process.env.APP_NAME,
        url,
        method,
        exception,
        metaInfo,
        timestamp,
      });

      // Logger.loki.log(`error`, message, {
      //   isCritical,
      //   type: 'RESPONSE_ERROR',
      //   status,
      //   appName: process.env.APP_NAME,
      //   url,
      //   method,
      //   metaInfo,
      // });
      // Logger.loki.error(exception);
    } catch (winstonError) {
      console.log(`APIResponseError-${status}`, message, {
        isCritical,
        appName: process.env.APP_NAME,
        url,
        method,
        metaInfo,
      });
      console.log('WinstonError:', winstonError);
    }
  }

  static async logError({
    error,
    message,
    isCritical = false,
    functionName,
    metaInfo,
  }: {
    error: Error;
    isCritical?: boolean;
    message?: string;
    functionName?: string;
    metaInfo?: any;
  }) {
    if (process.env.NODE_ENV.includes('test')) {
      return;
    }
    const timestamp = new Date().toISOString();
    try {
      Logger.loki.error(`CaughtError: ${message}`, {
        isCritical,
        appName: process.env.APP_NAME,
        timestamp,
        functionName,
        metaInfo,
        error,
      });
    } catch (winstonError) {
      console.log('WinstonError:', winstonError);
    }
  }

  static async logMessage({
    message,
    functionName,
    metaInfo,
    level = 'medium',
  }: {
    message: string;
    event?: string;
    functionName?: string;
    metaInfo?: any;
    level?: 'low' | 'medium' | 'high';
  }) {
    if (process.env.NODE_ENV.includes('test')) {
      return;
    }
    const timestamp = new Date().toISOString();
    if (level === 'low') {
      console.log('info', message, {
        timestamp,
        functionName,
        metaInfo,
      });
      return;
    }
    try {
      Logger.loki.log('info', message, {
        timestamp,
        appName: process.env.APP_NAME,
        functionName,
        metaInfo,
      });
    } catch (error) {
      console.log('logMessage has error', error);
    }
  }
}
