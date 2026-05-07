import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatInputDialogInterface } from './matInput-dialog.interface';
import * as _ from 'lodash';
import { InputTypeEnum } from './input-type.enum';
import { TourAnchorMatMenuDirective } from 'ngx-ui-tour-md-menu';
import { MatToolbarRow } from '@angular/material/toolbar';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { MatError, MatHint } from '@angular/material/form-field';
import { TranslatePipe } from '@ngx-translate/core';
import { MatButton } from '@angular/material/button';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './ngx-md-dialog-input.html',
  styleUrls: ['./ngx-md-dialog-input.scss'],
  imports: [
    TourAnchorMatMenuDirective,
    MatToolbarRow,
    FaIconComponent,
    ReactiveFormsModule,
    MatDialogContent,
    MatHint,
    TranslatePipe,
    MatError,
    MatDialogActions,
    MatButton
  ],
  standalone: true
})
export class NgxMdDialogInput implements OnInit {
  public formDialog: FormGroup;
  public InputTypeEnum = InputTypeEnum;

  constructor(private changeDetectorRef: ChangeDetectorRef,
              private formBuilder: FormBuilder,
              private dialogRef: MatDialogRef<NgxMdDialogInput>,
              @Inject(MAT_DIALOG_DATA) public data: MatInputDialogInterface) {
    this.formDialog = this.formBuilder.group({});
  }

  ngOnInit() {
    _.each(this.data.inputList, input => {
      input.inputType = input.inputType || InputTypeEnum.text;
      const formControl = new FormControl(input.entryValue);
      formControl.setValidators([Validators.required]);
      if (input.valueRegex) {
        formControl.setValidators([Validators.pattern(input.valueRegex)]);
      }
      this.formDialog.addControl(input.name, formControl);
    });
    this.formDialog.updateValueAndValidity();
    this.changeDetectorRef.detectChanges();
  }

  public save() {
    this.dialogRef.close(this.formDialog.value);
  }

  public cancel = () => {
    this.dialogRef.close();
  };

  @HostListener('keydown.enter')
  public onEnter() {
    if (this.data.saveOnEnterKey) {
      this.save();
    }
  }

  @HostListener('keydown.esc')
  public onEsc() {
    this.cancel();
  }
}
