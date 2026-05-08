import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatRadioButtonGroupDialogInterface } from './mat-radio-button-group-dialog.interface';
import { MatToolbar, MatToolbarRow } from '@angular/material/toolbar';
import { MatIcon } from '@angular/material/icon';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { MatButton } from '@angular/material/button';

@Component({
  templateUrl: './ngx-md-radio-button-group-dialog.html',
  styleUrls: ['./ngx-md-radio-button-group-dialog.scss'],
  imports: [
    MatIcon,
    ReactiveFormsModule,
    MatRadioGroup,
    MatRadioButton,
    MatButton,
    MatToolbarRow,
    MatToolbar
  ],
  standalone: true
})
export class NgxMdRadioButtonGroupDialog implements OnInit {
  formDialog: FormGroup;

  constructor(private formBuilder: FormBuilder,
              public dialogRef: MatDialogRef<NgxMdRadioButtonGroupDialog>,
              @Inject(MAT_DIALOG_DATA) public data: MatRadioButtonGroupDialogInterface) {
  }

  ngOnInit() {
    this.formDialog = this.formBuilder.group({
      value: this.data.defaultValue
    });
  }

  submit() {
    return this.dialogRef.close(this.formDialog.value.value);
  }

  public close() {
    return this.dialogRef.close(null);
  }
}
