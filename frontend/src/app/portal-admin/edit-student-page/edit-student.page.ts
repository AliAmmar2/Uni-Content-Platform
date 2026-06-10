import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { AsyncPipe } from '@angular/common';
import { LetDirective } from '@ngrx/component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, combineLatest, map, Subscription } from 'rxjs';

import { selectAllMajors } from '../../major/+state/major.selector';
import { selectAllFaculties } from '../../faculty/+state/faculty.selector';
import { FacultyActions } from '../../faculty/+state/faculty.action';
import { MajorActions } from '../../major/+state/major.action';
import { StudentActions } from '../../student/+state/student.action';

import { CreateStudentFormGroupInterface } from '../../student/interfaces/create-student-form-group.interface';
import { UpdateStudentFormGroupInterface } from '../../student/interfaces/update-student-form-group.interface';

import { FACULTY_KEY } from '../../faculty/+state/faculty.reducer';
import { MAJOR_KEY } from '../../major/+state/major.reducer';

import { selectStudentDetails } from '../../student/+state/student.selector';
import { StudentDetailsStatusEnum } from '../../student/+state/enums/student-details-status.enum';
import { STUDENT_DETAILS_KEY } from '../../student/+state/student-details.reducer';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-new-student',
  templateUrl: './edit-student.page.html',
  styleUrls: ['./edit-student.page.scss'],
  imports: [
    ReactiveFormsModule,
    AsyncPipe,
    LetDirective,
    FaIconComponent
  ]
})
export class EditStudentPage implements OnInit, OnDestroy {
  private router = inject(Router);
  private store = inject(Store);
  private toastr = inject(ToastrService);
  private activatedRoute = inject(ActivatedRoute);

  public adminId = '';
  public studentId: string | null = null;
  public isEditMode = false;
  public showPassword = false;

  private selectedFacultyId$ = new BehaviorSubject<string>('');

  public studentForm: FormGroup;

  public studentDetailsSelected$ = this.store.select(selectStudentDetails);
  public faculties$ = this.store.pipe(select(selectAllFaculties));

  public majors$ = combineLatest([
    this.store.pipe(select(selectAllMajors)),
    this.selectedFacultyId$
  ]).pipe(
    map(([majorsState, facultyId]) => {
      const majors = majorsState?.[MAJOR_KEY] ?? [];

      if (!facultyId) {
        return {
          ...majorsState,
          [MAJOR_KEY]: []
        };
      }

      return {
        ...majorsState,
        [MAJOR_KEY]: majors.filter((major) => {
          return major.faculty.id === facultyId;
        })
      };
    })
  );

  private subscription$ = new Subscription();

