import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatAlertDialogInterface } from './mat-alert-dialog.interface';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { MatLine } from '@angular/material/core';
import { NgxMdDialogService } from '../service/ngx-md-dialog.service';

@Component({
  templateUrl: './ngx-md-alert-dialog.component.html',
  styleUrls: ['./ngx-md-alert-dialog.component.scss'],
  providers: [NgxMdDialogService],
  imports: [
    MatDialogContent,
    FaIconComponent,
    MatLine
  ],
  standalone: true
})
export class NgxMdAlertDialogComponent {
  constructor(public dialogRef: MatDialogRef<NgxMdAlertDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: MatAlertDialogInterface) {
  }

  public close(value: boolean) {
    this.dialogRef.close(value);
  }
}
