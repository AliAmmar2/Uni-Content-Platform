export class LoginAdminDto {
  username: string;
  password: string;

  constructor(loginFormValue: { username: string, password: string }) {
    this.username = loginFormValue.username;
    this.password = loginFormValue.password;
  }

  toJSON() {
    return { username: this.username, password: this.password };
  }
}
