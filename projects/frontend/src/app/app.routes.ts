import { Routes } from '@angular/router';
import { LoginPage } from './login-page/login.page';
import { RegisterPage } from './reigister-page/register.page';
import { StudentDashboardPage } from './student-dashboard/student-dashboard.page';

export const routes: Routes = [
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
];
