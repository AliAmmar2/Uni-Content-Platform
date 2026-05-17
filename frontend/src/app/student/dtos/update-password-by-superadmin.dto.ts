import {
  UpdatePasswordBySuperadminFormGroupInterface
} from '../interfaces/update-password-by-superadmin-form-group.interface';

export class UpdatePasswordBySuperadminDto {
  superAdminPassword: string;
  newPassword: string;

  constructor(loginFormValue: UpdatePasswordBySuperadminFormGroupInterface) {
    this.superAdminPassword = loginFormValue.superAdminPassword;
    this.newPassword = loginFormValue.newPassword;
  }

  toJSON() {
    return { superAdminPassword: this.superAdminPassword, newPassword: this.newPassword };
  }
}
