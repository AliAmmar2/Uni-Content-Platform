import { AuthInterface } from '../../_clients/login/auth.interface';

export class AuthDto implements AuthInterface {
  universityEmail: string;
  universityId: string;
  password: string;

  constructor(loginFormValue: { universityId: string, universityEmail: string, password: string }) {
    this.universityEmail = loginFormValue.universityEmail;
    this.universityId = loginFormValue.universityId;
    this.password = loginFormValue.password;
  }

  toJSON(): AuthInterface {
    return { universityEmail: this.universityEmail, universityId: this.universityId, password: this.password };
  }
}
