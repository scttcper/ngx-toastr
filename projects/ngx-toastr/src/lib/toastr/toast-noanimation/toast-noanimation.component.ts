import { ModuleWithProviders } from '@angular/core';
import { NgModule } from '@angular/core';
import { DefaultNoComponentGlobalConfig, GlobalConfig, TOAST_CONFIG } from '../toastr-config';
import { ToastBase as ToastNoAnimation } from '../base-toast/base-toast.component';

export const DefaultNoAnimationsGlobalConfig: GlobalConfig = {
  ...DefaultNoComponentGlobalConfig,
  toastComponent: ToastNoAnimation,
};

@NgModule({
  imports: [ToastNoAnimation],
  exports: [ToastNoAnimation],
})
export class ToastNoAnimationModule {
  static forRoot(config: Partial<GlobalConfig> = {}): ModuleWithProviders<ToastNoAnimationModule> {
    return {
      ngModule: ToastNoAnimationModule,
      providers: [
        {
          provide: TOAST_CONFIG,
          useValue: {
            default: DefaultNoAnimationsGlobalConfig,
            config,
          },
        },
      ],
    };
  }
}

export { ToastNoAnimation };
