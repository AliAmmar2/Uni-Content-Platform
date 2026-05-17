import { AdminModel } from '../../_clients/admin/models/admin.model';

export class AdminItemBo {
  id?: string;
  username: string;
  email: string;
  role: 'admin' | 'super_admin';
  fullName: string;
  lastLogin?: Date;

  constructor(adminModel: AdminModel) {
    this.id = adminModel._id;
    this.username = adminModel.username;
    this.role=adminModel.role;
    this.email = adminModel.email;
    this.fullName = adminModel.fullName;
    this.lastLogin = adminModel.lastLogin;
  }
}
