import { AuthInterface } from '../../_clients/login/auth.interface';
import { RegisterFormInterface } from '../interface/register-form.interface';

export class RegisterDto implements AuthInterface {
  universityEmail: string;
  universityId: string;
  password: string;
  confirmPassword: string;

  constructor(registerFormInterface: RegisterFormInterface) {
    this.universityEmail = registerFormInterface.universityEmail;
    this.universityId = registerFormInterface.universityId;
    this.password = registerFormInterface.password;
    this.confirmPassword = registerFormInterface.confirmPassword;
  }

  toJSON() {
    return this;
  }
}
