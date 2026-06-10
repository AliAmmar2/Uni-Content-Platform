export class UpdatePasswordDto {
  oldPassword: string;
  newPassword: string;

  constructor(loginFormValue: { oldPassword: string, newPassword: string }) {
    this.oldPassword = loginFormValue.oldPassword;
    this.newPassword = loginFormValue.newPassword;
  }

  toJSON() {
    return { oldPassword: this.oldPassword, newPassword: this.newPassword };
  }
}
