import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';

import { DefaultGlobalConfig } from './default-config';
import { TOAST_CONFIG } from './toast-token';
import { Toast } from './toast.component';
import { GlobalConfig } from './toastr-config';

@NgModule({
  imports: [CommonModule],
  declarations: [Toast],
  exports: [Toast],
  entryComponents: [Toast],
})
export class ToastrModule {
  static forRoot(config: Partial<GlobalConfig> = {}): ModuleWithProviders {
    return {
      ngModule: ToastrModule,
      providers: [
        {
          provide: TOAST_CONFIG,
          useValue: { config, defaults: DefaultGlobalConfig },
        },
      ],
    };
  }
}
