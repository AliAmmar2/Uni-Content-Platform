import { Routes } from '@angular/router';
import { LoginPage } from './login-page/login.page';
import { RegisterPage } from './reigister-page/register.page';

export const routes: Routes = [
   {
    path: 'login',
    component: LoginPage
  },
  {
    path: 'register',
    component: RegisterPage
  }
];
