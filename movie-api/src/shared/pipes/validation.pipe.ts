import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToInstance(metatype, value);
    const errors = await validate(object, {
      whitelist: true,
      forbidNonWhitelisted: true,
      validationError: { target: false },
    });
    if (errors.length > 0) {
      const errorMessages = this.flattenValidationErrors(errors);
      throw new BadRequestException({
        message: 'Validation failed',
        errors: errorMessages,
      });
    }
    return object;
  }

  private toValidate(metatype: any): boolean {
    const types: any[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }

  private flattenValidationErrors(errors: any[]): string[] {
    const messages: string[] = [];
    errors.forEach((error) => {
      if (error.constraints) {
        Object.values(error.constraints).forEach((message) =>
          messages.push(message as string),
        );
      }
      if (error.children && error.children.length > 0) {
        messages.push(...this.flattenValidationErrors(error.children));
      }
    });
    return messages;
  }
}
