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

import { StudentActions } from '../../student/+state/student.action';
import { selectAllStudents, selectStudentDetails } from '../../student/+state/student.selector';
import { STUDENT_KEY } from '../../student/+state/student.reducer';
import { StudentItemBo } from '../../student/bo/student-item.bo';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PopoverBoxService } from '../../components/mat-pop-over-box/src';
import { NgxMdDialogService } from '../../components/mat-dialog/service/ngx-md-dialog.service';
import {
  MatMultiActionsInterface
} from '../../components/mat-dialog/mat-mutli-actions-dialog/mat-multi-actions.interface';
import { ToastrService } from 'ngx-toastr';
import { StudentDetailsStatusEnum } from '../../student/+state/enums/student-details-status.enum';
import { passwordsMatchValidator } from '../../validators/passwordMatchValidator';
import { StudentService } from '../../student/service/student.service';
import { LOGGED_IN_ADMIN_KEY } from '../+state/admin-details.reducer';
import { selectAdminDetails } from '../+state/admin.selector';
import { AdminActions } from '../+state/admin.action';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    LetDirective,
    CommonModule,
    ReactiveFormsModule,
    MatHeaderCell,
    MatTable,
    MatCell,
    MatColumnDef,
    MatCellDef,
    MatHeaderCellDef,
    MatHeaderRow,
    FaIconComponent,
    MatHeaderRowDef,
    MatRow,
    MatRowDef,
    LetDirective,
    MatPaginator
  ],
  templateUrl: './students.page.html',
  styleUrl: './students.page.scss'
})
export class StudentsPage implements OnInit, AfterViewInit, OnDestroy {
  public adminId: string;
  private router = inject(Router);
  private toastr = inject(ToastrService);
  private activatedRoute = inject(ActivatedRoute);
  private store = inject(Store);
  private studentService = inject(StudentService);
  protected popoverBoxService = inject(PopoverBoxService);
  public isSuperAdmin = false;
  private ngxMdDialogService = inject(NgxMdDialogService);
  private subscription$ = new Subscription();
  public search$ = new BehaviorSubject<string>('');
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  public displayedColumns = [
    'name',
    'universityID',
    'facultyAndMajor',
    'role',
    'status',
    'moreInfo'
  ];

  public dataSource = new MatTableDataSource<StudentItemBo>();
  public studentDetailsSelected$ = this.store.pipe(select(selectStudentDetails));
  public studentsListSelected$ = this.store.pipe(select(selectAllStudents));
  public adminDetailsSelected$ = this.store.pipe(
    select(selectAdminDetails)
  );

  ngOnInit(): void {
    this.adminId = this.activatedRoute.parent?.snapshot.paramMap.get('id');

    this.store.dispatch(AdminActions.loadMe());
    this.store.dispatch(StudentActions.loadStudents());

    this.subscription$.add(
      this.adminDetailsSelected$.subscribe((adminDetails) => {
        const loggedInAdmin = adminDetails?.[LOGGED_IN_ADMIN_KEY];

        this.isSuperAdmin = loggedInAdmin?.role === 'super_admin';
      })
    );

    this.studentDetailsSubscription();

    this.subscription$.add(
      combineLatest([
        this.studentsListSelected$,
        this.search$.pipe(
          debounceTime(200),
          distinctUntilChanged()
        )
      ]).subscribe(([state, search]) => {
        const students = state?.[STUDENT_KEY] ?? [];

        this.dataSource.data = this.filterStudents(students, search);

        if (this.paginator) {
          this.dataSource.paginator = this.paginator;
        }
      })
    );
  }

