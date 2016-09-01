import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { Toast } from './toast-component';
import { ToastrService } from './toastr-service';
import { ToastConfig, ToastrConfig } from './toastr-config';
import { OverlayContainer } from './overlay/overlay-container';
import { Overlay } from './overlay/overlay';

@NgModule({
  imports: [BrowserModule],
  exports: [Toast],
  declarations: [Toast],
  entryComponents: [Toast],
  providers: [
    OverlayContainer,
    {provide: ToastConfig, useFactory: () => new ToastConfig()},
    {provide: ToastrConfig, useFactory: () => new ToastrConfig()},
    Overlay,
    ToastrService,
  ],
})
export class ToastrModule { }

export function provideToastr(config = {}): any {
  return {
    provide: ToastrService,
    deps: [Overlay, ToastrConfig, ToastConfig],
    useFactory: (overlay: Overlay) => {
      return new ToastrService(new ToastrConfig(config), overlay);
    }
  };
}
