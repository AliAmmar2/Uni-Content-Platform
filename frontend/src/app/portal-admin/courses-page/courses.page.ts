import { AfterViewInit, Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { select, Store } from '@ngrx/store';
import { LetDirective } from '@ngrx/component';

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

import { FaIconComponent } from '@fortawesome/angular-fontawesome';

import { COURSE_KEY } from '../../courses/+state/course.reducer';
import { selectAllCourses, selectCourseDetails } from '../../courses/+state/courses.selector';
import { CourseActions } from '../../courses/+state/courses.action';
import { selectAllMajors } from '../../major/+state/major.selector';
import { MajorActions } from '../../major/+state/major.action';
import { MAJOR_KEY } from '../../major/+state/major.reducer';
import {
  MatMultiActionsInterface
} from '../../components/mat-dialog/mat-mutli-actions-dialog/mat-multi-actions.interface';
import { CourseItemBo } from '../../courses/bo/course-item.bo';
import { PopoverBoxService } from '../../components/mat-pop-over-box/src';
import { NgxMdDialogService } from '../../components/mat-dialog/service/ngx-md-dialog.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseStatusEnum } from '../../courses/+state/enums/course-status.enum';
import { ToastrService } from 'ngx-toastr';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LetDirective,

    MatTable,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderCellDef,
    MatCell,
    MatCellDef,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow,
    MatRowDef,
    MatPaginator,

    FaIconComponent
  ],
  templateUrl: './courses.page.html',
  styleUrl: './courses.page.scss'
})
export class CoursesPage implements OnInit, AfterViewInit, OnDestroy {

  public adminId: string;
  private store = inject(Store);
  private router = inject(Router);
  private subscription$ = new Subscription();
  private toastr = inject(ToastrService);
  private activatedRoute = inject(ActivatedRoute);
  protected popoverBoxService = inject(PopoverBoxService);
  private ngxMdDialogService = inject(NgxMdDialogService);
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  public displayedColumns: string[] = [
    'course',
    'major',
    'year',
    'semester',
    'credits',
    'actions'
  ];

  public dataSource = new MatTableDataSource<any>([]);

  /* FILTERS */
  public search$ = new BehaviorSubject<string>('');
  public selectedMajor$ = new BehaviorSubject<string>('');
  public selectedYear$ = new BehaviorSubject<string>('');
  public selectedSemester$ = new BehaviorSubject<string>('');

  /* STORE */
  public coursesListSelected$ = this.store.pipe(select(selectAllCourses));
  public majorsListSelected$ = this.store.pipe(select(selectAllMajors));
  public courseDetailsSelected$ = this.store.pipe(select(selectCourseDetails));

  ngOnInit(): void {
    this.adminId = this.activatedRoute.parent?.snapshot.paramMap.get('id');
    this.coursesSubscription();
    this.courseDetailsSubscription();
    this.store.dispatch(CourseActions.loadAllCourses());

    this.store.dispatch(MajorActions.loadMajors());
  }
  public courseDetailsSubscription(): void { 
    this.subscription$.add(
      this.courseDetailsSelected$.subscribe((courseDetailsState) => {
        if (!courseDetailsState?.status) {
          return;
        }

        if (courseDetailsState.status === CourseStatusEnum.deleteSuccess) {
          this.toastr.clear();

          this.toastr.success(
            'Course deleted successfully',
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

        if (courseDetailsState.status === CourseStatusEnum.deleteFailure) {
          this.toastr.clear();

          this.toastr.error(
            courseDetailsState.error?.message || 'Something went wrong',
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


  public coursesSubscription(): void {
    this.subscription$.add(
      combineLatest([

        this.coursesListSelected$,

        this.search$.pipe(
          debounceTime(200),
          distinctUntilChanged()
        ),

        this.selectedMajor$,
        this.selectedYear$,
        this.selectedSemester$

      ]).subscribe(([coursesState, search, major, year, semester]) => {

        const coursesList =
          coursesState?.[COURSE_KEY] ?? [];

        this.dataSource.data = this.filterCourses(
          coursesList,
          search,
          major,
          year,
          semester
        );

        if (this.paginator) {
          this.dataSource.paginator = this.paginator;
        }

      })
    );
  }

  private filterCourses(
    courses: CourseItemBo[],
    search: string,
    majorId: string,
    year: string,
    semester: string
  ): CourseItemBo[] {

    const term = search.toLowerCase().trim();

    return courses.filter((course) => {

      const courseMajorId =
        course.major?.id ??
        (course.major as any)?._id ??
        '';

      const matchesSearch =
        !term ||
        course.name?.toLowerCase().includes(term) ||
        course.code?.toLowerCase().includes(term);

      const matchesMajor =
        !majorId ||
        courseMajorId === majorId;

      const matchesYear =
        !year ||
        course.academicYear?.toString() === year;

      const matchesSemester =
        !semester ||
        course.semester === semester;

      return (
        matchesSearch &&
        matchesMajor &&
        matchesYear &&
        matchesSemester
      );
    });
  }

  public async presentPopoverActions($event: MouseEvent, course: CourseItemBo) {
    this.popoverBoxService.openPanel($event, [
      {
        faIcon: ['fas', 'edit'],
        visible: true,
        label: 'Edit',
        handler: () => {
          this.navigateToEditCourse(course.id)
        }
      },
      {
        faIcon: ['fas', 'trash'],
        visible: true,
        label: 'Delete',
        handler: () => {
          this.presentDeleteAlert(course)

        }
      }
    ]);
  }

  public navigateToAddNewCourse(): void {
    void this.router.navigate(['/admin', this.adminId, 'add-new-course']);
  }

  public navigateToEditCourse(id: string): void {
    void this.router.navigate(['/admin', this.adminId, id, 'edit-course']);
  }

  public presentDeleteAlert(course: CourseItemBo) {
    const matYesNoDialogData: MatMultiActionsInterface = {
      faIcon: ['fas', 'trash'],
      title: 'Delete Course?',
      message: course.name + ' will be permanently deleted!',
      action: [
        {
          label: 'yes delete',
          color: ' #d40000',
          handler: () => {
            this.deleteCourse(course.id);
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

  public deleteCourse(id: string): void {
    this.store.dispatch(CourseActions.deleteCourse({ id }));
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }

  protected readonly MAJOR_KEY = MAJOR_KEY;
}
