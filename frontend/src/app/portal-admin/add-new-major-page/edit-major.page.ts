import { Component, Inject, inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';

import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { select, Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { MajorActions } from '../../major/+state/major.action';
import { selectMajorDetails } from '../../major/+state/major.selector';
import { MajorStatusEnum } from '../../major/+state/enums/major-status.enum';

import { selectAllFaculties } from '../../faculty/+state/faculty.selector';
import { FacultyActions } from '../../faculty/+state/faculty.action';

import { LetDirective } from '@ngrx/component';
import { FACULTY_KEY } from '../../faculty/+state/faculty.reducer';
import { MAJOR_DETAILS_KEY } from '../../major/+state/major-details.reducer';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    LetDirective
  ],
  templateUrl: './edit-major.page.html',
  styleUrl: './edit-major.page.scss'
})
export class EditMajorPage implements OnInit, OnDestroy {
  private store = inject(Store);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  public majorForm: FormGroup;

  public adminId: string | null = null;
  public majorId: string | null = null;

  public isEditMode: boolean = false;

  accessToken: string | null = null;

  private subscription$ = new Subscription();

  majorDetailsSelected$ = this.store.pipe(select(selectMajorDetails));
  facultiesListSelected$ = this.store.pipe(select(selectAllFaculties));

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {

    this.majorForm = new FormGroup({
      name: new FormControl('', Validators.required),
      code: new FormControl('', Validators.required),
      faculty: new FormControl('', Validators.required),
    });

  }

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.accessToken = localStorage.getItem('accessToken');

    if (!this.accessToken) {
      void this.router.navigate(['/login']);
      return;
    }

    this.adminId = this.activatedRoute.parent?.snapshot.paramMap.get('id');
    this.majorId = this.activatedRoute.snapshot.paramMap.get('majorId');

    this.isEditMode = !!this.majorId;

    this.store.dispatch(FacultyActions.loadFaculties());


    this.majorSubscription();

    if (this.isEditMode && this.majorId) {
      this.store.dispatch(
        MajorActions.loadMajorDetails({ id: this.majorId })
      );
    }
  }

  public majorSubscription() {
    this.subscription$.add(
      this.majorDetailsSelected$.subscribe({
        next: (majorDetailsState) => {

          if (!majorDetailsState?.status) return;

          if (
            !this.isEditMode &&
            majorDetailsState.status === MajorStatusEnum.createSuccess
          ) {
            this.goToMajorsPage();
          }

          if (
            this.isEditMode &&
            majorDetailsState.status === MajorStatusEnum.updateSuccess
          ) {
            this.goToMajorsPage();
          }

          if (
            this.isEditMode &&
            majorDetailsState.status === MajorStatusEnum.loadDetailsSuccess
          ) {
            this.majorForm.patchValue({
              name: majorDetailsState[MAJOR_DETAILS_KEY].name,
              code: majorDetailsState[MAJOR_DETAILS_KEY].code,
              faculty: majorDetailsState[MAJOR_DETAILS_KEY].faculty?.id || majorDetailsState[MAJOR_DETAILS_KEY].faculty
            });
          }

        }
      })
    );
  }

  public onSubmit() {

    if (this.majorForm.invalid) return;

    if (this.isEditMode && this.majorId) {

      this.store.dispatch(
        MajorActions.updateMajor({
          id: this.majorId,
          major: this.majorForm.value
        })
      );

    } else {

      this.store.dispatch(
        MajorActions.createMajor({
          major: this.majorForm.value
        })
      );
    }
  }

  public onCancel() {
    this.goToMajorsPage();
  }

  public goToMajorsPage() {
    void this.router.navigate([
      '/admin',
      this.adminId,
      'majors'
    ]);
  }

  public goToFacultiesPage() {
    void this.router.navigate([
      '/admin',
      this.adminId,
      'faculties'
    ]);
  }

  public onFacultySelect(faculty: any): void {
    this.majorForm.patchValue({
      faculty: faculty.id
    });
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }

  protected readonly FACULTY_KEY = FACULTY_KEY;
}
