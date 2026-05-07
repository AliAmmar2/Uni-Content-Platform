import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import * as _ from 'lodash';
import { MatButton } from '@angular/material/button';
import { MatToolbarRow } from '@angular/material/toolbar';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { EmptyErrorTemplateInterface, EmptyTemplateComponent, TemplateMode } from '../../empty-templates';
import { MatMultiActionsInterface } from './mat-multi-actions.interface';

@Component({
  templateUrl: './ngx-md-multi-actions-dialog.component.html',
  imports: [
    EmptyTemplateComponent,
    MatButton,
    MatToolbarRow,
    FaIconComponent
  ],
  styleUrls: ['./ngx-md-multi-actions-dialog.component.scss'],
  standalone: true
})
export class NgxMdMultiActionsDialogComponent implements OnInit {
  public errorTemplateDetails: EmptyErrorTemplateInterface;

  constructor(public dialogRef: MatDialogRef<NgxMdMultiActionsDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: MatMultiActionsInterface) {
  }

  public dismissModal() {
    this.dialogRef.close();
  }

  async ngOnInit() {
    _.each(this.data.action, action => {
      const originalHandler = action.handler;
      action.handler = () => {
        this.dismissModal();
        originalHandler();
      };
    });
    this.errorTemplateDetails = {
      faIcon: ['fal', 'triangle-exclamation'],
      mode: TemplateMode.errorTemplate,
      title: ' Something went wrong!',
      description: 'An error has occurred.  Could not load files errors!'
    };
  }
}
