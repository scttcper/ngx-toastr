import { InjectionToken } from '@angular/core';

import { GlobalConfig } from './toastr-config';

export interface ToastToken {
  config: GlobalConfig;
  defaults: any;
}

export const TOAST_CONFIG = new InjectionToken<ToastToken>('ToastConfig');
