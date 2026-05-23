import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { LetDirective } from '@ngrx/component';
import { select, Store } from '@ngrx/store';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

import { selectStudentDetails } from '../+state/student.selector';
import { LOGGED_IN_STUDENT_KEY } from '../+state/student-details.reducer';

@Component({
  selector: 'app-student-account-settings',
  standalone: true,
  imports: [
    CommonModule,
    LetDirective,
    FaIconComponent
  ],
  templateUrl: './student-account-settings.page.html',
  styleUrl: './student-account-settings.page.scss'
})
export class StudentAccountSettingsPage {
  private readonly store = inject(Store);
  private readonly router = inject(Router);

  protected readonly LOGGED_IN_STUDENT_KEY = LOGGED_IN_STUDENT_KEY;

  public studentDetailsSelected$ = this.store.pipe(
    select(selectStudentDetails)
  );

  public navigateToChangePassword(): void {
    void this.router.navigate(['change-password']);
  }

  public navigateToForgotPassword(): void {
    void this.router.navigate(['/forgot-password']);
  }

  public getStatusClass(status: string): string {
    return `account-settings__status--${status?.toLowerCase()}`;
  }

  public getRoleLabel(role: string): string {
    return role === 'MODERATOR' ? 'Moderator' : 'Student';
  }
}
