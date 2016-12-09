import { NgModule, ModuleWithProviders, OpaqueToken } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';

import { Toast } from './toast-component';
import { ToastrService } from './toastr-service';
import { ToastConfig, ToastrConfig, GlobalToastConfig } from './toastr-config';
import { OverlayContainer } from './overlay/overlay-container';
import { Overlay } from './overlay/overlay';

export const TOAST_CONFIG = new OpaqueToken('ToastConfig');

export function provideToastrConfig(config: GlobalToastConfig) {
  return new ToastrConfig(config);
}

@NgModule({
  imports: [BrowserModule, CommonModule],
  exports: [Toast],
  declarations: [Toast],
  entryComponents: [Toast],
})
export class ToastrModule {
  static forRoot(config?: GlobalToastConfig): ModuleWithProviders {
    return {
      ngModule: ToastrModule,
      providers: [
        { provide: TOAST_CONFIG, useValue: config },
        { provide: ToastrConfig, useFactory: provideToastrConfig, deps: [TOAST_CONFIG] },
        OverlayContainer,
        Overlay,
        ToastrService
      ]
    };
  }
}
