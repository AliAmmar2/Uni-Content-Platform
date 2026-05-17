import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ToastrService } from 'ngx-toastr';

import { LoginService } from '../login-page/service/login.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FontAwesomeModule
  ],
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss']
})

export class RegisterPage {

  private readonly router = inject(Router);
  private readonly toastrService = inject(ToastrService);
  private readonly loginService = inject(LoginService);

  public showPassword = false;
  public showConfirmPassword = false;

  public registerForm = new FormGroup({
    universityEmail: new FormControl('', [
      Validators.required,
      Validators.email
    ]),
    universityId: new FormControl('', [
      Validators.required
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8)
    ]),
    confirmPassword: new FormControl('', [
      Validators.required,
      Validators.minLength(8)
    ])
  });

  public togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  public toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  public onRegister(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const formValue = this.registerForm.getRawValue();

    if (formValue.password !== formValue.confirmPassword) {
      this.toastrService.error('Passwords do not match');
      return;
    }

    this.loginService.register({
      universityEmail: formValue.universityEmail ?? '',
      universityId: formValue.universityId ?? '',
      password: formValue.password ?? '',
      confirmPassword: formValue.confirmPassword ?? ''
    }).subscribe({
      next: (res) => {
        this.toastrService.success(
          res.message || 'Registration successful. Please verify your email.'
        );

        void this.router.navigate(['/check-email']);
      },

      error: (err) => {
        this.toastrService.error(
          err.error?.message || 'Registration failed'
        );
      }
    });
  }

  public navigateToLogin(): void {
    void this.router.navigate(['/login']);
  }

}
