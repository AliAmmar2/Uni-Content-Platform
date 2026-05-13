import { AfterViewInit, Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { CommonModule } from '@angular/common';
import { select, Store } from '@ngrx/store';
import { BehaviorSubject, combineLatest, debounceTime, distinctUntilChanged, Subscription } from 'rxjs';

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
  MatTable,
  MatTableDataSource
} from '@angular/material/table';

import { MatPaginator } from '@angular/material/paginator';
import { LetDirective } from '@ngrx/component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { PopoverBoxService } from '../../components/mat-pop-over-box/src';
import { NgxMdDialogService } from '../../components/mat-dialog/service/ngx-md-dialog.service';
import {
  MatMultiActionsInterface
} from '../../components/mat-dialog/mat-mutli-actions-dialog/mat-multi-actions.interface';
import { AdminActions } from '../+state/admin.action';
import { selectAdminDetails, selectAllAdmins } from '../+state/admin.selector';
import { ADMIN_KEY } from '../+state/admin.reducer';
import { AdminStatusEnum } from '../+state/enums/admin-status.enum';
import { ToastrService } from 'ngx-toastr';


@Component({
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LetDirective,
    FaIconComponent,

    MatTable,
    MatHeaderCell,
    MatCell,
    MatColumnDef,
    MatCellDef,
    MatHeaderCellDef,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow,
    MatRowDef,
    MatPaginator
  ],
  templateUrl: './admins.page.html',
  styleUrl: './admins.page.scss'
})
export class AdminsPage implements OnInit, AfterViewInit, OnDestroy {
  public adminId: string | null = null;

  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private store = inject(Store);
  protected popoverBoxService = inject(PopoverBoxService);
  private ngxMdDialogService = inject(NgxMdDialogService);
  private toastr = inject(ToastrService);
  public adminDetailsSelected$ = this.store.pipe(
    select(selectAdminDetails)
  );
  private subscription$ = new Subscription();

  public search$ = new BehaviorSubject<string>('');

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  public displayedColumns = [
    'fullName',
    'username',
    'role',
    'lastLogin',
    'moreInfo'
  ];

  public dataSource = new MatTableDataSource<any>();

  public adminsListSelected$ = this.store.pipe(
    select(selectAllAdmins)
  );

  ngOnInit(): void {
    this.adminId = this.activatedRoute.parent?.snapshot.paramMap.get('id');

    this.store.dispatch(AdminActions.loadAdmins());
    this.adminDetailsSubscription();
    this.subscription$.add(
      combineLatest([
        this.adminsListSelected$,
        this.search$.pipe(
          debounceTime(200),
          distinctUntilChanged()
        )
      ]).subscribe(([state, search]) => {
        const admins = state?.[this.ADMIN_KEY] ?? [];

        const filteredAdmins = this.filterAdmins(admins, search);

        this.dataSource.data = filteredAdmins;

        if (this.paginator) {
          this.dataSource.paginator = this.paginator;
        }
      })
    );
  }

  public adminDetailsSubscription(): void {
    this.subscription$.add(
      this.adminDetailsSelected$.subscribe((detailsState) => {
        if (!detailsState) {
          return;
        }

        if (detailsState.status === AdminStatusEnum.deleteSuccess) {
          this.toastr.success(
            'Admin deleted successfully',
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

        if (detailsState.status === AdminStatusEnum.deleteFailure) {
          this.toastr.error(
            detailsState.error?.message || 'Something went wrong',
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


  private filterAdmins(admins: any[], search: string): any[] {
    if (!search) {
      return admins;
    }

    const term = search.toLowerCase().trim();

    return admins.filter(admin => {
      return (
        admin.fullName?.toLowerCase().includes(term) ||
        admin.email?.toLowerCase().includes(term) ||
        admin.username?.toLowerCase().includes(term) ||
        admin.role?.toLowerCase().includes(term)
      );
    });
  }

  public async presentPopoverActions(
    $event: MouseEvent,
    admin: any
  ): Promise<void> {
    this.popoverBoxService.openPanel($event, [
      {
        faIcon: ['fas', 'edit'],
        visible: true,
        label: 'Edit',
        handler: () => {
          this.navigateToEditAdmin(admin.id);
        }
      },
      {
        faIcon: ['fas', 'trash'],
        visible: true,
        label: 'Delete',
        handler: () => {
          this.presentDeleteAlert(admin);
        }
      }
    ]);
  }

  public presentDeleteAlert(admin: any): void {
    const matYesNoDialogData: MatMultiActionsInterface = {
      faIcon: ['fas', 'trash'],
      title: 'Delete Admin?',
      message: admin.fullName + ' will be permanently deleted!',
      action: [
        {
          label: 'yes delete',
          color: '#d40000',
          handler: () => {
            this.deleteAdmin(admin.id);
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

    this.ngxMdDialogService.openMultiActionsDialog(
      matYesNoDialogData,
      { width: '400px' }
    );
  }

  public deleteAdmin(adminId: string): void {
    this.store.dispatch(AdminActions.deleteAdmin({
      id: adminId
    }));
  }

  public navigateToEditAdmin(id: string): void {
    void this.router.navigate([
      '/admin',
      this.adminId,
      id,
      'edit-admin'
    ]);
  }

  public navigateToAddAdminPage(): void {
    if (!this.adminId) {
      console.error('Admin ID is missing from route');
      return;
    }

    void this.router.navigate([
      '/admin',
      this.adminId,
      'add-new-admin'
    ]);
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }

  protected readonly ADMIN_KEY = ADMIN_KEY;
}
