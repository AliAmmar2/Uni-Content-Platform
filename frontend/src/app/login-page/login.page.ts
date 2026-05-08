import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { LoginService } from './service/login.service';
import { LoginAdminService } from './service/login-admin.service';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FontAwesomeModule],
  templateUrl: './login.page.html',
  styleUrl: './login.page.scss'
})
export class LoginPage implements OnInit {

  activeTab: 'student' | 'admin' = 'student';

  public loginStudentForm: FormGroup;
  public loginAdminForm: FormGroup;

  public hideInputPassword = true;

  private loginService = inject(LoginService);
  private loginAdminService = inject(LoginAdminService);
  private router = inject(Router);

  constructor() {

    this.loginStudentForm = new FormGroup({
      universityEmail: new FormControl('', [Validators.required, Validators.email]),
      universityId: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    });

    this.loginAdminForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    });

  }

  ngOnInit(): void {
  }

  // ✅ TAB SWITCH (IMPORTANT FIX)
  switchTab(tab: 'student' | 'admin') {
    this.activeTab = tab;

    // reset both forms when switching
    this.loginStudentForm.reset();
    this.loginAdminForm.reset();

    this.hideInputPassword = true;
  }

  // STUDENT LOGIN
  public async loginStudent() {
    this.loginStudentForm.disable();

    try {
      const response = await firstValueFrom(
        this.loginService.login(this.loginStudentForm.value)
      );

      if (response?.accessToken) {
        localStorage.setItem('accessToken', response.accessToken);
        localStorage.setItem('refreshToken', response.refreshToken);

        this.router.navigate(['/students', response.user.universityId]);
      }

    } catch (err) {
      console.error(err);
    }

    this.loginStudentForm.enable();
  }

  // ADMIN LOGIN
  public async loginAdmin() {
    this.loginAdminForm.disable();

    try {
      const response = await firstValueFrom(
        this.loginAdminService.loginAdmin(this.loginAdminForm.value)
      );

      if (response?.token) {
        localStorage.setItem('accessToken', response.token);
        console.log(response.token);
        this.router.navigate(['/admin', response.admin.id]);
      }

    } catch (err) {
      console.error(err);
    }

    this.loginAdminForm.enable();
  }
}
