import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { LoginService } from '../../login-page/service/login.service';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [
    CommonModule,
    FontAwesomeModule
  ],
  templateUrl: './verify-email.page.html',
  styleUrls: ['./verify-email.page.scss']
})
export class VerifyEmailPage implements OnInit {

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly loginService = inject(LoginService);
  private readonly cdr = inject(ChangeDetectorRef);

  public isLoading = true;
  public isVerified = false;
  public hasError = false;

  public message = 'Please wait while we verify your email address.';

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');

    if (!token) {
      this.isLoading = false;
      this.hasError = true;
      this.message = 'Invalid verification link.';
      this.cdr.detectChanges();
      return;
    }

    this.loginService.verifyEmail(token).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.isVerified = true;
        this.hasError = false;
        this.message = res.message || 'Email verified successfully.';

        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isLoading = false;
        this.isVerified = false;
        this.hasError = true;
        this.message = err.error?.message || 'Email verification failed.';

        this.cdr.detectChanges();
      }
    });
  }

  public navigateToLogin(): void {
    void this.router.navigate(['/login']);
  }

}
