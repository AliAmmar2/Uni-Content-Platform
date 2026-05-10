import { CreateAdminFormGroupInterface } from '../interfaces/create-admin-form-group.interface';

export class AdminForCreationDto {
  username: string;
  email: string;
  fullName: string;
  password: string;
  role: 'admin' | 'super_admin';

  constructor(adminFormValue: CreateAdminFormGroupInterface) {
    this.username = adminFormValue.username;
    this.email = adminFormValue.email;
    this.fullName = adminFormValue.fullName;
    this.password = adminFormValue.password;
    this.role = adminFormValue.role;
  }

  toJSON() {
    return {
      username: this.username,
      email: this.email,
      fullName: this.fullName,
      password: this.password,
      role: this.role
    };
  }
}
