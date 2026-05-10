export interface AdminDetailsModel {
  _id?: string;
  username: string;
  email: string;
  fullName: string;

  role: 'admin' | 'super_admin';

  lastLogin?: Date;
  loginAttempts?: number;

  createdAt?: Date;
  updatedAt?: Date;
}
