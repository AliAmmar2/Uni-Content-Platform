import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LetDirective } from '@ngrx/component';
import { select, Store } from '@ngrx/store';

import { selectStudentDetails } from '../+state/student.selector';
import { LOGGED_IN_STUDENT_KEY } from '../+state/student-details.reducer';
import { StudentActions } from '../+state/student.action';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    LetDirective
  ],
  templateUrl: './student-dashboard.page.html',
  styleUrl: './student-dashboard.page.scss'
})
export class StudentDashboardPage implements OnInit {
  private readonly store = inject(Store);
  private readonly router = inject(Router);

  protected readonly LOGGED_IN_STUDENT_KEY = LOGGED_IN_STUDENT_KEY;

  public studentDetailsSelected$ = this.store.pipe(
    select(selectStudentDetails)
  );

  ngOnInit(): void {
    this.store.dispatch(StudentActions.loadMe());
  }
}
