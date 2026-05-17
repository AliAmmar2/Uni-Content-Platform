import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-check-email',
  standalone: true,
  imports: [
    FontAwesomeModule
  ],
  templateUrl: './check-email.page.html',
  styleUrls: ['./check-email.page.scss']
})

export class CheckEmailPage {

  private readonly router = inject(Router);

  public navigateToLogin(): void {
    void this.router.navigate(['/login']);
  }

}
