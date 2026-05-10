import { Component, Inject, inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { selectFacultyDetails } from '../../faculty/+state/faculty.selector';
import { FacultyStatusEnum } from '../../faculty/+state/enums/faculty-status.enum';
import { FacultyActions } from '../../faculty/+state/faculty.action';
import { MAJOR_DETAILS_KEY } from '../../major/+state/major-details.reducer';
import { FACULTY_DETAILS_KEY } from '../../faculty/+state/faculty-details.reducer';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FontAwesomeModule],
  templateUrl: './edit-new-faculty.page.html',
  styleUrl: './edit-new-faculty.page.scss'
})
export class EditNewFacultyPage implements OnInit, OnDestroy {
  private store = inject(Store);
  private router = inject(Router);
  public facultyForm: FormGroup;
  public adminId: string;
  public facultyId: string | null = null;
  public isEditMode: boolean = false;
  accessToken: string | null = null;
  private destroy$ = new Subject<void>();
  facultyDetailsSelected$ = this.store.select(selectFacultyDetails);
  protected subscription$ = new Subscription();
  private activatedRoute = inject(ActivatedRoute);

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.facultyForm = new FormGroup({
      name: new FormControl('', Validators.required),
      code: new FormControl('', Validators.required),
      description: new FormControl(''),
    });
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.accessToken = localStorage.getItem('accessToken');
      if (!this.accessToken) {
        void this.router.navigate(['/login']);
        return;
      }
      this.facultySubscription();
      this.adminId = this.activatedRoute.parent?.snapshot.paramMap.get('id');
      this.facultyId = this.activatedRoute.snapshot.paramMap.get('facultyId');

      this.isEditMode = !!this.facultyId;

      if (this.isEditMode && this.facultyId) {
        this.store.dispatch(
          FacultyActions.loadFacultyDetails({ id: this.facultyId })
        );
      }
    }
  }

  public facultySubscription() {
    this.subscription$.add(
      this.facultyDetailsSelected$.subscribe({
        next: (facultyDetailsState) => {
          if (facultyDetailsState?.status === FacultyStatusEnum.createSuccess) {
            this.goToFacultiesPage();
          }

          if (this.isEditMode &&
            facultyDetailsState.status === FacultyStatusEnum.updateSuccess
          ) {
            this.goToFacultiesPage();
          }
          if (
            this.isEditMode &&
            facultyDetailsState.status === FacultyStatusEnum.loadDetailsSuccess
          ) {
            this.facultyForm.patchValue({
              name: facultyDetailsState[FACULTY_DETAILS_KEY].name,
              code: facultyDetailsState[FACULTY_DETAILS_KEY].code,
              description: facultyDetailsState[FACULTY_DETAILS_KEY].description
            });
          }
        }
      })
    );
  }

  public onCreate() {
    if (this.facultyForm.valid) {
      this.store.dispatch(FacultyActions.createFaculty({
        faculty: this.facultyForm.value
      }))
    }
  }

  public onSubmit() {

    if (this.facultyForm.invalid) return;

    if (this.isEditMode && this.facultyId) {

      this.store.dispatch(
        FacultyActions.updateFaculty({
          id: this.facultyId,
          faculty: this.facultyForm.value
        })
      );
    } else {
      this.store.dispatch(FacultyActions.createFaculty({
        faculty: this.facultyForm.value
      }))
    }
  }

  public onCancel() {
    this.goToFacultiesPage();
  }

  public goToFacultiesPage() {
    void this.router.navigate(['/admin', this.adminId, 'faculties']);
  }

  ngOnDestroy(): void {
    this.destroy$.complete();
    this.subscription$.unsubscribe();
  }

}
