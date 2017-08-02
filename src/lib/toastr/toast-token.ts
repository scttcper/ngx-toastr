import { InjectionToken } from '@angular/core';

import { GlobalConfig } from './toastr-config';

export const TOAST_CONFIG = new InjectionToken<GlobalConfig>('ToastConfig');
