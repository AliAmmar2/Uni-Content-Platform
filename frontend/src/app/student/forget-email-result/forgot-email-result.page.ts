import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-forgot-email-result',
  templateUrl: './forgot-email-result.page.html',
  imports: [
    FaIconComponent
  ],
  styleUrls: ['./forgot-email-result.page.scss']
})
export class ForgotEmailResultPage implements OnInit {
  public email = '';

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.email = history.state?.email;

    if (!this.email) {
      this.router.navigate(['/login']);
    }
  }

  public backToLogin(): void {
    this.router.navigate(['/login']);
  }
}
