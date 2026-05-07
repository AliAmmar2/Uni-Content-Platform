import { ChangeDetectionStrategy, Component, computed, ElementRef, Input, signal, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { TranslatePipe } from '@ngx-translate/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

interface FileValidationResult {
  isValid: boolean;
  errorMessage?: string;
}

@Component({
  selector: 'ngx-md-image-picker',
  templateUrl: './ngx-md-image-picker.html',
  styleUrls: ['./ngx-md-image-picker.scss'],
  imports: [TranslatePipe, FaIconComponent],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NgxMdImagePicker {
  @ViewChild('fileInput') private fileInput!: ElementRef<HTMLInputElement>;
  @Input() initialImage?: string; // Allow passing an existing image

  // Signals for reactive state management
  public readonly profilePicture = signal<string | null>(null);
  public readonly isDragOver = signal<boolean>(false);
  public readonly errorMessage = signal<string | null>(null);
  public readonly isLoading = signal<boolean>(false);

  // Computed values
  public readonly hasImage = computed(() => !!this.profilePicture());
  public readonly canSave = computed(() => this.hasImage() && !this.errorMessage() && !this.isLoading());

  // Constants
  private readonly ACCEPTED_FORMATS = ['image/png', 'image/jpeg', 'image/jpg'];
  private readonly MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  private readonly MIN_MODAL_WIDTH = 500;
  private readonly MAX_MODAL_WIDTH = 900;
  private readonly MIN_MODAL_HEIGHT = 400;
  private readonly MAX_MODAL_HEIGHT = 700;
  private readonly MODAL_PADDING = 100; // Extra space for headers, buttons, etc.

  public faIcon: IconProp = ['fal', 'image'];
  private selectedFile: File | null = null;

  constructor(
    private readonly matDialogRef: MatDialogRef<NgxMdImagePicker>
  ) {
  }

  ngOnInit(): void {
    // Initialize with existing image if provided
    if (this.initialImage) {
      this.profilePicture.set(this.initialImage);
    }
  }

  /**
   * Handles file selection from input or drag-and-drop
   */
  public onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      this.processFile(file);
    }
  }

  /**
   * Handles clicking on the upload area
   */
  public onUploadAreaClick(): void {
    // Only trigger file input if there's no image currently displayed
    if (!this.profilePicture()) {
      this.triggerFileInput();
    }
  }

  /**
   * Triggers the hidden file input
   */
  public triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  /**
   * Removes the currently selected image and resets modal size
   */
  public removeImage(): void {
    this.profilePicture.set(null);
    this.selectedFile = null;
    this.errorMessage.set(null);
    this.resetFileInput();
    this.resetModalSize();
  }

  /**
   * Saves the selected image and closes the dialog
   */
  public save(): void {
    if (this.selectedFile && this.canSave()) {
      this.matDialogRef.close(this.selectedFile);
    }
  }

  /**
   * Dismisses the dialog without saving
   */
  public dismiss(): void {
    this.matDialogRef.close(null);
  }

  // Drag and Drop Event Handlers
  public onDragEnter(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver.set(true);
    this.faIcon = ['fas', 'cloud-upload-alt'];
  }

  public onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  public onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();

    // Only reset if we're leaving the main drop area
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const x = event.clientX;
    const y = event.clientY;

    if (x < rect.left || x >= rect.right || y < rect.top || y >= rect.bottom) {
      this.isDragOver.set(false);
      this.faIcon = ['fal', 'image'];
    }
  }

  public onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver.set(false);
    this.faIcon = ['fal', 'image'];

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.processFile(files[0]);
    }
  }

  /**
   * Processes the selected file, validates it, and creates a preview
   */
  private processFile(file: File): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    const validation = this.validateFile(file);
    if (!validation.isValid) {
      this.errorMessage.set(validation.errorMessage || 'Invalid file');
      this.isLoading.set(false);
      return;
    }

    this.selectedFile = file;

    // Create FileReader to read the file and get image dimensions
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      this.profilePicture.set(imageUrl);

      // Calculate modal size based on image ratio
      this.calculateAndSetModalSize(imageUrl);
      this.isLoading.set(false);
    };

    reader.onerror = () => {
      this.errorMessage.set('Error reading file. Please try again with a different image');
      this.isLoading.set(false);
    };

    reader.readAsDataURL(file);
  }

  /**
   * Calculates optimal modal size based on image dimensions
   */
  private calculateAndSetModalSize(imageUrl: string): void {
    const img = new Image();
    img.onload = () => {
      const aspectRatio = img.width / img.height;
      let newWidth: number;
      let newHeight: number;

      // Calculate dimensions based on aspect ratio
      if (aspectRatio > 1) {
        // Landscape image
        newWidth = Math.min(this.MAX_MODAL_WIDTH, Math.max(this.MIN_MODAL_WIDTH, img.width * 0.8));
        newHeight = newWidth / aspectRatio + this.MODAL_PADDING;
      } else {
        // Portrait or square image
        newHeight = Math.min(this.MAX_MODAL_HEIGHT, Math.max(this.MIN_MODAL_HEIGHT, img.height * 0.8));
        newWidth = (newHeight - this.MODAL_PADDING) * aspectRatio;
        newWidth = Math.max(this.MIN_MODAL_WIDTH, newWidth);
      }

      // Ensure dimensions are within bounds
      newWidth = Math.min(this.MAX_MODAL_WIDTH, Math.max(this.MIN_MODAL_WIDTH, newWidth));
      newHeight = Math.min(this.MAX_MODAL_HEIGHT, Math.max(this.MIN_MODAL_HEIGHT, newHeight));

      // Update modal size
      this.updateModalSize(newWidth, newHeight);
    };
    img.src = imageUrl;
  }

  /**
   * Updates the modal size using MatDialogRef
   */
  private updateModalSize(width: number, height: number): void {
    this.matDialogRef.updateSize(`${width}px`, `${height}px`);
  }

  /**
   * Resets modal to default size
   */
  private resetModalSize(): void {
    this.matDialogRef.updateSize('650px', undefined);
  }

  /**
   * Validates the selected file
   */
  private validateFile(file: File): FileValidationResult {
    // Check file type
    if (!this.ACCEPTED_FORMATS.includes(file.type)) {
      return {
        isValid: false,
        errorMessage: 'Invalid file format. Please select a PNG, JPG, or JPEG image'
      };
    }

    // Check file size
    if (file.size > this.MAX_FILE_SIZE) {
      return {
        isValid: false,
        errorMessage: 'File size is too large. Please select an image smaller than 5MB'
      };
    }

    return { isValid: true };
  }

  /**
   * Resets the file input value
   */
  private resetFileInput(): void {
    if (this.fileInput?.nativeElement) {
      this.fileInput.nativeElement.value = '';
    }
  }
}
