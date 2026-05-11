import { Component, inject, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { AdminActions } from '../+state/admin.action';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UiSwitchModule } from 'ngx-ui-switch';
import { ActivatedRoute, Router } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { ADMIN_DETAILS_KEY } from '../+state/faculty-details.reducer';
import { LetDirective } from '@ngrx/component';
import { AsyncPipe } from '@angular/common';
import { selectAdminDetails } from '../+state/admin.selector';
import { AdminStatusEnum } from '../+state/enums/admin-status.enum';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.page.html',
  imports: [
    UiSwitchModule,
    ReactiveFormsModule,
    FaIconComponent,
    LetDirective,
    AsyncPipe
  ],
  styleUrls: ['./account-settings.page.scss']
})
export class AccountSettingsPage implements OnInit {
  public store = inject(Store);
  public adminForm: FormGroup;
  public adminId: string;
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  public adminDetailsSelected$ = this.store.pipe(select(selectAdminDetails));

  constructor() {
    this.adminForm = new FormGroup({
      email: new FormControl({ value: '', disabled: true }),
      fullName: new FormControl('', Validators.required),
      username: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {
    this.adminDetailsSubscription();
    this.store.dispatch(AdminActions.loadMe());
    this.adminId = this.activatedRoute.parent?.snapshot.paramMap.get('id');
  }

  adminDetailsSubscription() {
    this.adminDetailsSelected$.subscribe(adminDetails => {
      if (adminDetails) {
        this.adminForm.patchValue({
          email: adminDetails[ADMIN_DETAILS_KEY]?.email,
          fullName: adminDetails[ADMIN_DETAILS_KEY]?.fullName,
          username: adminDetails[ADMIN_DETAILS_KEY]?.username,
        });
      }
      if (adminDetails.status === AdminStatusEnum.updateSuccess) {
        void this.router.navigate(['/admin', this.adminId, 'dashboard']);
      }
    });
  }

  onUpdate() {
    console.log(this.adminForm.value, this.adminId)
    this.store.dispatch(AdminActions.updateAdmin({
      admin: this.adminForm.value,
      id: this.adminId
    }))
  }

  protected readonly ADMIN_DETAILS_KEY = ADMIN_DETAILS_KEY;
}
