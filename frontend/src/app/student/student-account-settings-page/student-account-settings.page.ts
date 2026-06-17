import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { LetDirective } from '@ngrx/component';
import { select, Store } from '@ngrx/store';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

import { selectStudentDetails } from '../+state/student.selector';
import { LOGGED_IN_STUDENT_KEY } from '../+state/student-details.reducer';
import { passwordsMatchValidator } from '../../validators/passwordMatchValidator';
import { Validators } from '@angular/forms';
import { AdminActions } from '../../portal-admin/+state/admin.action';
import { NgxMdDialogService } from '../../components/mat-dialog/service/ngx-md-dialog.service';
import { ToastrService } from 'ngx-toastr';
import { StudentService } from '../service/student.service';

@Component({
  selector: 'app-student-account-settings',
  standalone: true,
  imports: [
    CommonModule,
    LetDirective,
    FaIconComponent
  ],
  templateUrl: './student-account-settings.page.html',
  styleUrl: './student-account-settings.page.scss'
})
export class StudentAccountSettingsPage {
  private readonly store = inject(Store);
  private readonly router = inject(Router);
  private toastr = inject(ToastrService);
  private ngxMdDialogService = inject(NgxMdDialogService);
  private studentService = inject(StudentService);
  protected readonly LOGGED_IN_STUDENT_KEY = LOGGED_IN_STUDENT_KEY;

  public studentDetailsSelected$ = this.store.pipe(
    select(selectStudentDetails)
  );

public navigateToForgotPassword(): void {

  const dialogRef =
    this.ngxMdDialogService.openFormActionsDialog(
      {
        title: 'Forgot Password',
        faIcon: ['fas', 'circle-question'],
        message:
          'Enter your university email and we will send a password reset link.',

        inputs: [
          {
            controlName: 'universityEmail',
            label: 'University Email',
            placeholder: 'Enter your university email',
            type: 'email',
            validators: [Validators.required],
            errorMessages: {
              required: 'University email is required'
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
            label: 'Send Email',
            color: '#c4001a',
            closeOnClick: false,
            disabledWhenInvalid: true,
            handler: (formValue) => {

              this.studentService
                .forgotPassword(
                  formValue.universityEmail
                )
                .subscribe({
                  next: (response) => {

                    this.toastr.clear();

                    this.toastr.success(
                      response?.message ||
                      'Password reset email sent',
                      'Success',
                      {
                        positionClass:
                          'toast-top-right',
                        progressBar: true,
                        closeButton: true,
                        timeOut: 3000
                      }
                    );

                    dialogRef.close();
                  },

                  error: (error) => {

                    this.toastr.clear();

                    this.toastr.error(
                      error?.error?.message ||
                      'Something went wrong',
                      'Error',
                      {
                        positionClass:
                          'toast-top-right',
                        progressBar: true,
                        closeButton: true,
                        timeOut: 4000
                      }
                    );
                  }
                });
            }
          }
        ]
      },
      { width: '430px' }
    );
}

  public getStatusClass(status: string): string {
    return `account-settings__status--${status?.toLowerCase()}`;
  }

  public getRoleLabel(role: string): string {
    return role === 'MODERATOR' ? 'Moderator' : 'Student';
  }

  public async presentUpdatePasswordModal() {
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
            closeOnClick: false,
            disabledWhenInvalid: true,
            handler: (formValue) => {
              this.studentService.updatePassword({
                oldPassword: formValue.oldPassword,
                newPassword: formValue.newPassword
              }).subscribe({
                next: (response) => {
                  this.toastr.clear();

                  this.toastr.success(
                    response?.message || 'Password updated successfully',
                    'Success',
                    {
                      positionClass: 'toast-top-right',
                      progressBar: true,
                      closeButton: true,
                      timeOut: 3000
                    }
                  );

                  dialogRef.close();

                  this.store.dispatch(AdminActions.loadMe());
                },

                error: (error) => {
                  this.toastr.clear();

                  this.toastr.error(
                    error?.error?.message || 'Something went wrong',
                    'Cannot update password',
                    {
                      positionClass: 'toast-top-right',
                      progressBar: true,
                      closeButton: true,
                      timeOut: 4000
                    }
                  );
                }
              });
            }
          }
        ]
      },
      { width: '430px' }
    );
  }
}
