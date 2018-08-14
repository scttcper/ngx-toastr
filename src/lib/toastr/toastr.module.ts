import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';

import { Toast } from './toast.component';
import {
  DefaultNoComponentGlobalConfig,
  GlobalConfig,
  TOAST_CONFIG,
} from './toastr-config';

export const DefaultGlobalConfig: GlobalConfig = {
  ...DefaultNoComponentGlobalConfig,
  toastComponent: Toast,
};

@NgModule({
  imports: [CommonModule],
  declarations: [Toast],
  exports: [Toast],
  entryComponents: [Toast],
})
export class ToastrModule {
  static forRoot(config: Partial<GlobalConfig> = {}): ModuleWithProviders {
    const toastrConfig = { ...DefaultGlobalConfig, ...config };
    toastrConfig.iconClasses = {
      ...DefaultGlobalConfig.iconClasses,
      ...config.iconClasses,
    };
    return {
      ngModule: ToastrModule,
      providers: [
        {
          provide: TOAST_CONFIG,
          useValue: toastrConfig,
        },
      ],
    };
  }
}

@NgModule({
  imports: [CommonModule],
})
export class ToastrComponentlessModule {
  static forRoot(config: Partial<GlobalConfig> = {}): ModuleWithProviders {
    const toastrConfig = { ...DefaultNoComponentGlobalConfig, ...config };
    toastrConfig.iconClasses = {
      ...DefaultNoComponentGlobalConfig.iconClasses,
      ...config.iconClasses,
    };
    return {
      ngModule: ToastrModule,
      providers: [
        {
          provide: TOAST_CONFIG,
          useValue: toastrConfig,
        },
      ],
    };
  }
}
