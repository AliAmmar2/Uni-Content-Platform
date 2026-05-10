export interface UpdateAdminFormGroupInterface {
  username: string;
  email: string;
  fullName: string;
  role?: 'admin' | 'super_admin';
}
