import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HttpErrorResponse } from '@angular/common/http';

import { ToastrService } from 'ngx-toastr';

import { LoginService } from '../service/login.service';
import { NgxMdDialogService } from '../../components/mat-dialog/service/ngx-md-dialog.service';
import { StudentService } from '../../student/service/student.service';

@Component({
  selector: 'app-student-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FontAwesomeModule
  ],
  templateUrl: './student-login.page.html',
  styleUrls: ['./student-login.page.scss']
})
export class StudentLoginPage {

  private readonly loginService = inject(LoginService);
  private readonly router = inject(Router);
  private readonly toastrService = inject(ToastrService);

  private readonly ngxMdDialogService = inject(NgxMdDialogService);
  private readonly studentService = inject(StudentService);

  public hideInputPassword = true;

  public loginStudentForm: FormGroup;

  constructor() {

    this.loginStudentForm = new FormGroup({
      universityEmail: new FormControl('', [
        Validators.required,
        Validators.email
      ]),

      universityId: new FormControl('', [
        Validators.required
      ]),

      password: new FormControl('', [
        Validators.required
      ])
    });

  }

  public togglePassword(): void {
    this.hideInputPassword = !this.hideInputPassword;
  }

  public async loginStudent(): Promise<void> {

    if (this.loginStudentForm.invalid) {

      this.loginStudentForm.markAllAsTouched();

      this.toastrService.error(
        'Please fill all required fields correctly.'
      );

      return;
    }

    this.loginStudentForm.disable();

    try {

      const response = await firstValueFrom(
        this.loginService.login(this.loginStudentForm.value)
      );

      if (response?.accessToken) {

        localStorage.setItem(
          'accessToken',
          response.accessToken
        );

        localStorage.setItem(
          'refreshToken',
          response.refreshToken
        );

        this.toastrService.success(
          'Login successful'
        );

        await this.router.navigate([
          '/students',
          response.user.universityId
        ]);
      }

    } catch (err) {

      console.error(err);

      const error = err as HttpErrorResponse;

      const errorMessage =
        error?.error?.message ||
        'Something went wrong. Please try again.';

      this.toastrService.error(errorMessage);

    } finally {

      this.loginStudentForm.enable();

    }
  }
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
                  .forgotPassword(formValue.universityEmail)
                  .subscribe({
                    next: (response) => {
                      this.toastrService.clear();

                      this.toastrService.success(
                        response?.message ||
                        'Password reset email sent',
                        'Success',
                        {
                          positionClass: 'toast-top-right',
                          progressBar: true,
                          closeButton: true,
                          timeOut: 3000
                        }
                      );

                      dialogRef.close();
                    },

                    error: (error) => {
                      this.toastrService.clear();

                      this.toastrService.error(
                        error?.error?.message ||
                        'Something went wrong',
                        'Error',
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
  public navigateToRegister(): void {
    void this.router.navigate(['/register']);
  }
}
