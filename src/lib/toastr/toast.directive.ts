import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[toastContainer]',
  exportAs: 'toastContainer',
  standalone: true
})
export class ToastContainerDirective {
  constructor(private el: ElementRef) { }
  getContainerElement(): HTMLElement {
    return this.el.nativeElement;
  }
}
