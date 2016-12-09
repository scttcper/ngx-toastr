import { Injectable, EventEmitter } from '@angular/core';

import { ComponentType } from './portal/portal';
import { Toast } from './toast-component';

export interface SingleToastConfig {
  closeButton?: boolean
  extendedTimeOut?: number
  onHidden?: EventEmitter<any>
  onShown?: EventEmitter<any>
  onTap?: EventEmitter<any>
  progressBar?: boolean
  timeOut?: number

  toastClass?: string
  positionClass?: string
  titleClass?: string
  messageClass?: string
  tapToDismiss?: boolean
  toastComponent?: ComponentType<any>;
}

/**
 * Configuration for an individual toast.
 */
export class ToastConfig implements SingleToastConfig {
  // shows close button
  closeButton = false;
  extendedTimeOut = 1000;
  onHidden = new EventEmitter();
  onShown = new EventEmitter();
  onTap = new EventEmitter();
  progressBar = false;
  timeOut = 5000;

  toastClass = 'toast';
  positionClass = 'toast-top-right';
  titleClass = 'toast-title';
  messageClass = 'toast-message';
  tapToDismiss = true;
  toastComponent = Toast;
  constructor(config: GlobalToastConfig = {}) {
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

export interface GlobalToastConfig extends SingleToastConfig {
  maxOpened?: number;
  autoDismiss?: boolean;
  iconClasses?: {
    error?: string,
    info?: string,
    success?: string,
    warning?: string,
  };
  newestOnTop?: boolean;
  preventDuplicates?: boolean;
}

/**
 * Global Toast configuration
 */
@Injectable()
export class ToastrConfig extends ToastConfig implements GlobalToastConfig {
  maxOpened = 0;
  autoDismiss = false;
  iconClasses = {
    error: 'toast-error',
    info: 'toast-info',
    success: 'toast-success',
    warning: 'toast-warning',
  };
  newestOnTop = true;
  preventDuplicates = false;
  constructor(config?: GlobalToastConfig) {
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
