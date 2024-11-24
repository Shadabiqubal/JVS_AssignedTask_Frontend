import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class CustomValidatorsService {

  constructor() { }

  noNumericValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.trim();
      if (!value) return null;
      const forbidden = /\d/.test(control.value);
      return forbidden ? { numericNotAllowed: true } : null;
    };
  }
  noAlphanumericValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.trim();
      if (!value) return null;
      const hasAlphaNumeric = /[a-zA-Z]/.test(value);
      return hasAlphaNumeric ? { alphanumericNotAllowed: true } : null;
    };
  }

  pinCodeValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.trim();
      if (!value) return null;
      const isValidPinCode = /^[0-9]{6}$/.test(value);
      return !isValidPinCode ? { invalidPinCode: true } : null;
    };
  }
}
