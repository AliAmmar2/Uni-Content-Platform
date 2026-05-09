import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarRow } from '@angular/material/toolbar';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatAlertWithButtonsInterface } from './interface/mat-alert-with-buttons-dialog.interface';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { MatButton } from '@angular/material/button';

@Component({
	selector: 'ngx-md-alert-dialog-with-buttons',
	standalone: true,
  imports: [CommonModule, MatToolbarRow, FaIconComponent, MatButton],
	templateUrl: './ngx-md-alert-with-buttons.dialog.html',
	styleUrl: './ngx-md-alert-with-buttons.dialog.scss'
})
export class NgxMdAlertWithButtonsDialog implements OnInit {
	constructor(public dialogRef: MatDialogRef<NgxMdAlertWithButtonsDialog>,
	            @Inject(MAT_DIALOG_DATA) public data: MatAlertWithButtonsInterface) {
	}

	public dismissModal() {
		this.dialogRef.close();
	}

	async ngOnInit() {
		const confirmOriginalHandler = this.data.confirmButton.handler;
		this.data.confirmButton.handler = () => {
			this.dismissModal();
			confirmOriginalHandler();
		};
		this.data.dismissButton.handler = () => {
			this.dismissModal();
		};
	}
}
