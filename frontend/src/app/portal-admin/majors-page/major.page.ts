import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LetDirective } from '@ngrx/component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

import { BehaviorSubject, combineLatest, map, Subscription } from 'rxjs';

import { selectAllMajors, selectMajorDetails } from '../../major/+state/major.selector';
import { MajorActions } from '../../major/+state/major.action';
import { MAJOR_KEY } from '../../major/+state/major.reducer';
import { PopoverBoxService } from '../../components/mat-pop-over-box/src';
import { NgxMdDialogService } from '../../components/mat-dialog/service/ngx-md-dialog.service';
import {
  MatMultiActionsInterface
} from '../../components/mat-dialog/mat-mutli-actions-dialog/mat-multi-actions.interface';
import { MajorItemBo } from '../../major/bo/major-item.bo';
import { ToastrService } from 'ngx-toastr';
import { MajorStatusEnum } from '../../major/+state/enums/major-status.enum';

@Component({
  imports: [CommonModule, LetDirective, FaIconComponent],
  selector: 'app-majors-admin',
  templateUrl: './major.page.html',
  styleUrls: ['./major.page.scss']
})
export class MajorPage implements OnInit, OnDestroy {
  public adminId: string;
  private store = inject(Store);
  private router = inject(Router);
  private toastr = inject(ToastrService);
  protected popoverBoxService = inject(PopoverBoxService);
  private ngxMdDialogService = inject(NgxMdDialogService);
  private majors$ = this.store.select(selectAllMajors);
  private search$ = new BehaviorSubject<string>('');
  private activatedRoute = inject(ActivatedRoute);
  private subscription$ = new Subscription();
  public majorDetailsSelected$ = this.store.pipe(
    select(selectMajorDetails)
  );
  majorsListSelected$ = combineLatest([
    this.majors$,
    this.search$
  ]).pipe(
    map(([state, search]) => {
      const majors = state?.[MAJOR_KEY] ?? [];

      const term = search?.trim().toLowerCase();
      if (!term) return majors;

      return majors.filter(m => {
        const name = m.name?.toLowerCase() ?? '';
        const code = m.code?.toLowerCase() ?? '';

        return name.includes(term) || code.includes(term);
      });
    })
  );

  ngOnInit(): void {
    this.majorDetailsSubscription();
    this.store.dispatch(MajorActions.loadMajors());
    this.adminId = this.activatedRoute.parent?.snapshot.paramMap.get('id');
  }

  public majorDetailsSubscription() {
    this.subscription$.add(
      this.majorDetailsSelected$.subscribe((majorDetailsState) => {
        if (!majorDetailsState) {
          return;
        }

        if (majorDetailsState.status === MajorStatusEnum.deleteSuccess) {
          this.toastr.clear();

          this.toastr.success(
            'Major deleted successfully',
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

        if (majorDetailsState.status === MajorStatusEnum.deleteFailure) {
          this.toastr.clear();

          this.toastr.error(
            majorDetailsState.error?.message || 'Something went wrong',
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

  public onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.search$.next(value);
  }

  public navigateToAddNewMajor(): void {
    void this.router.navigate(['/admin', this.adminId, 'add-new-major']);
  }

  public async presentPopoverActions($event: MouseEvent, major: MajorItemBo) {
    this.popoverBoxService.openPanel($event, [
      {
        faIcon: ['fas', 'edit'],
        visible: true,
        label: 'Edit',
        handler: () => {
          this.navigateToEditMajor(major.id)
        }
      },
      {
        faIcon: ['fas', 'trash'],
        visible: true,
        label: 'Delete',
        handler: () => {
          this.presentDeleteAlert(major)

        }
      }
    ]);
  }

  public navigateToEditMajor(id: string): void {
    void this.router.navigate(['/admin', this.adminId, id, 'edit-major']);
  }

  public navigateToMajorDetails(id: string): void {
    void this.router.navigate(['/admin', this.adminId, id, 'details']);
  }

  public presentDeleteAlert(major: MajorItemBo) {
    const matYesNoDialogData: MatMultiActionsInterface = {
      faIcon: ['fas', 'trash'],
      title: 'Delete Major?',
      message: major.name + ' will be permanently deleted!',
      action: [
        {
          label: 'yes delete',
          color: ' #d40000',
          handler: () => {
            this.deleteMajor(major.id);
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

  public deleteMajor(id: string): void {
    this.store.dispatch(MajorActions.deleteMajor({ id }));
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
}
