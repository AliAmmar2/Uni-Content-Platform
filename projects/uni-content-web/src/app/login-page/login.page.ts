import { ChangeDetectorRef, Component, isDevMode, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { Router, RouterLink } from '@angular/router';

import { LoginService } from './service/login.service';
import { firstValueFrom } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDialog } from '@angular/material/dialog';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FaIconComponent,
    RouterLink
  ],
  templateUrl: './login.page.html',
  styleUrl: './login.page.scss'
})
export class LoginPage implements OnInit {
  public loginForm: FormGroup;
  public hideInputPassword = true;
  protected readonly isDevMode = isDevMode;

  constructor(private router: Router,
              private changeDetectorRef: ChangeDetectorRef,
              private matDialog: MatDialog,
              private spinner: NgxSpinnerService,
              private loginService: LoginService) {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      universityId: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    });
  }

  get emailControl(): FormControl {
    return this.loginForm.get('email') as FormControl;
  }

  get universityIdControl(): FormControl {
    return this.loginForm.get('universityId') as FormControl;
  }

  get passwordControl(): FormControl {
    return this.loginForm.get('password') as FormControl;
  }

  ngOnInit(): void {

  }

  public async login() {
    this.loginForm.disable();
    try {
      const token = await firstValueFrom(this.loginService.login(this.loginForm.value));
      // if (token.access_token) {
      // 	await this.router.navigate(['/landing']);
      // }
    } catch (err: unknown) {
      console.error(err);
      if (err && typeof err === 'object' && 'status' in err) {
        // if (err.status > 403) {
        //   const message = this.translateService.instant('login.toast.serverNotResponding');
        //   this.toastrService.error(message);
        // }
      }
    }
    this.loginForm.enable();
  }


  private async userDoesntExist(email: string) {
    await this.spinner.show();
    await new Promise(resolve => setTimeout(resolve, 1000));
    sessionStorage.setItem('email', email);
    await this.router.navigate(['/register']);
    await this.spinner.hide();
  }
}
