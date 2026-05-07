import { Component, Inject, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Store, select } from '@ngrx/store';
import { NavigationEnd, Router } from '@angular/router';
import { LetDirective } from '@ngrx/component';

import { BehaviorSubject, combineLatest, filter, map } from 'rxjs';

import { selectAllFaculties } from './+state/courses.selector';
import { FacultyActions } from './+state/faculty.action';
import { FACULTY_KEY } from './+state/faculty.reducer';
import { PopoverBoxService } from '../components/mat-pop-over-box/src';
import {
  MatMultiActionsInterface
} from '../components/mat-dialog/mat-mutli-actions-dialog/mat-multi-actions.interface';
import { FacultyItemBo } from './bo/faculty-item.bo';
import { NgxMdDialogService } from '../components/mat-dialog/service/ngx-md-dialog.service';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FontAwesomeModule, LetDirective],
  templateUrl: './faculty.page.html',
  styleUrl: './faculty.page.scss'
})
export class FacultyPage implements OnInit {

  private store = inject(Store);
  private router = inject(Router);

  accessToken: string | null = null;
  activeMenu: string = '';
  protected popoverBoxService = inject(PopoverBoxService);
  private ngxMdDialogService = inject(NgxMdDialogService);
  // SAFE observable (no binding issues)
  private faculties$ = this.store.pipe(
    select((state: any) => selectAllFaculties(state))
  );

  search$ = new BehaviorSubject<string>('');

  facultiesListSelected$ = combineLatest([
    this.faculties$,
    this.search$
  ]).pipe(
    map(([state, search]) => {

      const faculties = state?.[FACULTY_KEY] || [];

      if (!search.trim()) return faculties;

      const lower = search.toLowerCase();

      return faculties.filter(f =>
        f.name?.toLowerCase().includes(lower) ||
        f.code?.toLowerCase().includes(lower)
      );
    })
  );

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {

    if (isPlatformBrowser(this.platformId)) {

      this.accessToken = localStorage.getItem('accessToken');

      if (!this.accessToken) {
       void this.router.navigate(['/login']);
        return;
      }

      this.store.dispatch(FacultyActions.loadFaculties());

      this.router.events
        .pipe(filter(event => event instanceof NavigationEnd))
        .subscribe(() => {
          const url = this.router.url;

          if (url.includes('faculties')) {
            this.activeMenu = 'faculties';
          } else if (url.includes('students')) {
            this.activeMenu = 'students';
          } else {
            this.activeMenu = 'dashboard';
          }
        });
    }
  }

  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.search$.next(value);
  }

  public async presentPopoverActions($event: MouseEvent, faculty: FacultyItemBo) {
    this.popoverBoxService.openPanel($event, [
      {
        faIcon: ['fas', 'edit'],
        visible: true,
        label: 'Edit',
        handler: () => {

        }
      },
      {
        faIcon: ['fas', 'trash'],
        visible: true,
        label: 'Delete',
        handler: () => {
          this.presentDeleteAlert(faculty)

        }
      }
    ]);
  }

  public presentDeleteAlert(faculty:FacultyItemBo) {
    const matYesNoDialogData: MatMultiActionsInterface = {
      faIcon: ['fas', 'trash'],
      title: 'Delete Faculty?',
      message: faculty.name + ' will be permanently deleted!',
      action: [
        {
          label: 'yes delete',
          color: 'red',
          handler: () => {
            this.deleteFaculty(faculty.id);
          }
        },
        {
          label: 'cancel',
          color: '#88a5db',
          handler: () => {
          }
        }
      ]
    };
    this.ngxMdDialogService.openMultiActionsDialog(matYesNoDialogData, { width: '400px' });
  }

  public deleteFaculty(facultyId: string) {

  }

}
