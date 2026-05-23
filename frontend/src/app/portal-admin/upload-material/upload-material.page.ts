import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { select, Store } from '@ngrx/store';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

import { MaterialActions } from '../../material/+state/material.action';
import { selectMaterialDetails } from '../../material/+state/material.selector';
import { MaterialStatusEnum } from '../../material/+state/enums/material-status.enum';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FaIconComponent
  ],
  templateUrl: './upload-material.page.html',
  styleUrl: './upload-material.page.scss'
})
export class UploadMaterialPage implements OnInit, OnDestroy {
  private readonly maxFileSize = 50 * 1024 * 1024;

  private readonly store = inject(Store);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly toastr = inject(ToastrService);
  private readonly subscription$ = new Subscription();

  public adminId: string | null = null;

  public courseId: string | null =
    this.route.snapshot.paramMap.get('courseId') ??
    this.route.parent?.snapshot.paramMap.get('courseId');

  public selectedFile: File | null = null;
  public isDragOver = false;
  public isUploading = false;

  public materialDetailsState$ = this.store.pipe(
    select(selectMaterialDetails)
  );

  public materialForm = new FormGroup({
    title: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    }),

    description: new FormControl('', {
      nonNullable: true
    })
  });

  ngOnInit(): void {
    this.adminId =
      this.activatedRoute.parent?.snapshot.paramMap.get('id');

    this.uploadStatusSubscription();
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }

  private uploadStatusSubscription(): void {
    this.subscription$.add(
      this.materialDetailsState$.subscribe(state => {
        if (state?.status === MaterialStatusEnum.uploadLoading) {
          this.isUploading = true;

          this.materialForm.disable({
            emitEvent: false
          });

          this.toastr.clear();

          this.toastr.info(
            'Please wait while your material is uploading.',
            'Upload in progress',
            {
              positionClass: 'toast-top-right',
              progressBar: true,
              closeButton: false,
              disableTimeOut: true
            }
          );
        }

        if (state?.status === MaterialStatusEnum.uploadSuccess) {
          this.isUploading = false;

          this.materialForm.enable({
            emitEvent: false
          });

          this.toastr.clear();

          this.toastr.success(
            'Material uploaded successfully',
            'Success',
            {
              positionClass: 'toast-top-right',
              progressBar: true,
              closeButton: true,
              timeOut: 3000
            }
          );

          this.store.dispatch(MaterialActions.resetMaterialState());

          this.goBackToMaterials();
        }

        if (state?.status === MaterialStatusEnum.uploadFailure) {
          this.isUploading = false;

          this.materialForm.enable({
            emitEvent: false
          });

          this.toastr.clear();

          this.toastr.error(
            'Failed to upload material',
            'Error',
            {
              positionClass: 'toast-top-right',
              progressBar: true,
              closeButton: true,
              timeOut: 3000
            }
          );

          this.store.dispatch(MaterialActions.resetMaterialState());
        }
      })
    );
  }

  public onFileSelected(event: Event): void {
    if (this.isUploading) {
      return;
    }

    const input = event.target as HTMLInputElement;

    if (!input.files?.length) {
      return;
    }

    this.setSelectedFile(input.files[0]);
    input.value = '';
  }

  public onDragOver(event: DragEvent): void {
    event.preventDefault();

    if (!this.isUploading) {
      this.isDragOver = true;
    }
  }

  public onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
  }

  public onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;

    if (this.isUploading) {
      return;
    }

    const file = event.dataTransfer?.files?.[0];

    if (file) {
      this.setSelectedFile(file);
    }
  }

  private setSelectedFile(file: File): void {
    if (file.size > this.maxFileSize) {
      this.selectedFile = null;

      this.toastr.clear();

      this.toastr.error(
        'Maximum file size is 50MB',
        'File Too Large',
        {
          positionClass: 'toast-top-right',
          progressBar: true,
          closeButton: true,
          timeOut: 3000
        }
      );

      return;
    }

    this.selectedFile = file;
  }

  public uploadMaterial(): void {
    if (this.isUploading) {
      return;
    }

    if (!this.courseId || this.materialForm.invalid || !this.selectedFile) {
      this.materialForm.markAllAsTouched();
      return;
    }

    this.store.dispatch(
      MaterialActions.uploadMaterial({
        material: {
          title: this.materialForm.controls.title.value,
          description: this.materialForm.controls.description.value,
          courseId: this.courseId,
          file: this.selectedFile
        }
      })
    );
  }

  public cancelUpload(): void {
    this.store.dispatch(MaterialActions.cancelUploadMaterial());

    this.isUploading = false;

    this.materialForm.enable({
      emitEvent: false
    });

    this.toastr.clear();

    this.toastr.info(
      'Upload cancelled',
      'Cancelled',
      {
        positionClass: 'toast-top-right',
        progressBar: true,
        closeButton: true,
        timeOut: 2500
      }
    );
  }

  public cancel(): void {
    if (this.isUploading) {
      this.cancelUpload();
      return;
    }

    this.goBackToMaterials();
  }

  public goBackToMaterials(): void {
    if (this.isUploading) {
      return;
    }

    if (!this.adminId || !this.courseId) {
      return;
    }

    void this.router.navigate([
      '/admin',
      this.adminId,
      this.courseId,
      'materials'
    ]);
  }
}
