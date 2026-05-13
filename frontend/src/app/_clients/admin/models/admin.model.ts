export interface AdminModel {
  _id?: string;
  username: string;
  email: string;
  fullName: string;
  role: 'admin' | 'super_admin';
  lastLogin?: Date;
  lastPasswordUpdate?: Date;
  loginAttempts?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
