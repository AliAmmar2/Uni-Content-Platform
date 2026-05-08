import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NgxMdMultiActionsDialogComponent } from '../mat-mutli-actions-dialog/ngx-md-multi-actions-dialog.component';
import { MatMultiActionsInterface } from '../mat-mutli-actions-dialog/mat-multi-actions.interface';
import { NgxMdDialogInput } from '../mat-input-dialog/ngx-md-dialog-input';
import { MatInputDialogInterface } from '../mat-input-dialog/matInput-dialog.interface';
import { NgxMdImagePicker } from '../mat-image-picker/ngx-md-image-picker';


@Injectable({ providedIn: 'root' })
export class NgxMdDialogService {
  constructor(public dialog: MatDialog) {
  }

  public presentImageUploadDialog(dialogConfig?: { width?: string, height?: string, panelClass?: string }) {
    const config = {
      width: dialogConfig?.width || '650px',
      height: dialogConfig?.height,
      panelClass: dialogConfig?.panelClass
    };
    return this.dialog.open(NgxMdImagePicker, config);
  }

  public openMatInputListDialog(matInputDialogData: MatInputDialogInterface,
                                dialogConfig?: {
                                  width?: string,
                                  height?: string,
                                  panelClass?: string,
                                  disableClose?: boolean

                                }) {
    const config = {
      data: matInputDialogData,
      width: dialogConfig?.width,
      height: dialogConfig?.height,
      panelClass: dialogConfig?.panelClass,
      disableClose: dialogConfig?.disableClose
    };
    return this.dialog.open(NgxMdDialogInput, config);
  }

  public openMultiActionsDialog(matYesNoDialogData: MatMultiActionsInterface,
                                dialogSize?: { height?: string, width: string, disableClose?: boolean }) {
    return this.dialog.open(NgxMdMultiActionsDialogComponent,
      {
        data: matYesNoDialogData,
        height: dialogSize?.height,
        width: dialogSize?.width,
        disableClose: dialogSize?.disableClose || true
      });
  }
}
