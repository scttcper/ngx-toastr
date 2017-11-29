import { CommonModule } from '@angular/common';
import {
  ModuleWithProviders,
  NgModule,
  Optional,
  SkipSelf,
} from '@angular/core';

import { Overlay } from '../overlay/overlay';
import { OverlayContainer } from '../overlay/overlay-container';
import { DefaultGlobalConfig } from './default-config';
import { TOAST_CONFIG } from './toast-token';
import { Toast } from './toast.component';
import { GlobalConfig } from './toastr-config';
import { ToastrService } from './toastr.service';


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
        { provide: TOAST_CONFIG, useValue: { config, defaults: DefaultGlobalConfig } },
        OverlayContainer,
        Overlay,
        ToastrService,
      ],
    };
  }
}
