import { Injectable } from '@angular/core';
import { LoginAdminClient } from '../../_clients/login/login-admin.client';
import { LoginAdminDto } from '../dto/login-admin.dto';
import { LoginAdminFormInterface } from '../interface/login-admin-form.interface';
import { UpdatePasswordFormInterface } from '../interface/update-password-form.interface';
import { UpdatePasswordDto } from '../dto/update-password.dto';

@Injectable({ providedIn: 'root' })
export class LoginAdminService {
  constructor(
    private loginAdminClient: LoginAdminClient) {
  }

  public loginAdmin(loginFormValue: LoginAdminFormInterface) {
    const loginDto = new LoginAdminDto(loginFormValue);
    return this.loginAdminClient.login(loginDto.toJSON());
  }

  public updatePassword(updatePasswordFormValue: UpdatePasswordFormInterface) {

    const updatePasswordDto = new UpdatePasswordDto(
      updatePasswordFormValue
    );

    return this.loginAdminClient.updatePassword(
      updatePasswordDto.toJSON()
    );
  }
}

