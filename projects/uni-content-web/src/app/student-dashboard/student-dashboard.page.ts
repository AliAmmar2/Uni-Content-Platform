import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { selectStudentDetails } from '../student/+state/student.selector';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Subscription } from 'rxjs';
import { StudentDetailsStatusEnum } from '../student/+state/enums/student-details-status.enum';
import { STUDENT_DETAILS_KEY } from '../student/+state/student.reducer';
import { LetDirective } from '@ngrx/component';
import { StudentActions } from '../student/+state/student.action';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { selectCourses } from '../courses/+state/courses.selector';
import { CoursesActions } from '../courses/+state/courses.action';
import { CoursesStatusEnum } from '../courses/+state/enums/courses-status.enum';
import { COURSES_KEY } from '../courses/+state/courses.reducer';

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
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  public studentDetailsSelected$ = this.store.pipe(select(selectStudentDetails));
  public coursesSelected$ = this.store.pipe(select(selectCourses));

  constructor() {
  }

  ngOnInit(): void {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      this.router.navigate(['/login']);
    }
    else{
      console.log('token exists',accessToken);
    }
    this.studentId = this.activatedRoute.snapshot.paramMap.get('universityId');
    console.log(this.studentId);
    if (this.studentId) {
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
            const studentDetails = studentDetailsState[STUDENT_DETAILS_KEY];
            this.CoursesSubscription(studentDetails.academicYear, studentDetails.calendarYear);
          }
        }
      })
    );
  }

  CoursesSubscription(academicYear: number, calendarYear: number) {
    console.log(academicYear, calendarYear);
    this.store.dispatch(CoursesActions.loadCourses({ academicYear, calendarYear }))
  }

  protected readonly CoursesStatusEnum = CoursesStatusEnum;
  protected readonly COURSES_KEY = COURSES_KEY;
}
