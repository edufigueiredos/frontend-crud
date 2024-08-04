import {DomSanitizer, SafeUrl} from "@angular/platform-browser";
import {Component, ElementRef, forwardRef, inject, ViewChild} from '@angular/core';
import {ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule} from "@angular/forms";

import {MatButton} from "@angular/material/button";
import {ModalComponent} from "../modal/modal.component";
import {NotifyUtil} from "../../utils/notify/notify.util";
import {ImageCroppedEvent, ImageCropperComponent} from "ngx-image-cropper";

@Component({
  selector: 'app-image-upload',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    ModalComponent,
    ImageCropperComponent,
    MatButton
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ImageUploadComponent),
      multi: true
    }
  ],
  templateUrl: './image-upload.component.html',
  styleUrl: './image-upload.component.scss'
})
export class ImageUploadComponent extends NotifyUtil implements ControlValueAccessor {
  @ViewChild('inputElement') inputElement!: ElementRef<HTMLInputElement>;

  private _sanitizer = inject(DomSanitizer);

  private _imageBlob?: Blob | null;

  protected isCropModalOpen = false;
  protected imageChangedEvent: Event | null = null;
  protected croppedImage: SafeUrl = '';

  onChange: any = () => {
  };
  onTouched: any = () => {
  };



  private _resetFileChangeEvent(): void {
    this.inputElement.nativeElement.value = '';
  }

  private _blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        const base64data = reader.result as string;
        resolve(base64data);
      };
      reader.onerror = reject;
    });
  }

  protected fileChangeEvent(event: Event): void {
    this.imageChangedEvent = event;
  }

  protected imageCropped(event: ImageCroppedEvent) {
    if (event?.objectUrl) {
      this.croppedImage = this._sanitizer.bypassSecurityTrustUrl(event.objectUrl);
    }
    this._imageBlob = event.blob;
    if (this._imageBlob) {
      this._blobToBase64(this._imageBlob).then(base64 => {
        this.onChange(base64);
      });
    }
  }

  protected imageLoaded() {
    this.openCropModal();
  }

  protected cropperReady() {
    this.notify('O corte da foto está pronto')
  }

  protected loadImageFailed() {
    this.notify('Erro ao carregar a imagem');
  }

  protected cancelCrop() {
    this.croppedImage = '';
    this.closeCropModal();
  }

  protected openCropModal(): void {
    this.isCropModalOpen = true
  }

  protected closeCropModal(): void {
    this.isCropModalOpen = false
    this._resetFileChangeEvent();
  }

  writeValue(value: Blob | string): void {
    if (value) {
      this.croppedImage = value;
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    // TODO implement disable state
  }
}
