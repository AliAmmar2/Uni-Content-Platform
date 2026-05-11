import { Component, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LetDirective } from '@ngrx/component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

import { BehaviorSubject, combineLatest, map } from 'rxjs';

import { selectAllMajors } from '../../major/+state/major.selector';
import { MajorActions } from '../../major/+state/major.action';
import { MAJOR_KEY } from '../../major/+state/major.reducer';
import { PopoverBoxService } from '../../components/mat-pop-over-box/src';
import { NgxMdDialogService } from '../../components/mat-dialog/service/ngx-md-dialog.service';
import {
  MatMultiActionsInterface
} from '../../components/mat-dialog/mat-mutli-actions-dialog/mat-multi-actions.interface';
import { MajorItemBo } from '../../major/bo/major-item.bo';

@Component({
  imports: [CommonModule, LetDirective, FaIconComponent],
  selector: 'app-majors-admin',
  templateUrl: './major.page.html',
  styleUrls: ['./major.page.scss']
})
export class MajorPage implements OnInit {
  public adminId: string;
  private store = inject(Store);
  private router = inject(Router);
  protected popoverBoxService = inject(PopoverBoxService);
  private ngxMdDialogService = inject(NgxMdDialogService);
  private majors$ = this.store.select(selectAllMajors);
  private search$ = new BehaviorSubject<string>('');
  private activatedRoute = inject(ActivatedRoute);
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
    this.store.dispatch(MajorActions.loadMajors());
    this.adminId = this.activatedRoute.parent?.snapshot.paramMap.get('id');
  }

  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.search$.next(value);
  }

  navigateToAddNewMajor(): void {
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

  deleteMajor(id: string): void {
    this.store.dispatch(MajorActions.deleteMajor({ id }));
  }

  protected readonly MAJOR_KEY = MAJOR_KEY;
}
