import {Component, HostListener, input, model} from '@angular/core';
import {ModalType} from "../../models/modal/modal.model";

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent {
  open = model(false);
  title = input<string>();
  type = input<ModalType>('modal');

  @HostListener('click', ['$event']) closeOnClick(event: PointerEvent): void {
    const target = event.target as HTMLElement;
    if (target?.classList?.contains('modal-component__overlay')) {
      this.closeModal();
    }
  }

  @HostListener('window:keyup.esc') closeOnPressEsc(): void {
    this.closeModal();
  }

  private closeModal(): void {
    this.open.set(false);
  }
}
