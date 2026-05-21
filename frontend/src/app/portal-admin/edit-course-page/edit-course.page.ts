import { Component, Inject, inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { select, Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LetDirective } from '@ngrx/component';
import { ToastrService } from 'ngx-toastr';

import { COURSE_DETAILS_KEY } from '../../courses/+state/course-details.reducer';
import { CourseActions } from '../../courses/+state/courses.action';
import { CourseStatusEnum } from '../../courses/+state/enums/course-status.enum';
import { selectCourseDetails } from '../../courses/+state/courses.selector';

import { MajorActions } from '../../major/+state/major.action';
import { selectAllMajors } from '../../major/+state/major.selector';
import { MAJOR_KEY } from '../../major/+state/major.reducer';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    LetDirective
  ],
  templateUrl: './edit-course.page.html',
  styleUrl: './edit-course.page.scss'
})
export class EditCoursePage implements OnInit, OnDestroy {
  private store = inject(Store);
  private router = inject(Router);
  private toastr = inject(ToastrService);
  private activatedRoute = inject(ActivatedRoute);

  public courseForm: FormGroup;

  public adminId: string | null = null;
  public courseId: string | null = null;
  public majorId: string | null = null;
  public isEditMode = false;

  private subscription$ = new Subscription();

  public courseDetailsSelected$ = this.store.pipe(select(selectCourseDetails));
  public majorsListSelected$ = this.store.pipe(select(selectAllMajors));

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.courseForm = new FormGroup({
      name: new FormControl('', Validators.required),
      code: new FormControl('', Validators.required),
      description: new FormControl(''),
      credits: new FormControl('', [Validators.required, Validators.min(1)]),
      major: new FormControl('', Validators.required),
      academicYear: new FormControl('', Validators.required),
      calendarYear: new FormControl(new Date().getFullYear(), [
        Validators.required,
        Validators.pattern(/^\d{4}$/)
      ]),
      semester: new FormControl('', Validators.required)
    });
  }

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const accessToken = localStorage.getItem('accessToken');

    if (!accessToken) {
      void this.router.navigate(['/login']);
      return;
    }

    this.adminId = this.activatedRoute.parent?.snapshot.paramMap.get('id');
    this.courseId = this.activatedRoute.snapshot.paramMap.get('courseId');
    this.majorId = this.activatedRoute.snapshot.paramMap.get('majorId');
    this.isEditMode = !!this.courseId;

    this.store.dispatch(MajorActions.loadMajors());

    if (this.majorId) {
      this.courseForm.patchValue({
        major: this.majorId
      });
    }
    this.courseSubscription();

    if (this.isEditMode && this.courseId) {
      this.store.dispatch(CourseActions.loadCourseDetails({
        id: this.courseId
      }));
    }
  }

  private courseSubscription(): void {
    this.subscription$.add(
      this.courseDetailsSelected$.subscribe({
        next: (courseDetailsState) => {
          if (!courseDetailsState?.status) {
            return;
          }

          if (courseDetailsState.status === CourseStatusEnum.createSuccess) {
            this.toastr.clear();
            this.toastr.success('Course created successfully', 'Success', {
              positionClass: 'toast-top-right',
              progressBar: true,
              closeButton: true,
              timeOut: 4000
            });

            this.goToCoursesPage();
            return;
          }

          if (courseDetailsState.status === CourseStatusEnum.updateSuccess) {
            this.toastr.clear();
            this.toastr.success('Course updated successfully', 'Success', {
              positionClass: 'toast-top-right',
              progressBar: true,
              closeButton: true,
              timeOut: 4000
            });

            this.goToCoursesPage();
            return;
          }

          if (
            courseDetailsState.status === CourseStatusEnum.createFailure ||
            courseDetailsState.status === CourseStatusEnum.updateFailure
          ) {
            this.toastr.clear();
            this.toastr.error(
              courseDetailsState.error?.message || 'Something went wrong',
              'Error',
              {
                positionClass: 'toast-top-right',
                progressBar: true,
                closeButton: true,
                timeOut: 4000
              }
            );

            return;
          }

          if (
            this.isEditMode &&
            courseDetailsState.status === CourseStatusEnum.loadDetailsSuccess
          ) {
            const course = courseDetailsState[COURSE_DETAILS_KEY];

            this.courseForm.patchValue({
              name: course.name,
              code: course.code,
              description: course.description,
              credits: course.credits,
              major: course.major?.id,
              academicYear: String(course.academicYear),
              calendarYear: course.calendarYear,
              semester: course.semester
            });
          }
        }
      })
    );
  }

  public onSubmit(): void {
    if (this.courseForm.invalid) {
      this.courseForm.markAllAsTouched();
      return;
    }

    const formValue = this.courseForm.value;

    const course = {
      name: formValue.name,
      code: formValue.code,
      description: formValue.description,
      credits: Number(formValue.credits),
      major: formValue.major,
      academicYear: Number(formValue.academicYear),
      calendarYear: Number(formValue.calendarYear),
      semester: formValue.semester
    };

    if (this.isEditMode && this.courseId) {
      this.store.dispatch(CourseActions.updateCourse({
        id: this.courseId,
        course
      }));

      return;
    }

    this.store.dispatch(CourseActions.createCourse({
      course
    }));
  }

  public onCancel(): void {
    this.goToCoursesPage();
  }

  public goToCoursesPage(): void {
    void this.router.navigate(['/admin', this.adminId, 'courses']);
  }

  public goToMajorsPage(): void {
    void this.router.navigate(['/admin', this.adminId, 'majors']);
  }

  public goToDashboardPage(): void {
    void this.router.navigate(['/admin', this.adminId, 'dashboard']);
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }

  protected readonly MAJOR_KEY = MAJOR_KEY;
}
