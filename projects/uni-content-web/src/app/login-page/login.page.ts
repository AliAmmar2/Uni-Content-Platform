import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './login.page.html',
  styleUrl: './login.page.scss'
})
export class LoginPage implements OnInit {
  public loginForm: FormGroup;
  public hideInputPassword = true;

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
    // this.loginForm.disable();
    // try {
    //   const token = await firstValueFrom(this.loginService.login(this.loginForm.value));
    // } catch (err: unknown) {
    //   console.error(err);
    //   if (err && typeof err === 'object' && 'status' in err) {
    //   }
    // }
    // this.loginForm.enable();
  }
}
