import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { selectStudentDetails } from '../student/+state/student.selector';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { Subscription } from 'rxjs';
import { StudentDetailsStatusEnum } from '../student/+state/enums/student-details-status.enum';
import { STUDENT_DETAILS_KEY } from '../student/+state/student.reducer';
import { LetDirective } from '@ngrx/component';
import { StudentActions } from '../student/+state/student.action';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LetDirective,
    RouterLink,
    RouterLinkActive,
    FaIconComponent
  ],
  templateUrl: './student-dashboard.page.html',
  styleUrl: './student-dashboard.page.scss'
})
export class StudentDashboardPage implements OnInit {
  public studentId: string;
  private subscription$ = new Subscription();
  protected readonly StudentDetailsStatusEnum = StudentDetailsStatusEnum;
  protected readonly STUDENT_DETAILS_KEY = STUDENT_DETAILS_KEY;
  private store = inject(Store);
  private activatedRoute = inject(ActivatedRoute);
  public studentDetailsSelected$ = this.store.pipe(select(selectStudentDetails));

  constructor() {
  }

  ngOnInit(): void {
    this.studentId = this.activatedRoute.snapshot.paramMap.get('universityId');
    console.log(this.studentId);
    if(this.studentId){
      this.store.dispatch(StudentActions.loadStudentDetails({ studentId: this.studentId }))
    }
    this.studentDetailsSubscription();
  }

  public studentDetailsSubscription() {
    this.subscription$.add(
      this.studentDetailsSelected$.subscribe({
        next: async (studentDetailsState) => {
          if (studentDetailsState?.status === StudentDetailsStatusEnum.loadDetailsSuccess) {
            console.log('load success');
          }
        }
      })
    );
  }
}
