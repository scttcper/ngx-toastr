import { ChangeDetectionStrategy, ModuleWithProviders } from '@angular/core';
import { Component, NgModule } from '@angular/core';
import { DefaultNoComponentGlobalConfig, GlobalConfig, TOAST_CONFIG } from '../toastr-config';
import { ToastBase } from '../toast.abstract';

@Component({
  selector: '[toast-component]',
  templateUrl: './toast-noanimation.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'toastClasses()',
    '[style.display]': 'displayStyle()',
    '(mouseenter)': 'stickAround()',
    '(mouseleave)': 'delayedHideToast()',
    '(click)': 'tapToast()',
  },
})
export class ToastNoAnimation extends ToastBase {}

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
