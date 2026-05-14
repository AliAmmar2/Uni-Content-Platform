import { Routes } from '@angular/router';
import { LoginPage } from './login-page/login.page';
import { RegisterPage } from './reigister-page/register.page';
import { StudentDashboardPage } from './student/dashboard/student-dashboard.page';
import { PortalAdminPage } from './portal-admin/portal-admin-page.component';
import { FacultyPage } from './portal-admin/faculty-page/faculty.page';
import { EditFacultyPage } from './portal-admin/edit-faculty-page/edit-faculty.page';
import { StudentsPage } from './portal-admin/students-page/students.page';
import { MajorPage } from './portal-admin/majors-page/major.page';
import { EditMajorPage } from './portal-admin/edit-major-page/edit-major.page';
import { MajorDetailsPage } from './portal-admin/major-details-page/major-details.page';
import { CoursesPage } from './portal-admin/courses-page/courses.page';
import { DashboardPage } from './portal-admin/dashboard-page/dashboard.page';
import { AccountSettingsPage } from './portal-admin/account-settings-page/account-settings.page';
import { EditStudentPage } from './portal-admin/edit-student-page/edit-student.page';
import { AdminsPage } from './portal-admin/admins-page/admins.page';
import { EditAdminPage } from './portal-admin/edit-admin-page/edit-admin.page';
import { EditCoursePage } from './portal-admin/edit-course-page/edit-course.page';

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
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'faculties',
        component: FacultyPage
      }
      , {
        path: 'admins',
        component: AdminsPage
      },
      {
        path: 'majors',
        component: MajorPage
      },
      {
        path: 'students',
        component: StudentsPage
      },
      {
        path: 'account-settings',
        component: AccountSettingsPage
      },
      {
        path: 'dashboard',
        component: DashboardPage
      },
      {
        path: 'courses',
        component: CoursesPage
      }
      ,
      {
        path: 'add-new-faculty',
        component: EditFacultyPage
      },
      {
        path: 'add-new-student',
        component: EditStudentPage
      },
      {
        path: 'add-new-admin',
        component: EditAdminPage
      },
      {
        path: 'add-new-course',
        component: EditCoursePage
      },
      {
        path: ':facultyId/edit-faculty',
        component: EditFacultyPage
      }
      , {
        path: ':studentId/edit-student',
        component: EditStudentPage
      },
      {
        path: ':adminId/edit-admin',
        component: EditAdminPage
      },
      {
        path: ':courseId/edit-course',
        component: EditCoursePage
      },
      {
        path: ':majorId/add-new-course',
        component: EditCoursePage
      }
      ,
      {
        path: 'add-new-major',
        component: EditMajorPage
      },
      {
        path: ':majorId/edit-major',
        component: EditMajorPage
      },
      {
        path: ':majorId/details',
        component: MajorDetailsPage
      }
    ]
  }
];
