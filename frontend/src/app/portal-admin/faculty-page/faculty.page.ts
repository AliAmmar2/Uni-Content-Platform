import { Component, Inject, inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { select, Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { LetDirective } from '@ngrx/component';

import { BehaviorSubject, combineLatest, map, Subscription } from 'rxjs';

import { selectAllFaculties, selectFacultyDetails } from '../../faculty/+state/faculty.selector';
import { FacultyActions } from '../../faculty/+state/faculty.action';
import { FACULTY_KEY } from '../../faculty/+state/faculty.reducer';
import { PopoverBoxService } from '../../components/mat-pop-over-box/src';
import {
  MatMultiActionsInterface
} from '../../components/mat-dialog/mat-mutli-actions-dialog/mat-multi-actions.interface';
import { FacultyItemBo } from '../../faculty/bo/faculty-item.bo';
import { NgxMdDialogService } from '../../components/mat-dialog/service/ngx-md-dialog.service';
import { ToastrService } from 'ngx-toastr';
import { FacultyStatusEnum } from '../../faculty/+state/enums/faculty-status.enum';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FontAwesomeModule, LetDirective],
  templateUrl: './faculty.page.html',
  styleUrl: './faculty.page.scss'
})
export class FacultyPage implements OnInit, OnDestroy {

  private store = inject(Store);
  private router = inject(Router);
  public adminId: string;
  accessToken: string | null = null;
  private toastr = inject(ToastrService);
  private subscription$ = new Subscription();
  protected popoverBoxService = inject(PopoverBoxService);
  private ngxMdDialogService = inject(NgxMdDialogService);

  private activatedRoute = inject(ActivatedRoute);
  public facultyDetailsSelected$ = this.store.pipe(
    select(selectFacultyDetails)
  );
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

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
  }

  ngOnInit(): void {

    if (isPlatformBrowser(this.platformId)) {

      this.accessToken = localStorage.getItem('accessToken');

      if (!this.accessToken) {
        void this.router.navigate(['/login']);
        return;
      }
      this.facultyDetailsSubscription();
      this.adminId = this.activatedRoute.parent?.snapshot.paramMap.get('id');
      this.store.dispatch(FacultyActions.loadFaculties());
    }
  }

  public facultyDetailsSubscription() {
    this.subscription$.add(
      this.facultyDetailsSelected$.subscribe((facultyDetailsState) => {
        if (!facultyDetailsState) {
          return;
        }

        if (facultyDetailsState.status === FacultyStatusEnum.deleteSuccess) {
          this.toastr.clear();

          this.toastr.success(
            'Faculty deleted successfully',
            'Success',
            {
              positionClass: 'toast-top-right',
              progressBar: true,
              closeButton: true,
              timeOut: 3000
            }
          );

          return;
        }

        if (facultyDetailsState.status === FacultyStatusEnum.deleteFailure) {
          this.toastr.clear();

          this.toastr.error(
            facultyDetailsState.error?.message || 'Something went wrong',
            'Error',
            {
              positionClass: 'toast-top-right',
              progressBar: true,
              closeButton: true,
              timeOut: 4000
            }
          );
        }
      })
    );
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
          this.navigateToEditFaculty(faculty.id)
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

  public presentDeleteAlert(faculty: FacultyItemBo) {
    const matYesNoDialogData: MatMultiActionsInterface = {
      faIcon: ['fas', 'trash'],
      title: 'Delete Faculty?',
      message: faculty.name + ' will be permanently deleted!',
      action: [
        {
          label: 'yes delete',
          color: ' #d40000',
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


  public navigateToEditFaculty(id: string): void {
    void this.router.navigate(['/admin', this.adminId, id, 'edit-faculty']);
  }

  public deleteFaculty(facultyId: string) {
    this.store.dispatch(FacultyActions.deleteFaculty({
      id: facultyId
    }))
  }

  public navigateToAddFaculty() {
    void this.router.navigate(['/admin', this.adminId, 'add-new-faculty']);
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
}
