export interface AdminModel {
  _id?: string;
  username: string;
  email: string;
  fullName: string;
  lastLogin?: Date;
  loginAttempts?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
