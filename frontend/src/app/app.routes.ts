import { Routes } from '@angular/router';
import { LoginPage } from './login-page/login.page';
import { RegisterPage } from './reigister-page/register.page';
import { StudentDashboardPage } from './student/dashboard/student-dashboard.page';
import { PortalAdminPage } from './portal-admin/portal-admin-page.component';
import { FacultyPage } from './portal-admin/faculty-page/faculty.page';
import { EditNewFacultyPage } from './portal-admin/edit-faculty-page/edit-new-faculty.page';
import { StudentsPage } from './portal-admin/students-page/students.page';
import { MajorPage } from './portal-admin/majors-page/major.page';
import { EditMajorPage } from './portal-admin/add-new-major-page/edit-major.page';
import { MajorDetailsPage } from './portal-admin/major-details-page/major-details.page';
import { CoursesPage } from './portal-admin/courses-page/courses.page';
import { DashboardPage } from './portal-admin/dashboard-page/dashboard.page';

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
        path: 'majors',
        component: MajorPage
      },
      {
        path: 'students',
        component: StudentsPage
      } ,
      {
        path: 'dashboard',
        component: DashboardPage
      } ,
      {
        path: 'courses',
        component: CoursesPage
      }
      ,
      {
        path: 'add-new-faculty',
        component: EditNewFacultyPage
      },
      {
        path: ':facultyId/edit',
        component: EditNewFacultyPage
      }
      ,
      {
        path: 'add-new-major',
        component: EditMajorPage
      },
      {
        path: ':majorId/edit',
        component: EditMajorPage
      },
      {
        path: ':majorId/details',
        component: MajorDetailsPage
      }
    ]
  }
];
