import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function facultyCodeValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {

    const value = control.value;

    if (!value) {
      return null;
    }

    // 2 uppercase letters - 2 digits
    const regex = /^[A-Z]{2}-\d{2}$/;

    return regex.test(value)
      ? null
      : {
        invalidFacultyCode: true
      };
  };
}
