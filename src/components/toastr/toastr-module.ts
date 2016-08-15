import { provide, Injector, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { Toast } from './toast-component';
import { ToastrService } from './toastr-service';
import { ToastConfig, ToastrConfig } from './toastr-config';
import { OverlayContainer } from './overlay/overlay-container';
import { Overlay } from './overlay/overlay';

export const TOASTR_PROVIDERS: any = [
  OverlayContainer,
  Overlay,
  provide(ToastrService, {
    useFactory: (overlay: Overlay, injector: Injector) => {
      return new ToastrService(new ToastrConfig(), overlay, injector);
    },
    deps: [Overlay, Injector]
  })
];

@NgModule({
  imports: [BrowserModule],
  exports: [Toast],
  declarations: [Toast],
  entryComponents: [Toast],
  providers: [ToastrConfig, ToastConfig, OverlayContainer, Overlay, ToastrService],
})
export class ToastrModule { }
