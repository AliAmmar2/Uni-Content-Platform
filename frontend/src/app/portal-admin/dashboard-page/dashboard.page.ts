import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, } from '@angular/core';

import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { select, Store } from '@ngrx/store';

import { combineLatest, map, Subscription } from 'rxjs';

import { FaIconComponent } from '@fortawesome/angular-fontawesome';

import {
  faBookOpen,
  faEllipsisVertical,
  faGraduationCap,
  faPen,
  faRightFromBracket,
  faSchool,
  faUserGraduate,
  faUserPlus,
} from '@fortawesome/free-solid-svg-icons';

import { selectAllStudents } from '../../student/+state/student.selector';
import { selectAllCourses } from '../../courses/+state/courses.selector';
import { selectAllMajors } from '../../major/+state/major.selector';
import { selectAllFaculties } from '../../faculty/+state/faculty.selector';

import { STUDENT_KEY } from '../../student/+state/student.reducer';
import { FACULTY_KEY } from '../../faculty/+state/faculty.reducer';
import { MAJOR_KEY } from '../../major/+state/major.reducer';
import { COURSE_KEY } from '../../courses/+state/course.reducer';

import { MajorActions } from '../../major/+state/major.action';
import { FacultyActions } from '../../faculty/+state/faculty.action';
import { StudentActions } from '../../student/+state/student.action';
import { CourseActions } from '../../courses/+state/courses.action';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminActions } from '../+state/admin.action';
import { selectAdminDetails } from '../+state/admin.selector';
import { LetDirective } from '@ngrx/component';
import { LOGGED_IN_ADMIN_KEY } from '../+state/admin-details.reducer';
import { DashboardUiService } from '../services/dashboard-ui.service';

interface StatisticCard {
  title: string;
  value: number;
  icon: any;
  variant: 'primary' | 'secondary' | 'dark' | 'light';
}

interface QuickAction {
  title: string;
  icon: any;
  route: string;
}

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FaIconComponent,
    LetDirective,
  ],
  templateUrl: './dashboard.page.html',
  styleUrl: './dashboard.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPage implements OnInit, OnDestroy {
  public adminId: string;
  private readonly store = inject(Store);
  private readonly subscription$ = new Subscription();
  private activatedRoute = inject(ActivatedRoute);
  private dashboardUiService = inject(DashboardUiService);
  protected readonly faEllipsisVertical = faEllipsisVertical;
  protected readonly faPen = faPen;
  protected readonly faRightFromBracket = faRightFromBracket;
  private router = inject(Router);
  public readonly adminDetailsSelected$ =
    this.store.pipe(select(selectAdminDetails));

  public readonly studentsListSelected$ =
    this.store.pipe(select(selectAllStudents));

  public readonly facultyListSelected$ =
    this.store.pipe(select(selectAllFaculties));

  public readonly courseListSelected$ =
    this.store.pipe(select(selectAllCourses));

  public readonly majorListSelected$ =
    this.store.pipe(select(selectAllMajors));

  public readonly statistics$ = combineLatest([
    this.studentsListSelected$,
    this.facultyListSelected$,
    this.courseListSelected$,
    this.majorListSelected$,
  ]).pipe(
    map(([students, faculties, courses, majors]) => {
      return [
        {
          title: 'Total Students',
          value: students[STUDENT_KEY]?.length ?? 0,
          icon: faUserGraduate,
          variant: 'primary',
        },
        {
          title: 'Total Faculties',
          value: faculties[FACULTY_KEY]?.length ?? 0,
          icon: faSchool,
          variant: 'secondary',
        },
        {
          title: 'Total Majors',
          value: majors[MAJOR_KEY]?.length ?? 0,
          icon: faGraduationCap,
          variant: 'dark',
        },
        {
          title: 'Total Courses',
          value: courses[COURSE_KEY]?.length ?? 0,
          icon: faBookOpen,
          variant: 'light',
        },
      ] as StatisticCard[];
    })
  );

  public readonly quickActions: QuickAction[] = [
    {
      title: 'Add Student',
      icon: faUserPlus,
      route: 'add-new-student',
    },
    {
      title: 'Create Faculty',
      icon: faSchool,
      route: 'add-new-faculty',
    },
    {
      title: 'Create Major',
      icon: faGraduationCap,
      route: 'add-new-major',
    }
  ];

  ngOnInit(): void {
    this.adminId = this.activatedRoute.parent?.snapshot.paramMap.get('id');
    this.store.dispatch(AdminActions.loadMe());
    this.store.dispatch(MajorActions.loadMajors());
    this.store.dispatch(FacultyActions.loadFaculties());
    this.store.dispatch(StudentActions.loadStudents());
    this.store.dispatch(CourseActions.loadAllCourses());
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }

  public onQuickAction(route: string): void {
    void this.router.navigate(['/admin', this.adminId, route]);
  }

  public onEditAccount(): void {
    void this.router.navigate(['/admin', this.adminId, 'account-settings']);
  }

  public onSignOut(): void {
    this.dashboardUiService.clearMenu();
    void this.router.navigate(['/login']);
  }

  getInitials(fullName: string | undefined): string {
    if (!fullName) return '';

    const words = fullName.trim().split(' ');

    const first = words[0]?.charAt(0) ?? '';
    const second = words[1]?.charAt(0) ?? '';

    return (first + second).toUpperCase();
  }

  protected readonly LOGGED_IN_ADMIN_KEY = LOGGED_IN_ADMIN_KEY;
}
