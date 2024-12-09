// COMMON UTILS
export { AppError, ServerError, ValidationAppError } from './common/app-error';

// export { TelemetryMiddleware } from './middlewares/telemetry.middleware';
export { getSanitizedPageAndLimit } from './common/common-request.sanitizer';
export { groupBy, getDistinctValues } from './common/array-utils';
export { calculateDurationMinutes, getDayName } from './common/date-utils';
export * as deepMapObject from './common/deep-map-object';
export { EntityHelper } from './common/entity-helper';
export { IdHash } from './common/id-hash';
export { infinityPagination } from './common/infinity-pagination';
export { ripString } from './common/rip-string';
export * as validationOptions from './common/validation-options';

// DECORATORS
export { ConditionalExecution } from './decorators/conditional-execution.decorator';

// INTERCEPTORS
export { HttpExceptionFilter } from './interceptors/error-handling';
export {
  ParseOptionalEnumArrayPipe,
  ParseRequiredEnumArrayPipe,
} from './pipes/parse-array-enum.pipe';
export {
  ParseOptionalEnumPipe,
  ParseRequiredEnumPipe,
} from './pipes/parse-enum.pipe';
export {
  ParseOptionalDatePipe,
  ParseRequiredDatePipe,
} from './pipes/parse-date.pipe';
export {
  ParseOptionalIntPipe,
  ParseRequiredIntPipe,
} from './pipes/parse-int.pipe';
export {
  ParseOptionalUUIDPipe,
  ParseRequiredUUIDPipe,
} from './pipes/parse-uuid.pipe';

// TYPES

export { EntityCondition } from './types/entity-condition.type';
export { IPaginationOptions } from './types/pagination-options';
export { SortOrderType } from './types/sort-order.type';

// VALIDATORS
export { IsPastDate, IsFutureDate } from './validators/date.validator';
export { hasValue } from './validators/is-empty.validator';