  public studentDetailsSubscription() {
    this.subscription$.add(
      this.studentDetailsSelected$.subscribe((studentDetails) => {
        if (!studentDetails) {
          return;
        }

        if (
          studentDetails.status === StudentDetailsStatusEnum.deleteSuccess
        ) {
          this.toastr.success(
            'Student deleted successfully',
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

        if (
          studentDetails.status === StudentDetailsStatusEnum.deleteFailure
        ) {
          this.toastr.error(
            studentDetails.error?.message ||
            'Something went wrong',
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

  private filterStudents(students: any[], search: string): any[] {
    if (!search) return students;

    const term = search.toLowerCase().trim();

    return students.filter(student => {
      return (
        student.name?.toLowerCase().includes(term) ||
        student.universityId?.toLowerCase().includes(term) ||
        student.major?.toLowerCase().includes(term) ||
        student.faculty?.toLowerCase().includes(term)
      );
    });
  }

  public async presentPopoverActions($event: MouseEvent, student: StudentItemBo) {
    this.popoverBoxService.openPanel($event, [
      {
        faIcon: ['fas', 'edit'],
        visible: true,
        label: 'Edit',
        handler: () => {
          this.navigateToEditStudent(student.id)
        }
      },
      {
        faIcon: ['fas', 'trash'],
        visible: true,
        label: 'Delete',
        handler: () => {
          this.presentDeleteAlert(student)
        }
      },
      {
        faIcon: ['fas', 'lock'],
        visible: this.isSuperAdmin,
        label: 'Update Password',
        handler: () => {
          this.presentUpdateStudentPasswordModal(student.id)
        }
      }
    ]);
  }

  public async presentUpdateStudentPasswordModal(studentId: string): Promise<void> {
    const dialogRef = this.ngxMdDialogService.openFormActionsDialog(
      {
        title: 'Update Student Password',
        faIcon: ['fas', 'lock'],
        message: 'Enter your admin password and choose a new password for this student.',

        formValidators: [
          passwordsMatchValidator('newPassword', 'confirmPassword')
        ],

        formErrorMessages: {
          passwordsMismatch: 'Passwords do not match'
        },

        inputs: [
          {
            controlName: 'superAdminPassword',
            label: 'Admin Password',
            placeholder: 'Enter your admin password',
            type: 'password',
            validators: [Validators.required],
            errorMessages: {
              required: 'Admin password is required'
            }
          },
          {
            controlName: 'newPassword',
            label: 'New Password',
            placeholder: 'Enter new student password',
            type: 'password',
            validators: [Validators.required, Validators.minLength(8)],
            errorMessages: {
              required: 'New password is required',
              minlength: 'New password must be at least 8 characters'
            }
          },
          {
            controlName: 'confirmPassword',
            label: 'Confirm Password',
            placeholder: 'Confirm new student password',
            type: 'password',
            validators: [Validators.required],
            errorMessages: {
              required: 'Confirm password is required'
            }
          }
        ],

        actions: [
          {
            label: 'Cancel',
            color: '#64748b',
            handler: () => {
              dialogRef.close();
            }
          },
          {
            label: 'Update',
            color: '#c4001a',
            closeOnClick: false,
            disabledWhenInvalid: true,
            handler: (formValue) => {
              this.studentService.updatePasswordBySuperAdmin(
                studentId,
                {
                  superAdminPassword: formValue.superAdminPassword,
                  newPassword: formValue.newPassword
                }
              ).subscribe({
                next: (response) => {
                  this.toastr.clear();

                  this.toastr.success(
                    response?.message || 'Student password updated successfully',
                    'Success',
                    {
                      positionClass: 'toast-top-right',
                      progressBar: true,
                      closeButton: true,
                      timeOut: 3000
                    }
                  );

                  dialogRef.close();
                },

                error: (error) => {
                  this.toastr.clear();

                  this.toastr.error(
                    error?.error?.message || 'Something went wrong',
                    'Cannot update password',
                    {
                      positionClass: 'toast-top-right',
                      progressBar: true,
                      closeButton: true,
                      timeOut: 4000
                    }
                  );
                }
              });
            }
          }
        ]
      },
      { width: '430px' }
    );
  }

  public presentDeleteAlert(student: StudentItemBo) {
    const matYesNoDialogData: MatMultiActionsInterface = {
      faIcon: ['fas', 'trash'],
      title: 'Delete Faculty?',
      message: student.name + ' will be permanently deleted!',
      action: [
        {
          label: 'yes delete',
          color: ' #d40000',
          handler: () => {
            this.deleteStudent(student.id);
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

  public deleteStudent(studentId: string) {
    this.store.dispatch(StudentActions.deleteStudent({
      id: studentId
    }))
  }

  public navigateToEditStudent(id: string): void {
    void this.router.navigate(['/admin', this.adminId, id, 'edit-student']);
  }

  navigateToAddStudentsPage() {
    const adminId = this.activatedRoute.parent?.snapshot.paramMap.get('id');

    if (!adminId) {
      console.error('Admin ID is missing from route');
      return;
    }

    void this.router.navigate(['/admin', adminId, 'add-new-student']);
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }

  protected readonly STUDENT_KEY = STUDENT_KEY;
}
