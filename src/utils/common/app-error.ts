import { HttpException, HttpStatus } from '@nestjs/common';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { hasValue } from '../validators/is-empty.validator';

export interface AppErrorInterface {
  status: HttpStatus;
  messages: { message: string; identifier: string }[];
}
export function AppError(
  i18n: I18nService,
  { status, identifiers }: { status: HttpStatus; identifiers: string[] },
): HttpException {
  return new HttpException(
    {
      status,
      messages: identifiers.map((identifier) => ({
        message: i18n.t(identifier, {
          lang: hasValue(I18nContext.current())
            ? I18nContext.current().lang
            : 'en',
        }),
        identifier,
      })),
    },
    status,
  );
}

export function ServerError({
  message,
  status,
}: {
  message: string;
  status?: HttpStatus;
}) {
  return new HttpException(
    {
      status: status ? status : HttpStatus.INTERNAL_SERVER_ERROR,
      messages: [
        {
          message,
          identifier: 'server_error',
        },
      ],
    },
    HttpStatus.INTERNAL_SERVER_ERROR,
  );
}

export function ValidationAppError({
  messages,
}: {
  messages: { message: string; identifier: string }[];
}) {
  return new HttpException(
    {
      status: HttpStatus.BAD_REQUEST,
      messages,
    },
    HttpStatus.BAD_REQUEST,
  );
}
