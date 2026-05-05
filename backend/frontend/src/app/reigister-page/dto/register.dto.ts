import { AuthInterface } from '../../_clients/login/auth.interface';
import { RegisterFormInterface } from '../interface/register-form.interface';

export class RegisterDto implements AuthInterface {
  fullName:string;
  universityEmail: string;
  universityId: string;
	password: string;
	confirmPassword: string;

	constructor(registerFormInterface:RegisterFormInterface) {
		this.universityEmail = registerFormInterface.universityEmail;
		this.fullName = registerFormInterface.fullName;
    this.universityId = registerFormInterface.universityId;
		this.password = registerFormInterface.password;
		this.confirmPassword = registerFormInterface.confirmPassword;
	}

	toJSON() {
		return this;
	}
}
