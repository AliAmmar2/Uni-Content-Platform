import { Routes } from '@angular/router';
import { LoginPage } from './login-page/login.page';
import { RegisterPage } from './reigister-page/register.page';
import { StudentDashboardPage } from './student/dashboard/student-dashboard.page';
import { PortalAdminPage } from './portal-admin/dashboard/portal-admin-page.component';
import { FacultyPage } from './faculty/faculty.page';
import { AddNewFacultyPage } from './faculty/add-new-faculty/add-new-faculty.page';
import { StudentsPage } from './student/students.page';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    component: LoginPage
  },
  {
    path: 'register',
    component: RegisterPage
  },
  {
    path: 'students/:universityId',
    component: StudentDashboardPage
  },
  {
    path: 'students/:universityId/announcements',
    component: StudentDashboardPage
  },
  {
    path: 'admin/:id',
    component: PortalAdminPage,
    children: [
      // { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'faculties',
        component: FacultyPage
      },
      {
        path: 'students',
        component: StudentsPage
      }
      , {
        path: 'add-new-faculty',
        component: AddNewFacultyPage
      }
    ]
  }
];
