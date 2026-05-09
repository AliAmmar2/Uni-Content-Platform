import { Injectable } from '@angular/core';
import { LoginAdminClient } from '../../_clients/login/login-admin.client';
import { LoginAdminDto } from '../dto/login-admin.dto';
import { LoginAdminFormInterface } from '../interface/login-admin-form.interface';

@Injectable({ providedIn: 'root' })
export class LoginAdminService {
  constructor(
    private loginAdminClient: LoginAdminClient) {
  }

  public loginAdmin(loginFormValue: LoginAdminFormInterface) {
    const loginDto = new LoginAdminDto(loginFormValue);
    return this.loginAdminClient.login(loginDto.toJSON());
  }

}

