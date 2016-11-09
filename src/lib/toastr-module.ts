import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';

import { Toast } from './toast-component';
import { ToastrService } from './toastr-service';
import { ToastConfig, ToastrConfig } from './toastr-config';
import { OverlayContainer } from './overlay/overlay-container';
import { Overlay } from './overlay/overlay';

@NgModule({
  imports: [BrowserModule, CommonModule],
  exports: [Toast],
  declarations: [Toast],
  entryComponents: [Toast],
  providers: [
    OverlayContainer,
    {provide: ToastConfig, useFactory: ToastConfigFactory},
    {provide: ToastrConfig, useFactory: ToastrConfigFactory},
    Overlay,
    ToastrService,
  ],
})
export class ToastrModule { }

export function ToastConfigFactory () {
  return new ToastConfig();
}

export function ToastrConfigFactory () {
  return new ToastrConfig();
}

export function provideToastr(config = {}): any {
  return {
    provide: ToastrService,
    deps: [Overlay, ToastrConfig, ToastConfig],
    useFactory: (overlay: Overlay) => {
      return new ToastrService(new ToastrConfig(config), overlay);
    }
  };
}
