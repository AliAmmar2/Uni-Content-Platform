import { Component, Inject, inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';

import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { select, Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { MajorActions } from '../+state/major.action';
import { selectMajorDetails } from '../+state/major.selector';
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
import { MAJOR_DETAILS_KEY } from '../+state/major-details.reducer';
import { LetDirective } from '@ngrx/component';

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

  public adminId: string | null = null;
  public majorId: string | null = null;

  accessToken: string | null = null;

  private subscription$ = new Subscription();
  displayedColumns: string[] = [
    'name',
    'code',
    'semester',
    'credits',
    'actions'
  ];

  majorDetailsSelected$ = this.store.pipe(select(selectMajorDetails));

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
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

    if (!this.majorId) return;

    this.store.dispatch(MajorActions.loadMajorDetails({ id: this.majorId }))
    console.log(this.majorId);
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }

  public goToMajorsPage() {
    void this.router.navigate([
      '/admin',
      this.adminId,
      'majors'
    ]);
  }

  public goToEditMajor() {
    void this.router.navigate([
      '/admin',
      this.adminId,
      this.majorId,
      'edit'
    ]);
  }

  protected readonly MAJOR_DETAILS_KEY = MAJOR_DETAILS_KEY;
}
