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

  public navigateToRegister(): void {
    void this.router.navigate(['/register']);
  }
}
