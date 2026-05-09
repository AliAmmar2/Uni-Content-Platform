import { Component, Inject, inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { selectFacultyDetails } from '../+state/faculty.selector';
import { FacultyStatusEnum } from '../+state/enums/faculty-status.enum';
import { FacultyActions } from '../+state/faculty.action';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FontAwesomeModule],
  templateUrl: './add-new-faculty.page.html',
  styleUrl: './add-new-faculty.page.scss'
})
export class AddNewFacultyPage implements OnInit, OnDestroy {

  private store = inject(Store);
  private router = inject(Router);
  public facultyForm: FormGroup;
  public adminId: string;
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
    }
  }

  public facultySubscription() {
    this.subscription$.add(
      this.facultyDetailsSelected$.subscribe({
        next: (facultyListState) => {
          if (facultyListState?.status === FacultyStatusEnum.createSuccess) {
            this.goToFacultiesPage();
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
