import {
  AfterViewInit,
  Component,
  ViewChild,
  inject,
  OnDestroy,
  OnInit
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { Store, select } from '@ngrx/store';
import { BehaviorSubject, combineLatest, debounceTime, distinctUntilChanged, Subscription } from 'rxjs';

import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef,
  MatTable,
  MatTableDataSource
} from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

import { LetDirective } from '@ngrx/component';

import { StudentActions } from '../../student/+state/student.action';
import { selectAllStudents } from '../../student/+state/student.selector';
import { STUDENT_KEY } from '../../student/+state/student.reducer';
import { StudentItemBo } from '../../student/bo/student-item.bo';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { ReactiveFormsModule } from '@angular/forms';

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

  private store = inject(Store);
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

  public studentsListSelected$ = this.store.pipe(select(selectAllStudents));

  ngOnInit(): void {
    this.store.dispatch(StudentActions.loadStudents());

    this.subscription$.add(
      combineLatest([
        this.studentsListSelected$,
        this.search$.pipe(
          debounceTime(200),
          distinctUntilChanged()
        )
      ]).subscribe(([state, search]) => {

        const students = state?.[STUDENT_KEY] ?? [];

        const filtered = this.filterStudents(students, search);

        this.dataSource.data = filtered;

        if (this.paginator) {
          this.dataSource.paginator = this.paginator;
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
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
}
