import { CreateAdminFormGroupInterface } from '../interfaces/create-admin-form-group.interface';
import { UpdateAdminFormGroupInterface } from '../interfaces/update-admin-form-group.interface';

export class AdminForUpdateDto {
  username: string;
  email: string;
  fullName: string;
  role: 'admin' | 'super_admin';

  constructor(adminFormValue: UpdateAdminFormGroupInterface) {
    this.username = adminFormValue.username;
    this.email = adminFormValue.email;
    this.fullName = adminFormValue.fullName;
    this.role = adminFormValue.role;
  }

  toJSON() {
    return {
      username: this.username,
      email: this.email,
      fullName: this.fullName,
      role: this.role
    };
  }
}
