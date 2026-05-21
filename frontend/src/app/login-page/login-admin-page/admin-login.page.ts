import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { LoginAdminService } from '../service/login-admin.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FontAwesomeModule
  ],
  templateUrl: './admin-login.page.html',
  styleUrls: ['./admin-login.page.scss']
})

export class AdminLoginPage {

  private readonly loginAdminService = inject(LoginAdminService);
  private readonly router = inject(Router);

  public hideInputPassword = true;

  public loginAdminForm: FormGroup;

  public togglePassword(): void {
    this.hideInputPassword = !this.hideInputPassword;
  }

  public async loginAdmin(): Promise<void> {
    if (this.loginAdminForm.invalid) {
      this.loginAdminForm.markAllAsTouched();
      return;
    }

    this.loginAdminForm.disable();

    try {
      const response = await firstValueFrom(
        this.loginAdminService.loginAdmin(
          this.loginAdminForm.value
        )
      );

      if (response?.token) {
        localStorage.setItem('accessToken', response.token);

        await this.router.navigate([
          '/admin',
          response.admin.id,
          'dashboard'
        ]);
      }

    } catch (err) {
      console.error(err);
    }

    this.loginAdminForm.enable();
  }

  constructor() {
    this.loginAdminForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    });
  }

}
