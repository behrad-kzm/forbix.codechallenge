import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsPastDate(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isPastDate',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          return typeof value === 'string' && new Date(value) < new Date();
        },
        defaultMessage() {
          return 'Date must be in the past';
        },
      },
    });
  };
}

export function IsFutureDate(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isPastDate',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          return typeof value === 'string' && new Date(value) > today;
        },
        defaultMessage() {
          return 'Date must be in the past';
        },
      },
    });
  };
}
