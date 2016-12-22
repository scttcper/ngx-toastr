import { Injectable, EventEmitter } from '@angular/core';

import { ComponentType } from './portal/portal';
import { Toast } from './toast-component';

/**
 * Configuration for an individual toast.
 */
export class ToastConfig {
  // shows close button
  closeButton?: boolean = false;
  extendedTimeOut?: number = 1000;
  onHidden?: EventEmitter<any> = new EventEmitter();
  onShown?: EventEmitter<any> = new EventEmitter();
  onTap?: EventEmitter<any> = new EventEmitter();
  progressBar?: boolean = false;
  timeOut?: number = 5000;

  toastClass?: string = 'toast';
  positionClass?: string = 'toast-top-right';
  titleClass?: string = 'toast-title';
  messageClass?: string = 'toast-message';
  tapToDismiss?: boolean = true;
  toastComponent?: ComponentType<any> = Toast;
  constructor(config: ToastConfig = {}) {
    this.closeButton = config.closeButton || this.closeButton;
    if (config.extendedTimeOut === 0) {
      this.extendedTimeOut = config.extendedTimeOut;
    } else {
      this.extendedTimeOut = config.extendedTimeOut || this.extendedTimeOut;
    }
    this.onHidden = config.onHidden || this.onHidden;
    this.onShown = config.onShown || this.onShown;
    this.onTap = config.onTap || this.onTap;
    this.progressBar = config.progressBar || this.progressBar;
    if (config.timeOut === 0) {
      this.timeOut = config.timeOut;
    } else {
      this.timeOut = config.timeOut || this.timeOut;
    }

    this.toastClass = config.toastClass || this.toastClass;
    this.positionClass = config.positionClass || this.positionClass;
    this.titleClass = config.titleClass || this.titleClass;
    this.messageClass = config.messageClass || this.messageClass;
    this.tapToDismiss = config.tapToDismiss || this.tapToDismiss;
    this.toastComponent = config.toastComponent || this.toastComponent;
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
