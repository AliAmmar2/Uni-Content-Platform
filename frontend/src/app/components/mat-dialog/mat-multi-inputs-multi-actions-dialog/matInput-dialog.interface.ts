import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FormGroup, ValidatorFn } from '@angular/forms';

export interface MatFormActionsDialogInterface {
  title: string;
  faIcon?: IconProp;
  message?: string;

  inputs: MatFormDialogInputInterface[];
  actions: MatFormDialogActionInterface[];

  formValidators?: ValidatorFn[];

  formErrorMessages?: {
    [key: string]: string;
  };
}

export interface MatFormDialogInputInterface {
  controlName: string;
  label: string;
  placeholder?: string;

  type?: 'text' | 'password' | 'email' | 'number';

  value?: any;

  autocomplete?: string;

  validators?: ValidatorFn[];

  errorMessages?: {
    [key: string]: string;
  };
}

export interface MatFormDialogActionInterface {
  label: string;
  color: string;
  disabledWhenInvalid?: boolean;
  closeOnClick?: boolean;
  handler: (formValue: any, form: FormGroup) => void;
}
