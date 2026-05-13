import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { DashboardUiService } from './services/dashboard-ui.service';
import { Observable, Subscription } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { selectAdminDetails } from './+state/admin.selector';
import { AdminActions } from './+state/admin.action';
import { LetDirective } from '@ngrx/component';
import { ADMIN_DETAILS_KEY, LOGGED_IN_ADMIN_KEY } from './+state/admin-details.reducer';
import { MajorActions } from '../major/+state/major.action';
import { FacultyActions } from '../faculty/+state/faculty.action';
import { StudentActions } from '../student/+state/student.action';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    FaIconComponent,
    RouterOutlet,
    LetDirective
  ],
  templateUrl: './portal-admin-page.component.html',
  styleUrl: './portal-admin-page.component.scss'
})
export class PortalAdminPage implements OnInit {
  public adminId: string;
  isSidebarOpen = false;

  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  public store = inject(Store);
  private dashboardUiService = inject(DashboardUiService);
  public adminDetailsSelected$ = this.store.pipe(select(selectAdminDetails));
  activeMenu$: Observable<string> = this.dashboardUiService.activeMenu$;
  private subscription$ = new Subscription();

  ngOnInit(): void {
    const accessToken = localStorage.getItem('accessToken');

    if (!accessToken) {
      void this.router.navigate(['/login']);
      return;
    }

    this.adminId = this.activatedRoute.snapshot.paramMap.get('id');

    this.store.dispatch(AdminActions.loadMe());

    const currentUrl = this.router.url;

    if (currentUrl.includes('/faculties')) {
      this.dashboardUiService.setActiveMenu('faculties');
    } else if (currentUrl.includes('/students')) {
      this.dashboardUiService.setActiveMenu('students');
    } else if (currentUrl.includes('/admins')) {
      this.dashboardUiService.setActiveMenu('admins');
    } else if (currentUrl.includes('/dashboard')) {
      this.dashboardUiService.setActiveMenu('dashboard');
    } else if (currentUrl.includes('/majors')) {
      this.dashboardUiService.setActiveMenu('majors');
    } else if (currentUrl.includes('/courses')) {
      this.dashboardUiService.setActiveMenu('courses');
    }
  }

  public setActiveMenu(menu: string): void {
    this.dashboardUiService.setActiveMenu(menu);
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  public logout() {
    localStorage.removeItem('accessToken');
    this.store.dispatch(AdminActions.resetAdminState());
    this.store.dispatch(MajorActions.resetMajorState());
    this.store.dispatch(FacultyActions.resetFacultyState());
    this.store.dispatch(StudentActions.resetStudentState());
    this.subscription$.unsubscribe();
    this.dashboardUiService.clearMenu();
    void this.router.navigate(['/login']);
  }

  protected readonly ADMIN_DETAILS_KEY = ADMIN_DETAILS_KEY;
  protected readonly LOGGED_IN_ADMIN_KEY = LOGGED_IN_ADMIN_KEY;
}
