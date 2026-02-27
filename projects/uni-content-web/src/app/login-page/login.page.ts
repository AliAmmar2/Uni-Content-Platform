import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { LoginService } from './service/login.service';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './login.page.html',
  styleUrl: './login.page.scss'
})
export class LoginPage implements OnInit {
  public loginForm: FormGroup;
  public hideInputPassword = true;
  private loginService = inject(LoginService);
  private router = inject(Router);

  constructor() {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      universityId: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    });
  }


  ngOnInit(): void {

  }

  public async login() {
    this.loginForm.disable();
    try {
      const student = await firstValueFrom(this.loginService.login(this.loginForm.value));
      if(student){
        this.router.navigate(['/students', student.universityId]);
      }
    } catch (err: unknown) {
      console.error(err);
      if (err && typeof err === 'object' && 'status' in err) {
      }
    }
    this.loginForm.enable();
  }
}
