import { NgModule, ModuleWithProviders, Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[toastContainer]',
  exportAs: 'toastContainer',
})
export class ToastContainerDirective {
  constructor(private el: ElementRef) {}
  getContainerElement(): HTMLElement {
    return this.el.nativeElement;
  }
}

@NgModule({
  exports: [ToastContainerDirective],
  declarations: [ToastContainerDirective],
})
export class ToastContainerModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ToastContainerModule,
      providers: []
    };
  }
}