  constructor() {
    this.studentForm = new FormGroup({
      name: new FormControl('', Validators.required),
      universityId: new FormControl('', Validators.required),
      universityEmail: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)]),
      faculty: new FormControl('', Validators.required),
      major: new FormControl('', Validators.required),
      academicYear: new FormControl('', Validators.required),
      calendarYear: new FormControl(new Date().getFullYear(), [Validators.required, Validators.pattern(/^\d{4}$/)]),
      role: new FormControl<'STUDENT' | 'MODERATOR'>('STUDENT', Validators.required),
      status: new FormControl<'ACTIVE' | 'SUSPENDED' | 'PENDING_VERIFICATION'>('PENDING_VERIFICATION', Validators.required),
    });
  }

  ngOnInit(): void {
    this.adminId = this.activatedRoute.parent?.snapshot.paramMap.get('id') ?? '';
    this.studentId = this.activatedRoute.snapshot.paramMap.get('studentId');
    this.isEditMode = !!this.studentId;

    this.configurePasswordField();
    this.studentDetailsSubscription();
    this.facultyChangesSubscription();

    this.store.dispatch(FacultyActions.loadFaculties());

    if (this.isEditMode && this.studentId) {
      this.store.dispatch(StudentActions.loadStudentDetails({
        studentId: this.studentId
      }));
    }
  }

  private configurePasswordField(): void {
    const passwordControl = this.studentForm.get('password');

    if (!passwordControl) {
      return;
    }

    if (this.isEditMode) {
      passwordControl.clearValidators();
      passwordControl.setValue('');
    } else {
      passwordControl.setValidators([
        Validators.required,
        Validators.minLength(8)
      ]);
    }

    passwordControl.updateValueAndValidity();
  }

  private facultyChangesSubscription(): void {
    const facultyControl = this.studentForm.get('faculty');

    if (!facultyControl) {
      return;
    }

    this.subscription$.add(
      facultyControl.valueChanges.subscribe((facultyId: string) => {
        this.selectedFacultyId$.next(facultyId);

        this.studentForm.patchValue({
          major: ''
        }, { emitEvent: false });

        if (!facultyId) {
          return;
        }

        this.store.dispatch(MajorActions.loadMajorsByFaculty({
          facultyId
        }));
      })
    );
  }

  public studentDetailsSubscription(): void {
    this.subscription$.add(
      this.studentDetailsSelected$.subscribe((studentDetails) => {
        if (!studentDetails) {
          return;
        }

        if (
          studentDetails.status === StudentDetailsStatusEnum.createSuccess
        ) {
          this.toastr.success(
            'Student created successfully, student should verify email',
            'Success',
            {
              positionClass: 'toast-top-right',
              progressBar: true,
              closeButton: true,
              timeOut: 3000
            }
          );

          this.goToStudentsPage();
          return;
        }

        if (
          studentDetails.status === StudentDetailsStatusEnum.updateSuccess
        ) {
          this.toastr.success(
            'Student updated successfully',
            'Success',
            {
              positionClass: 'toast-top-right',
              progressBar: true,
              closeButton: true,
              timeOut: 4000
            }
          );

          this.goToStudentsPage();
          return;
        }

        if (
          studentDetails.status === StudentDetailsStatusEnum.createFailure ||
          studentDetails.status === StudentDetailsStatusEnum.updateFailure
        ) {
          this.toastr.error(
            studentDetails.error?.message ||
            'Something went wrong',
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
          studentDetails.status === StudentDetailsStatusEnum.loadDetailsSuccess
        ) {
          const student = studentDetails[STUDENT_DETAILS_KEY];

          this.selectedFacultyId$.next(student.facultyId);

          this.store.dispatch(MajorActions.loadMajorsByFaculty({
            facultyId: student.facultyId
          }));

          this.studentForm.patchValue({
            name: student.name,
            universityId: student.universityId,
            universityEmail: student.universityEmail,
            faculty: student.facultyId,
            major: student.majorId,
            academicYear: String(student.academicYear),
            calendarYear: student.calendarYear,
            role: student.role,
            status: student.status
          }, { emitEvent: false });
        }
      })
    );
  }

  public togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  public onSubmit(): void {
    if (this.studentForm.invalid) {
      this.studentForm.markAllAsTouched();
      return;
    }

    const formValue = this.studentForm.value;

    if (this.isEditMode && this.studentId) {
      const student: UpdateStudentFormGroupInterface = {
        name: formValue.name,
        universityId: formValue.universityId,
        universityEmail: formValue.universityEmail,
        faculty: formValue.faculty,
        major: formValue.major,
        academicYear: Number(formValue.academicYear),
        calendarYear: Number(formValue.calendarYear),
        role: formValue.role,
        status: formValue.status,
      };

      this.store.dispatch(StudentActions.updateStudent({
        id: this.studentId,
        student
      }));

      return;
    }

    const student: CreateStudentFormGroupInterface = {
      name: formValue.name,
      universityId: formValue.universityId,
      universityEmail: formValue.universityEmail,
      password: formValue.password,
      faculty: formValue.faculty,
      major: formValue.major,
      academicYear: Number(formValue.academicYear),
      calendarYear: Number(formValue.calendarYear),
      role: formValue.role,
      status: formValue.status,
    };

    this.store.dispatch(StudentActions.createStudent({ student }));
  }

  public onCancel(): void {
    this.goToStudentsPage();
  }

  public goToStudentsPage(): void {
    void this.router.navigate(['/admin', this.adminId, 'students']);
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }

  protected readonly FACULTY_KEY = FACULTY_KEY;
  protected readonly MAJOR_KEY = MAJOR_KEY;
}
