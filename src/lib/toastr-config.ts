import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { ComponentType } from './portal/portal';
import { Toast } from './toast-component';

/**
 * Configuration for an individual toast.
 */
export class ToastConfig {
  // shows close button
  closeButton?: boolean = false;
  extendedTimeOut?: number = 1000;
  progressBar?: boolean = false;
  timeOut?: number = 5000;
  enableHtml?: boolean = false;

  toastClass?: string = 'toast';
  positionClass?: string = 'toast-top-right';
  titleClass?: string = 'toast-title';
  messageClass?: string = 'toast-message';
  tapToDismiss?: boolean = true;
  toastComponent?: ComponentType<any> = Toast;
  onActivateTick?: boolean = false;
  constructor(config: ToastConfig = {}) {
    this.closeButton = config.closeButton || this.closeButton;
    if (config.extendedTimeOut === 0) {
      this.extendedTimeOut = config.extendedTimeOut;
    } else {
      this.extendedTimeOut = config.extendedTimeOut || this.extendedTimeOut;
    }
    this.progressBar = config.progressBar || this.progressBar;
    if (config.timeOut === 0) {
      this.timeOut = config.timeOut;
    } else {
      this.timeOut = config.timeOut || this.timeOut;
    }
    this.enableHtml = config.enableHtml || this.enableHtml;

    this.toastClass = config.toastClass || this.toastClass;
    this.positionClass = config.positionClass || this.positionClass;
    this.titleClass = config.titleClass || this.titleClass;
    this.messageClass = config.messageClass || this.messageClass;
    this.tapToDismiss = config.tapToDismiss || this.tapToDismiss;
    this.toastComponent = config.toastComponent || this.toastComponent;
    this.onActivateTick = config.onActivateTick || this.onActivateTick;
  }
}

@Injectable()
export class ToastrIconClasses {
  error?: string;
  info?: string;
  success?: string;
  warning?: string;
}

/**
 * Global Toast configuration
 */
@Injectable()
export class ToastrConfig extends ToastConfig {
  maxOpened?: number = 0;
  autoDismiss?: boolean = false;
  iconClasses?: ToastrIconClasses = {
    error: 'toast-error',
    info: 'toast-info',
    success: 'toast-success',
    warning: 'toast-warning',
  };
  newestOnTop?: boolean = true;
  preventDuplicates?: boolean = false;
  constructor(config: ToastrConfig = {}) {
    super(config);
    this.maxOpened = config.maxOpened || this.maxOpened;
    this.autoDismiss = config.autoDismiss || this.autoDismiss;
    if (config.iconClasses) {
      this.iconClasses.error = this.iconClasses.error || config.iconClasses.error;
      this.iconClasses.info = this.iconClasses.info || config.iconClasses.info;
      this.iconClasses.success = this.iconClasses.success || config.iconClasses.success;
      this.iconClasses.warning = this.iconClasses.warning || config.iconClasses.warning;
    }
    this.newestOnTop = config.newestOnTop || this.newestOnTop;
    this.preventDuplicates = config.preventDuplicates || this.preventDuplicates;
  }
}

export class ToastData {
  toastId: number;
  optionsOverride: ToastConfig;
  message: string;
  title: string;
  toastType: string;
  onTap: Subject<any>;
}
