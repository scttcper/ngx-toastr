import { Injectable, EventEmitter } from '@angular/core';

import { Toast } from './toast-component';


export interface ToastConfig {
  closeButton?: boolean;
  extendedTimeOut?: number;
  onHidden?: EventEmitter<any>;
  onShown?: EventEmitter<any>;
  onTap?: EventEmitter<any>;
  progressBar?: boolean;
  timeOut?: number;

  toastClass?: string;
  positionClass?: string;
  titleClass?: string;
  messageClass?: string;
  tapToDismiss?: boolean;
  toastComponent?: any;
}

/**
 * Global Toast configuration
 * You can inject this service, typically in your root component, and customize the values of its properties in
 * order to provide default values for all the timepickers used in the application.
 */
@Injectable()
export class ToastrConfig implements ToastConfig {
  closeButton: boolean = false;
  extendedTimeOut: number = 1000;
  onHidden: EventEmitter<any> = new EventEmitter();
  onShown: EventEmitter<any> = new EventEmitter();
  onTap: EventEmitter<any> = new EventEmitter();
  progressBar: boolean = false;
  timeOut: number = 5000;

  toastClass: string = 'toast';
  positionClass: string = 'toast-top-right';
  titleClass: string = 'toast-title';
  messageClass: string = 'toast-message';
  tapToDismiss: boolean = true;
  toastComponent: any = Toast;

  maxOpened: number = 0;
  autoDismiss: boolean = false;
  iconClasses = {
    error: 'toast-error',
    info: 'toast-info',
    success: 'toast-success',
    warning: 'toast-warning',
  };
  newestOnTop: boolean = true;
  preventDuplicates: boolean = false;

  constructor(config: ToastConfig = {}) {
    this.closeButton = config.closeButton || this.closeButton;
    this.extendedTimeOut = config.extendedTimeOut || this.extendedTimeOut;
    this.onHidden = config.onHidden || this.onHidden;
    this.onShown = config.onShown || this.onShown;
    this.onTap = config.onTap || this.onTap;
    this.progressBar = config.progressBar || this.progressBar;
    this.timeOut = config.timeOut || this.timeOut;

    this.toastClass = config.toastClass || this.toastClass;
    this.positionClass = config.positionClass || this.positionClass;
    this.titleClass = config.titleClass || this.titleClass;
    this.messageClass = config.messageClass || this.messageClass;
    this.tapToDismiss = config.tapToDismiss || this.tapToDismiss;
    this.toastComponent = config.toastComponent || this.toastComponent;
  }
}
