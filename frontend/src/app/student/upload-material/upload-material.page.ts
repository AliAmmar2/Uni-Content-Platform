import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { Store } from '@ngrx/store';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

import { MaterialActions } from '../../material/+state/material.action';

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
export class UploadMaterialPage implements OnInit {
  ngOnInit(): void {
    this.adminId = this.activatedRoute.parent?.snapshot.paramMap.get('id');
  }

  private readonly store = inject(Store);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  public adminId: string;
  public courseId: string | null =
    this.route.snapshot.paramMap.get('courseId') ??
    this.route.parent?.snapshot.paramMap.get('courseId');

  private activatedRoute = inject(ActivatedRoute);
  public selectedFile: File | null = null;
  public isDragOver = false;

  public materialForm = new FormGroup({
    title: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    }),

    description: new FormControl('', {
      nonNullable: true
    })
  });

  public onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files?.length) {
      return;
    }

    this.selectedFile = input.files[0];
  }

  public onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = true;
  }

  public onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
  }

  public onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;

    const file = event.dataTransfer?.files?.[0];

    if (file) {
      this.selectedFile = file;
    }
  }

  public uploadMaterial(): void {
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

  public cancel(): void {
    void this.router.navigate(['../'], {
      relativeTo: this.route
    });
  }

  public goBackToMaterials(): void {
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
