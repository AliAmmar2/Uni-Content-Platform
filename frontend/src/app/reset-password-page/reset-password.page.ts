import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { StudentService } from '../student/service/student.service';
import { ToastrService } from 'ngx-toastr';
import { MajorItemBo } from '../major/bo/major-item.bo';
import {
  MatMultiActionsInterface
} from '../components/mat-dialog/mat-mutli-actions-dialog/mat-multi-actions.interface';
import { NgxMdDialogService } from '../components/mat-dialog/service/ngx-md-dialog.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reset-password.page.html'
})
export class ResetPasswordPage {

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private studentService = inject(StudentService);
  private toastr = inject(ToastrService);
  token = this.route.snapshot.queryParamMap.get('token');

  form = this.fb.group({
    newPassword: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', [Validators.required]]
  });

  submit() {

    if (this.form.value.newPassword !== this.form.value.confirmPassword) {
      this.toastr.error('Passwords do not match');
      return;
    }

    if (!this.token) {
      this.toastr.error('Invalid or missing token');
      return;
    }

    this.studentService.resetPassword({
      token: this.token,
      password: this.form.value.newPassword!
    }).subscribe({
      next: () => {
        this.toastr.success('Password reset successful');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.toastr.error(err?.error?.message || 'Reset failed');
      }
    });
  }

}

