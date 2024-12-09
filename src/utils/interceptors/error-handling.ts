import {
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Logger } from '../common/logger';
import { generateNewUUID } from '../common/generate-random-key';
import { BaseExceptionFilter } from '@nestjs/core';

@Catch()
export class HttpExceptionFilter extends BaseExceptionFilter {
  async catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const trackId = generateNewUUID();

    try {
      await Logger.logResponseError({
        exception,
        isCritical: status >= 500,
        status,
        url: request.url,
        method: request.method,
        metaInfo: {
          trackId,
          requestBody: request.body,
          requestQuery: request.query,
          requestParams: request.params,
          ip: request.ip,
        },
      });
    } catch (error) {
      // nothing to do!
    }

    const exceptionResponse =
      exception instanceof HttpException
        ? (exception.getResponse() as object)
        : {};

    response.status(status).json({
      trackId,
      ...exceptionResponse,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
