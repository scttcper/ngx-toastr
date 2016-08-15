import { Injectable } from '@angular/core';

import { Toast } from './toast-component';

@Injectable()
export class ToastConfig {
  // shows close button
  closeButton: boolean = false;
  // extendedTimeOut: how long the toast will display after a user hovers
  extendedTimeOut: number = 1000;
  // TODO: listeners for toast actions
  // onHidden: null;
  // onShown: null;
  // onTap: null;
  progressBar: boolean = false;
  timeOut: number = 5000;

  toastClass: string = 'toast';
  positionClass: string = 'toast-top-right';
  titleClass: string = 'toast-title';
  messageClass: string = 'toast-message';
  tapToDismiss: boolean = true;
  toastComponent = Toast;
}

@Injectable()
export class ToastrConfig extends ToastConfig {
  maxOpened: number = 0;
  autoDismiss: boolean = false;
  // TODO:
  // containerId: string = 'toast-container';
  iconClasses = {
    error: 'toast-error',
    info: 'toast-info',
    success: 'toast-success',
    warning: 'toast-warning',
  };
  newestOnTop: boolean = true;
  preventDuplicates: boolean = false;
  // TODO:
  // preventOpenDuplicates: boolean = false;
}
