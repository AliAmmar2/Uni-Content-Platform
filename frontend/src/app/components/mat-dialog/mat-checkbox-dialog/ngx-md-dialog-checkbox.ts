import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';

import { MatCheckboxDialogInterface, MatCheckboxInterface } from './mat-checkbox-dialog.interface';
import { MatToolbar, MatToolbarRow } from '@angular/material/toolbar';
import { MatIcon } from '@angular/material/icon';
import { MatDivider } from '@angular/material/divider';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatButton } from '@angular/material/button';
import { UiSwitchModule } from 'ngx-ui-switch';
import { CheckboxStateEnum } from '../enum/checkbox-state.enum';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './ngx-md-dialog-checkbox.html',
  styleUrls: ['./ngx-md-dialog-checkbox.scss'],
  imports: [
    MatIcon,
    MatDialogContent,
    MatDivider,
    MatCheckbox,
    MatDialogActions,
    MatButton,
    UiSwitchModule,
    MatToolbarRow,
    MatToolbar
  ],
  standalone: true
})
export class NgxMdDialogCheckbox {
  public CheckboxStateEnum = CheckboxStateEnum;

  constructor(public dialogRef: MatDialogRef<NgxMdDialogCheckbox>,
              @Inject(MAT_DIALOG_DATA) public data: MatCheckboxDialogInterface) {
  }

  public cancel() {
    this.dialogRef.close(false);
  }

  public save() {
    this.dialogRef.close(this.data.checkboxList);
  }

  public changeState(control: MatCheckboxInterface) {
    if (control.state === CheckboxStateEnum.checked) {
      control.state = CheckboxStateEnum.unchecked;
      return;
    }
    if (control.state === CheckboxStateEnum.unchecked) {
      control.state = CheckboxStateEnum.undeterminated;
      return;
    }
    if (control.state === CheckboxStateEnum.undeterminated) {
      control.state = CheckboxStateEnum.checked;
      return;
    }
  }
}
