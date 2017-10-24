import {
  NgModule,
  ModuleWithProviders,
  SkipSelf,
  Optional,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { Toast } from './toast-component';
import { TOAST_CONFIG } from './toast-token';
import { ToastrService } from './toastr-service';
import { GlobalConfig } from './toastr-config';
import { OverlayContainer } from '../overlay/overlay-container';
import { Overlay } from '../overlay/overlay';


@NgModule({
  imports: [CommonModule],
  exports: [Toast],
  declarations: [Toast],
  entryComponents: [Toast],
})
export class ToastrModule {
  constructor(@Optional() @SkipSelf() parentModule: ToastrModule) {
    if (parentModule) {
      throw new Error('ToastrModule is already loaded. It should only be imported in your application\'s main module.');
    }
  }
  static forRoot(config: Partial<GlobalConfig> = {}): ModuleWithProviders {
    return {
      ngModule: ToastrModule,
      providers: [
        { provide: TOAST_CONFIG, useValue: config },
        OverlayContainer,
        Overlay,
        ToastrService,
      ]
    };
  }
}
