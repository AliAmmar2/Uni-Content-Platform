import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { AsyncPipe } from '@angular/common';
import { LetDirective } from '@ngrx/component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { ActivatedRoute, Router } from '@angular/router';

import { selectAllMajors } from '../../major/+state/major.selector';
import { selectAllFaculties } from '../../faculty/+state/faculty.selector';
import { FacultyActions } from '../../faculty/+state/faculty.action';
import { MajorActions } from '../../major/+state/major.action';
import { StudentActions } from '../../student/+state/student.action';
import { CreateStudentFormGroupInterface } from '../../student/interfaces/create-student-form-group.interface';
import { FACULTY_KEY } from '../../faculty/+state/faculty.reducer';
import { MAJOR_KEY } from '../../major/+state/major.reducer';

@Component({
  selector: 'app-add-new-student',
  templateUrl: './add-student.page.html',
  styleUrls: ['./add-student.page.scss'],
  imports: [
    ReactiveFormsModule,
    AsyncPipe,
    LetDirective,
    FaIconComponent
  ]
})
export class AddStudentPage implements OnInit {
  private store = inject(Store);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  public adminId: string;
  public showPassword = false;

  public faculties$ = this.store.pipe(select(selectAllFaculties));
  public majors$ = this.store.pipe(select(selectAllMajors));

  public studentForm: FormGroup;

  constructor() {
    this.studentForm = new FormGroup({
      name: new FormControl('', Validators.required),
      universityId: new FormControl('', Validators.required),
      universityEmail: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)]),
      faculty: new FormControl('', Validators.required),
      major: new FormControl('', Validators.required),
      academicYear: new FormControl('', Validators.required),
      calendarYear: new FormControl(new Date().getFullYear(), Validators.required),
      role: new FormControl<'STUDENT' | 'MODERATOR'>('STUDENT', Validators.required),
      status: new FormControl<'ACTIVE' | 'SUSPENDED' | 'GRADUATED'>('ACTIVE', Validators.required),
    });
  }

  ngOnInit(): void {
    this.adminId = this.activatedRoute.parent?.snapshot.paramMap.get('id') ?? '';

    this.store.dispatch(FacultyActions.loadFaculties());
    this.store.dispatch(MajorActions.loadMajors());
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onCreateStudent(): void {
    if (this.studentForm.invalid) {
      this.studentForm.markAllAsTouched();
      return;
    }

    const formValue = this.studentForm.value;

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

  onCancel(): void {
    void this.router.navigate(['/admin', this.adminId, 'students']);
  }

  protected readonly FACULTY_KEY = FACULTY_KEY;
  protected readonly MAJOR_KEY = MAJOR_KEY;
}
