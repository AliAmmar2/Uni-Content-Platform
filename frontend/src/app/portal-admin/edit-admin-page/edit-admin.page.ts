import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { AdminActions } from '../+state/admin.action';
import { selectAdminDetails } from '../+state/admin.selector';
import { ADMIN_DETAILS_KEY } from '../+state/admin-details.reducer';
import { AdminStatusEnum } from '../+state/enums/admin-status.enum';

@Component({
  selector: 'app-edit-admin',
  templateUrl: './edit-admin.page.html',
  styleUrls: ['./edit-admin.page.scss'],
  imports: [
    ReactiveFormsModule,
    FaIconComponent
  ]
})
export class EditAdminPage implements OnInit, OnDestroy {
  private store = inject(Store);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  public adminId = '';
  public editAdminId: string | null = null;
  public isEditMode = false;
  public showPassword = false;

  public adminForm: FormGroup;

  public adminDetailsSelected$ = this.store.pipe(
    select(selectAdminDetails)
  );

  private subscription$ = new Subscription();

  constructor() {
    this.adminForm = new FormGroup({
      fullName: new FormControl('', Validators.required),
      username: new FormControl('', Validators.required),
      email: new FormControl('', [
        Validators.required,
        Validators.email
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8)
      ]),
      role: new FormControl<'admin' | 'super_admin'>('admin', Validators.required)
    });
  }

  ngOnInit(): void {
    this.adminId = this.activatedRoute.parent?.snapshot.paramMap.get('id') ?? '';
    this.editAdminId = this.activatedRoute.snapshot.paramMap.get('adminId');
    this.isEditMode = !!this.editAdminId;

    this.configurePasswordField();
    this.adminDetailsSubscription();

    if (this.isEditMode && this.editAdminId) {
      this.store.dispatch(AdminActions.loadAdminDetails({
        id: this.editAdminId
      }));
    }
  }

  private configurePasswordField(): void {
    const passwordControl = this.adminForm.get('password');

    if (!passwordControl) {
      return;
    }

    if (this.isEditMode) {
      passwordControl.clearValidators();
      passwordControl.setValue('');
    } else {
      passwordControl.setValidators([
        Validators.required,
        Validators.minLength(8)
      ]);
    }

    passwordControl.updateValueAndValidity();
  }

  private adminDetailsSubscription(): void {
    this.subscription$.add(
      this.adminDetailsSelected$.subscribe((adminDetails) => {
        if (!adminDetails) {
          return;
        }

        if (
          adminDetails.status === AdminStatusEnum.createSuccess ||
          adminDetails.status === AdminStatusEnum.updateSuccess
        ) {
          this.goToAdminsPage();
          return;
        }

        if (
          this.isEditMode &&
          adminDetails.status === AdminStatusEnum.loadDetailsSuccess
        ) {
          const admin = adminDetails[ADMIN_DETAILS_KEY];

          this.adminForm.patchValue({
            fullName: admin.fullName,
            username: admin.username,
            email: admin.email,
            role: admin.role
          }, { emitEvent: false });
        }
      })
    );
  }

  public togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  public onSubmit(): void {
    if (this.adminForm.invalid) {
      this.adminForm.markAllAsTouched();
      return;
    }

    const formValue = this.adminForm.value;

    if (this.isEditMode && this.editAdminId) {
      const admin = {
        fullName: formValue.fullName,
        username: formValue.username,
        email: formValue.email,
        role: formValue.role
      };

      this.store.dispatch(AdminActions.updateAdmin({
        id: this.editAdminId,
        admin
      }));

      return;
    }

    const admin = {
      fullName: formValue.fullName,
      username: formValue.username,
      email: formValue.email,
      password: formValue.password,
      role: formValue.role
    };

    this.store.dispatch(AdminActions.createAdmin({
      admin
    }));
  }

  public onCancel(): void {
    this.goToAdminsPage();
  }

  public goToAdminsPage(): void {
    void this.router.navigate([
      '/admin',
      this.adminId,
      'admins'
    ]);
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }

  protected readonly ADMIN_DETAILS_KEY = ADMIN_DETAILS_KEY;
}
