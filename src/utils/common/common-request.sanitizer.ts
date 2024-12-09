import { hasValue } from '../validators/is-empty.validator';

export function getSanitizedPageAndLimit(rawRequest: any): {
  limit: number;
  page: number;
  maxLimit?: number;
} {
  const { limit, page, maxLimit } = rawRequest;

  const safeMaxLimit = hasValue(maxLimit) ? parseInt(maxLimit) : 50;
  const sanitizedLimit =
    limit > 0 && limit < safeMaxLimit ? limit : safeMaxLimit;
  const sanitizedPage = page > 0 ? page : 1;

  return {
    limit: sanitizedLimit,
    page: sanitizedPage,
  };
}
