import { Injectable } from '@nestjs/common';
import * as validator from 'validator';

@Injectable()
export class EmailValidationService {
  isEmailValid(email: string): boolean {
    return validator.default.isEmail(email);
  }
}
