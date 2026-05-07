import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { DashboardUiService } from '../services/dashboard-ui.service';
import { Observable } from 'rxjs';

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
export class PortalAdminDashboardPage implements OnInit {
  public adminId: string;
  activeMenu: string = '';
  isSidebarOpen = false;

  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private dashboardUiService = inject(DashboardUiService);
  activeMenu$: Observable<string> = this.dashboardUiService.activeMenu$;


  ngOnInit(): void {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      this.router.navigate(['/login']);
    }
    this.adminId = this.activatedRoute.snapshot.paramMap.get('universityId');
  }

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
