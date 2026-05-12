import { Component, inject, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { AdminActions } from '../+state/admin.action';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UiSwitchModule } from 'ngx-ui-switch';
import { ActivatedRoute, Router } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { ADMIN_DETAILS_KEY } from '../+state/faculty-details.reducer';
import { LetDirective } from '@ngrx/component';
import { AsyncPipe } from '@angular/common';
import { selectAdminDetails } from '../+state/admin.selector';
import { AdminStatusEnum } from '../+state/enums/admin-status.enum';
import { MatDialog } from '@angular/material/dialog';
import { NgxMdDialogService } from '../../components/mat-dialog/service/ngx-md-dialog.service';
import { LoginAdminService } from '../../login-page/service/login-admin.service';
import { passwordsMatchValidator } from '../../validators/passwordMatchValidator';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.page.html',
  imports: [
    UiSwitchModule,
    ReactiveFormsModule,
    FaIconComponent,
    LetDirective,
    AsyncPipe
  ],
  styleUrls: ['./account-settings.page.scss']
})
export class AccountSettingsPage implements OnInit {
  public store = inject(Store);
  public adminForm: FormGroup;
  public adminId: string;
  private matDialog = inject(MatDialog);
  private adminService = inject(LoginAdminService);
  private ngxMdDialogService = inject(NgxMdDialogService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  public adminDetailsSelected$ = this.store.pipe(select(selectAdminDetails));

  constructor() {
    this.adminForm = new FormGroup({
      email: new FormControl('', Validators.required),
      fullName: new FormControl('', Validators.required),
      username: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {
    this.adminDetailsSubscription();
    this.store.dispatch(AdminActions.loadMe());
    this.adminId = this.activatedRoute.parent?.snapshot.paramMap.get('id');
  }

  adminDetailsSubscription() {
    this.adminDetailsSelected$.subscribe(adminDetails => {
      if (adminDetails) {
        this.adminForm.patchValue({
          email: adminDetails[ADMIN_DETAILS_KEY]?.email,
          fullName: adminDetails[ADMIN_DETAILS_KEY]?.fullName,
          username: adminDetails[ADMIN_DETAILS_KEY]?.username,
        });
      }
      if (adminDetails.status === AdminStatusEnum.updateSuccess) {
        void this.router.navigate(['/admin', this.adminId, 'dashboard']);
      }
    });
  }

  onUpdate() {
    console.log(this.adminForm.value, this.adminId)
    this.store.dispatch(AdminActions.updateAdmin({
      admin: this.adminForm.value,
      id: this.adminId
    }))
  }

  public async presentUpdatePasswordModal(id: string) {
    const dialogRef = this.ngxMdDialogService.openFormActionsDialog(
      {
        title: 'Update Password',
        faIcon: ['fas', 'lock'],
        message: 'Enter your old password and choose a new password.',

        formValidators: [
          passwordsMatchValidator('newPassword', 'confirmPassword')
        ],

        formErrorMessages: {
          passwordsMismatch: 'Passwords do not match'
        },

        inputs: [
          {
            controlName: 'oldPassword',
            label: 'Old Password',
            placeholder: 'Enter old password',
            type: 'password',
            validators: [Validators.required],
            errorMessages: {
              required: 'Old password is required'
            }
          },
          {
            controlName: 'newPassword',
            label: 'New Password',
            placeholder: 'Enter new password',
            type: 'password',
            validators: [Validators.required, Validators.minLength(8)],
            errorMessages: {
              required: 'New password is required',
              minlength: 'New password must be at least 8 characters'
            }
          },
          {
            controlName: 'confirmPassword',
            label: 'Confirm Password',
            placeholder: 'Confirm new password',
            type: 'password',
            validators: [Validators.required],
            errorMessages: {
              required: 'Confirm password is required'
            }
          }
        ],

        actions: [
          {
            label: 'Cancel',
            color: '#64748b',
            handler: () => {
              dialogRef.close();
            }
          },
          {
            label: 'Update',
            color: '#c4001a',
            disabledWhenInvalid: true,
            handler: (formValue) => {
              this.adminService.updatePassword({
                oldPassword: formValue.oldPassword,
                newPassword: formValue.newPassword
              }).subscribe();
            }
          }
        ]
      },
      { width: '430px' }
    );
  }

  protected readonly ADMIN_DETAILS_KEY = ADMIN_DETAILS_KEY;
}
