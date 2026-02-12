import { AuthInterface } from '../../_clients/login/auth.interface';

export class AuthDto implements AuthInterface {
	email: string;
  universityId: string;
	password: string;

	constructor(loginFormValue: {  universityId: string,email: string, password: string }) {
		this.email = loginFormValue.email;
    this.universityId = loginFormValue.universityId;
		this.password = loginFormValue.password;
	}

	toJSON(): AuthInterface {
		return { password: this.password, email: this.email, universityId: this.universityId };
	}
}
