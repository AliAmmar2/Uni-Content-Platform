import { AdminDetailsModel } from '../../_clients/admin/models/admin-details.model';

export class AdminDetailsBo {
  id?: string;
  username: string;
  email: string;
  fullName: string;
  role: 'admin' | 'super_admin';
  lastLogin?: Date;
  lastPasswordUpdate?: Date;
  loginAttempts?: number;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(adminModel: AdminDetailsModel) {
    this.id = adminModel._id;
    this.username = adminModel.username;
    this.email = adminModel.email;
    this.fullName = adminModel.fullName;
    this.role = adminModel.role;
    this.lastLogin = adminModel.lastLogin;
    this.lastPasswordUpdate = adminModel.lastPasswordUpdate;
    this.loginAttempts = adminModel.loginAttempts;
    this.createdAt = adminModel.createdAt;
    this.updatedAt = adminModel.updatedAt;
  }
}
