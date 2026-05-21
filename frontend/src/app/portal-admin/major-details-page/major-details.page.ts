import { Component, Inject, inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { select, Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, map, startWith, Subscription } from 'rxjs';

import { MajorActions } from '../../major/+state/major.action';
import { selectMajorDetails } from '../../major/+state/major.selector';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable
} from '@angular/material/table';
import { MAJOR_DETAILS_KEY } from '../../major/+state/major-details.reducer';
import { LetDirective } from '@ngrx/component';
import { PopoverBoxService } from '../../components/mat-pop-over-box/src';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    MatCell,
    MatHeaderCellDef,
    MatHeaderCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderRow,
    MatRow,
    MatHeaderRowDef,
    MatTable,
    LetDirective,
    MatRowDef
  ],
  templateUrl: './major-details.page.html',
  styleUrl: './major-details.page.scss'
})
export class MajorDetailsPage implements OnInit, OnDestroy {
  private store = inject(Store);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  protected popoverBoxService = inject(PopoverBoxService);

  public adminId: string | null = null;
  public majorId: string | null = null;
  public accessToken: string | null = null;

  private subscription$ = new Subscription();

  public searchControl = new FormControl('');

  public displayedColumns: string[] = [
    'name',
    'code',
    'year',
    'semester',
    'credits',
    'actions'
  ];

  public majorDetailsSelected$ = this.store.pipe(select(selectMajorDetails));

  public filteredMajorDetails$ = combineLatest([
    this.majorDetailsSelected$,
    this.searchControl.valueChanges.pipe(startWith(''))
  ]).pipe(
    map(([major, search]) => {
      const majorDetails = major?.[MAJOR_DETAILS_KEY];

      if (!majorDetails) {
        return major;
      }

      const searchValue = (search ?? '').toLowerCase().trim();

      const filteredCourses = !searchValue
        ? majorDetails.courses ?? []
        : (majorDetails.courses ?? []).filter((course: any) =>
          course.name?.toLowerCase().includes(searchValue)
        );

      return {
        ...major,
        [MAJOR_DETAILS_KEY]: {
          ...majorDetails,
          courses: filteredCourses
        }
      };
    })
  );

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.accessToken = localStorage.getItem('accessToken');

    if (!this.accessToken) {
      void this.router.navigate(['/login']);
      return;
    }

    this.adminId = this.activatedRoute.parent?.snapshot.paramMap.get('id');
    this.majorId = this.activatedRoute.snapshot.paramMap.get('majorId');

    if (!this.majorId) return;

    this.store.dispatch(MajorActions.loadMajorDetails({ id: this.majorId }));
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }

  public goToMajorsPage(): void {
    void this.router.navigate(['/admin', this.adminId, 'majors']);
  }

  public goToEditMajor(): void {
    void this.router.navigate(['/admin', this.adminId, this.majorId, 'edit']);
  }

  public navigateToEditCourse(id: string): void {
    void this.router.navigate(['/admin', this.adminId, id, 'edit-course']);
  }

  public navigateToAddCourse(id: string): void {
    void this.router.navigate(['/admin', this.adminId, id, 'add-new-course']);
  }

  public async presentPopoverActions($event: MouseEvent, courseId: string): Promise<void> {
    this.popoverBoxService.openPanel($event, [
      {
        faIcon: ['fas', 'edit'],
        visible: true,
        label: 'Edit',
        handler: () => {
          this.navigateToEditCourse(courseId);
        }
      }
    ]);
  }

  protected readonly MAJOR_DETAILS_KEY = MAJOR_DETAILS_KEY;
}
