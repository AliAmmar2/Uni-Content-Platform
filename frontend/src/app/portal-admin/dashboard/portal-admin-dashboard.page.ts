import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { DashboardUiService } from '../services/dashboard-ui.service';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    FaIconComponent,
    RouterOutlet
  ],
  templateUrl: './portal-admin-dashboard.page.html',
  styleUrl: './portal-admin-dashboard.page.scss'
})
export class PortalAdminDashboardPage {
  activeMenu: string = 'dashboard';

  isSidebarOpen = false;

  private router = inject(Router);
  private dashboardUiService = inject(DashboardUiService);

  public setActiveMenu(menu: string): void {
    this.dashboardUiService.setActiveMenu(menu);
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  public logout() {
    this.dashboardUiService.clearMenu();
    void this.router.navigate(['/login']);
  }
}
