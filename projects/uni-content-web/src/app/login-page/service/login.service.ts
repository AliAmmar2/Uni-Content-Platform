import { Injectable } from '@angular/core';

import { LoginFormInterface } from '../interface/login-form.interface';
import { AuthDto } from '../dto/auth.dto';
import { LoginClient } from '../../_clients/login/login.client';

@Injectable({ providedIn: 'root' })
export class LoginService {
  constructor(
    private loginClient: LoginClient
  ) {
  }

  public login(loginFormValue: LoginFormInterface) {
    const loginDto = new AuthDto(loginFormValue);
    return this.loginClient.login(loginDto.toJSON());
  }
}

