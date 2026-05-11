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
import { selectAllCourses } from '../../courses/+state/courses.selector';
import { CourseActions } from '../../courses/+state/courses.action';
import { selectAllMajors } from '../../major/+state/major.selector';
import { MajorActions } from '../../major/+state/major.action';
import { MAJOR_KEY } from '../../major/+state/major.reducer';

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

  private store = inject(Store);

  private subscription$ = new Subscription();

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

  ngOnInit(): void {

    this.store.dispatch(CourseActions.loadAllCourses());
    this.store.dispatch(MajorActions.loadMajors());

    this.coursesSubscription();
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
    courses: any[],
    search: string,
    major: string,
    year: string,
    semester: string
  ): any[] {

    const term = search.toLowerCase().trim();

    return courses.filter(course => {

      const matchesSearch =
        !term ||
        course.name?.toLowerCase()?.includes(term) ||
        course.code?.toLowerCase()?.includes(term);

      const matchesMajor =
        !major ||
        course.majorName === major;

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

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }

  protected readonly MAJOR_KEY = MAJOR_KEY;
}
