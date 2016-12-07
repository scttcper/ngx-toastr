import { NgModule, ModuleWithProviders } from '@angular/core';
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
})
export class ToastrModule {
  static forRoot(): ModuleWithProviders { return {ngModule: ToastrModule, providers: [
    ToastrConfig,
    OverlayContainer,
    Overlay,
    ToastrService,
  ]}; }
}
