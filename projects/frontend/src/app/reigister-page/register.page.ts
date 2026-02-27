import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './register.page.html',
  styleUrl: './register.page.scss'
})
export class RegisterPage implements OnInit {
  public registerForm: FormGroup;
  public hideInputPassword = true;

  constructor() {
    this.registerForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      fullName: new FormControl('', [Validators.required]),
      universityId: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      confirmPassword: new FormControl('', [Validators.required]),
      role: new FormControl('STUDENT')
    },
      { validators: this.passwordMatchValidator } );
  }


  ngOnInit(): void {

  }

  passwordMatchValidator(form: AbstractControl) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;

    if (password !== confirmPassword) {
      form.get('confirmPassword')?.setErrors({ passwordMismatch: true });
    } else {
      form.get('confirmPassword')?.setErrors(null);
    }

    return null;
  }


  public async register() {
    // this.registerForm.disable();
    // try {
    //   const token = await firstValueFrom(this.loginService.register(this.registerForm.value));
    // } catch (err: unknown) {
    //   console.error(err);
    //   if (err && typeof err === 'object' && 'status' in err) {
    //   }
    // }
    // this.registerForm.enable();
  }
}
