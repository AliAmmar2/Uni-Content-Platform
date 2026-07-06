import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ToastrService } from 'ngx-toastr';

import { StudentService } from '../student/service/student.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FontAwesomeModule
  ],
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss']
})
export class ResetPasswordPage {

  private readonly route = inject(ActivatedRoute);
  public readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly studentService = inject(StudentService);
  private readonly toastr = inject(ToastrService);

  public hideNewPassword = true;
  public hideConfirmPassword = true;

  public token = this.route.snapshot.queryParamMap.get('token');

  public form = this.fb.group({
    newPassword: ['', [
      Validators.required,
      Validators.minLength(8)
    ]],
    confirmPassword: ['', [
      Validators.required
    ]]
  });

  public toggleNewPassword(): void {
    this.hideNewPassword = !this.hideNewPassword;
  }

  public toggleConfirmPassword(): void {
    this.hideConfirmPassword = !this.hideConfirmPassword;
  }

  public submit(): void {

    if (this.form.invalid) {
      this.form.markAllAsTouched();

      this.toastr.error(
        'Please fill all required fields correctly.'
      );

      return;
    }

    const newPassword = this.form.value.newPassword;
    const confirmPassword = this.form.value.confirmPassword;

    if (newPassword !== confirmPassword) {
      this.toastr.error('Passwords do not match');
      return;
    }

    if (!this.token) {
      this.toastr.error('Invalid or missing token');
      return;
    }

    this.form.disable();

    this.studentService.resetPassword({
      token: this.token,
      password: newPassword!
    }).subscribe({
      next: () => {
        this.toastr.success('Password reset successful');

        void this.router.navigate(['/login']);
      },

      error: (err) => {
        this.toastr.error(
          err?.error?.message || 'Reset failed'
        );

        this.form.enable();
      }
    });
  }
}
