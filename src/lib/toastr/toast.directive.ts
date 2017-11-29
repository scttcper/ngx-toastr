import {
  Directive,
  ElementRef,
  NgModule,
} from '@angular/core';

@Directive({
  selector: '[toastContainer]',
  exportAs: 'toastContainer',
})
export class ToastContainerDirective {
  constructor(private el: ElementRef) { }
  getContainerElement(): HTMLElement {
    return this.el.nativeElement;
  }
}

@NgModule({
  declarations: [ToastContainerDirective],
  exports: [ToastContainerDirective],
})
export class ToastContainerModule {}
