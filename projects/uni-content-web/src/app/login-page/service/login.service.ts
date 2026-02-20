import { Injectable } from '@angular/core';

import { LoginFormInterface } from '../interface/login-form.interface';
import { AuthDto } from '../dto/auth.dto';
import { LoginClient } from '../../_clients/login/login.client';
import { RegisterFormInterface } from '../../reigister-page/interface/register-form.interface';
import { RegisterDto } from '../../reigister-page/dto/register.dto';

@Injectable({ providedIn: 'root' })
export class LoginService {
  constructor(
    private loginClient: LoginClient) {
  }

  public login(loginFormValue: LoginFormInterface) {
    const loginDto = new AuthDto(loginFormValue);
    return this.loginClient.login(loginDto.toJSON());
  }

  public register(registerFormValue: RegisterFormInterface) {
    const registerDto = new RegisterDto(registerFormValue);
    return this.loginClient.register(registerDto.toJSON());
  }
}

