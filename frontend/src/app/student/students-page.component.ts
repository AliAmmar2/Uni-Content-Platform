import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { Observable, Subscription } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { LetDirective } from '@ngrx/component';
import { DashboardUiService } from '../portal-admin/services/dashboard-ui.service';
import { selectStudentDetails } from './+state/student.selector';
import { StudentActions } from './+state/student.action';
import { LOGGED_IN_STUDENT_KEY } from './+state/student-details.reducer';

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
  templateUrl: './students-page.component.html',
  styleUrl: './student-page.component.scss'
})
export class StudentsPageComponent implements OnInit {
  public studentId: string;
  isSidebarOpen = false;

  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  public store = inject(Store);
  private dashboardUiService = inject(DashboardUiService);
  public studentDetailsSelected$ = this.store.pipe(select(selectStudentDetails));
  activeMenu$: Observable<string> = this.dashboardUiService.activeMenu$;
  private subscription$ = new Subscription();

  ngOnInit(): void {
    const accessToken = localStorage.getItem('accessToken');

    if (!accessToken) {
      void this.router.navigate(['/login']);
      return;
    }

    this.studentId = this.activatedRoute.snapshot.paramMap.get('universityId');

    this.store.dispatch(StudentActions.loadMe());

    const currentUrl = this.router.url;

    if (currentUrl.includes('/dashboard')) {
      this.dashboardUiService.setActiveMenu('dashboard');
    } else if (currentUrl.includes('/account-settings')) {
      this.dashboardUiService.setActiveMenu('account-settings');
    } else if (currentUrl.includes('/announcements')) {
      this.dashboardUiService.setActiveMenu('announcements');
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
    this.subscription$.unsubscribe();
    this.dashboardUiService.clearMenu();
    void this.router.navigate(['/login']);
  }

  protected readonly LOGGED_IN_STUDENT_KEY = LOGGED_IN_STUDENT_KEY;
}
