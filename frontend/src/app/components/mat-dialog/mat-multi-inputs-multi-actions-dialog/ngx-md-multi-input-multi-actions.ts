import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogActions } from '@angular/material/dialog';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { MatButton } from '@angular/material/button';
import { MatError } from '@angular/material/form-field';
import { KeyValuePipe } from '@angular/common';

import {
  MatFormActionsDialogInterface,
  MatFormDialogActionInterface
} from './matInput-dialog.interface';

@Component({
  selector: 'app-ngx-md-form-actions-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FaIconComponent,
    MatButton,
    MatDialogActions,
    MatError,
    KeyValuePipe
  ],
  templateUrl: './ngx-md-multi-input-multi-actions.html',
  styleUrls: ['./ngx-md-multi-input-multi-actions.scss']
})
export class NgxMdMultiInputMultiActions implements OnInit {
  public form = new FormGroup({});
  public passwordVisibility: Record<string, boolean> = {};

  constructor(
      public dialogRef: MatDialogRef<NgxMdMultiInputMultiActions>,
      @Inject(MAT_DIALOG_DATA) public data: MatFormActionsDialogInterface
  ) {}

  ngOnInit(): void {
    this.data.inputs.forEach(input => {
      this.form.addControl(
          input.controlName,
          new FormControl(input.value ?? '', input.validators ?? [])
      );
    });

    if (this.data.formValidators?.length) {
      this.form.setValidators(this.data.formValidators);
    }

    this.form.updateValueAndValidity();
  }

  public closeModal(): void {
    this.dialogRef.close();
  }

  public togglePasswordVisibility(controlName: string): void {
    this.passwordVisibility[controlName] =
        !this.passwordVisibility[controlName];
  }

  public runAction(action: MatFormDialogActionInterface): void {
    this.form.markAllAsTouched();
    this.form.updateValueAndValidity();

    if (action.disabledWhenInvalid && this.form.invalid) {
      return;
    }

    action.handler(this.form.value, this.form);

    this.form.updateValueAndValidity();

    if (this.form.invalid) {
      return;
    }

    if (action.closeOnClick !== false) {
      this.dialogRef.close(this.form.value);
    }
  }
}
