/* tslint:disable:no-inferrable-types */
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { ComponentType } from '../portal/portal';
import { Toast } from './toast-component';



/**
 * Configuration for an individual toast.
 */
export class ToastConfig {
  /** show close button */
  closeButton?: boolean = false;
  /** time to close after a user hovers over toast */
  extendedTimeOut?: number = 1000;
  /** show progress bar */
  progressBar?: boolean = false;
  /** time to live */
  timeOut?: number = 5000;
  /** allow html in message */
  enableHtml?: boolean = false;
  toastClass?: string = 'toast';
  positionClass?: string = 'toast-top-right';
  titleClass?: string = 'toast-title';
  messageClass?: string = 'toast-message';
  /** clicking on toast dismisses it */
  tapToDismiss?: boolean = true;
  /** the Angular component to be shown */
  toastComponent?: ComponentType<any> = Toast;
  /** Helps show toast from a websocket or from event outside Angular */
  onActivateTick?: boolean = false;

  constructor(config: ToastConfig = {}) {
    function use<T>(source: T, defaultValue: T): T {
      return config && source !== undefined ? source : defaultValue;
    }
    this.closeButton = use(config.closeButton, this.closeButton);
    this.extendedTimeOut = use(config.extendedTimeOut, this.extendedTimeOut);
    this.progressBar = use(config.progressBar, this.progressBar);
    this.timeOut = use(config.timeOut, this.timeOut);
    this.enableHtml = use(config.enableHtml, this.enableHtml);
    this.toastClass = use(config.toastClass, this.toastClass);
    this.positionClass = use(config.positionClass, this.positionClass);
    this.titleClass = use(config.titleClass, this.titleClass);
    this.messageClass = use(config.messageClass, this.messageClass);
    this.tapToDismiss = use(config.tapToDismiss, this.tapToDismiss);
    this.toastComponent = use(config.toastComponent, this.toastComponent);
    this.onActivateTick = use(config.onActivateTick, this.onActivateTick);
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
  /** max toasts opened. Toasts will be queued */
  maxOpened?: number = 0;
  /** dismiss current toast when max is reached */
  autoDismiss?: boolean = false;
  iconClasses?: ToastrIconClasses = {
    error: 'toast-error',
    info: 'toast-info',
    success: 'toast-success',
    warning: 'toast-warning',
  };
  /** new toast placement */
  newestOnTop?: boolean = true;
  /** block duplicate messages */
  preventDuplicates?: boolean = false;

  constructor(config: ToastrConfig = {}) {
    super(config);
    function use<T>(source: T, defaultValue: T): T {
      return config && source !== undefined ? source : defaultValue;
    }
    this.maxOpened = use(config.maxOpened, this.maxOpened);
    this.autoDismiss = use(config.autoDismiss, this.autoDismiss);
    this.newestOnTop = use(config.newestOnTop, this.newestOnTop);
    this.preventDuplicates = use(config.preventDuplicates, this.preventDuplicates);
    if (config.iconClasses) {
      this.iconClasses.error = config.iconClasses.error || this.iconClasses.error;
      this.iconClasses.info = config.iconClasses.info || this.iconClasses.info;
      this.iconClasses.success = config.iconClasses.success || this.iconClasses.success;
      this.iconClasses.warning = config.iconClasses.warning || this.iconClasses.warning;
    }
  }
}

export class ToastData {
  toastId: number;
  optionsOverride: ToastConfig;
  message: string;
  title: string;
  toastType: string;
  /** Fired on click */
  onTap: Subject<any>;
  /** available for use in custom toast */
  onAction: Subject<any>;
}
