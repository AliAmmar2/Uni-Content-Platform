import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { select, Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { LetDirective } from '@ngrx/component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

import {
  faBookOpen,
  faBuildingColumns,
  faClock,
  faEllipsisVertical,
  faGraduationCap,
  faGrip,
  faList,
  faSpinner,
  faStar
} from '@fortawesome/free-solid-svg-icons';

import { selectStudentDetails } from '../+state/student.selector';
import { StudentActions } from '../+state/student.action';
import { StudentDetailsStatusEnum } from '../+state/enums/student-details-status.enum';
import { LOGGED_IN_STUDENT_KEY, STUDENT_DETAILS_KEY } from '../+state/student-details.reducer';

import { selectAllCourses } from '../../courses/+state/courses.selector';
import { CourseActions } from '../../courses/+state/courses.action';
import { CourseStatusEnum } from '../../courses/+state/enums/course-status.enum';
import { COURSE_KEY } from '../../courses/+state/course.reducer';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    LetDirective,
    FaIconComponent
  ],
  templateUrl: './student-courses.page.html',
  styleUrl: './student-courses.page.scss'
})
export class StudentCoursesPage implements OnInit, OnDestroy {

  private readonly store = inject(Store);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);

  private readonly subscription$ = new Subscription();

  public studentId: string | null = null;

  public selectedSemester: 'SEM1' | 'SEM2' | 'all' = 'all';

  public viewMode: 'grid' | 'list' = 'grid';

  public studentDetailsSelected$ = this.store.pipe(
    select(selectStudentDetails)
  );

  public coursesSelected$ = this.store.pipe(
    select(selectAllCourses)
  );

  protected readonly STUDENT_DETAILS_KEY = STUDENT_DETAILS_KEY;
  protected readonly LOGGED_IN_STUDENT_KEY = LOGGED_IN_STUDENT_KEY;

  protected readonly COURSES_KEY = COURSE_KEY;

  protected readonly StudentDetailsStatusEnum = StudentDetailsStatusEnum;
  protected readonly CoursesStatusEnum = CourseStatusEnum;

  // icons
  protected readonly faBuildingColumns = faBuildingColumns;
  protected readonly faGraduationCap = faGraduationCap;
  protected readonly faBookOpen = faBookOpen;
  protected readonly faClock = faClock;
  protected readonly faEllipsisVertical = faEllipsisVertical;
  protected readonly faGrip = faGrip;
  protected readonly faList = faList;
  protected readonly faSpinner = faSpinner;
  protected readonly faStar = faStar;

  ngOnInit(): void {

    const accessToken = localStorage.getItem('accessToken');

    if (!accessToken) {
      void this.router.navigate(['/login']);
      return;
    }
    this.studentId =
      this.activatedRoute.snapshot.paramMap.get('universityId') ??
      this.activatedRoute.parent?.snapshot.paramMap.get('universityId');
    this.store.dispatch(StudentActions.loadMe());

    this.studentDetailsSubscription();
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }

  public selectSemester(
    semester: 'SEM1' | 'SEM2' | 'all'
  ): void {
    this.selectedSemester = semester;
  }

  public setViewMode(
    mode: 'grid' | 'list'
  ): void {
    this.viewMode = mode;
  }

  private studentDetailsSubscription(): void {

    this.subscription$.add(
      this.studentDetailsSelected$.subscribe({

        next: (studentDetailsState) => {

          if (
            studentDetailsState?.status === StudentDetailsStatusEnum.loadDetailsSuccess ||
            studentDetailsState?.status === StudentDetailsStatusEnum.loadMeSuccess
          ) {

            this.store.dispatch(
              CourseActions.loadMyMajorCourses()
            );

          }

        }

      })
    );
  }

  public navigateToStudentMaterialsPage(courseId: string): void {
    if (!this.studentId || !courseId) {
      return;
    }

    void this.router.navigate([
      '/students',
      this.studentId,
      'courses',
      courseId,
      'materials'
    ]);
  }

  public navigateToStudentAnnouncementsPage(courseId: string): void {
    if (!this.studentId) {
      return;
    }

    void this.router.navigate([
      '/students',
      this.studentId,
      'courses',
      courseId,
      'announcements'
    ]);
  }
}
