export interface CreateAdminFormGroupInterface {
  username: string;
  email: string;
  fullName: string;
  password: string;
  role: 'admin' | 'super_admin';
}
