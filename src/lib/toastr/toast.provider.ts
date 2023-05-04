import { DefaultNoComponentGlobalConfig, GlobalConfig, TOAST_CONFIG } from './toastr-config';
import { EnvironmentProviders, makeEnvironmentProviders, Provider } from '@angular/core';
import { Toast } from './toast.component';

export const DefaultGlobalConfig: GlobalConfig = {
  ...DefaultNoComponentGlobalConfig,
  toastComponent: Toast,
};

/**
 * @description
 * Provides the `TOAST_CONFIG` token with the given config.
 *
 * @param config The config to configure toastr.
 * @returns The environment providers.
 *
 * @example
 * ```ts
 * import { provideToastr } from 'ngx-toastr';
 *
 * bootstrap(AppComponent, {
 *   providers: [
 *     provideToastr({
 *       timeOut: 2000,
 *       positionClass: 'toast-top-right',
 *     }),
 *   ],
 * })
 */
export const provideToastr = (config: Partial<GlobalConfig> = {}): EnvironmentProviders => {
  const providers: Provider[] = [
    {
      provide: TOAST_CONFIG,
      useValue: {
        default: DefaultGlobalConfig,
        config,
      }
    }
  ];

  return makeEnvironmentProviders(providers);
};
