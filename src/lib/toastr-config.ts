import { Injectable, EventEmitter } from '@angular/core';

import { Toast } from './toast-component';

@Injectable()
export class ToastConfig {
  // shows close button
  public closeButton: boolean = false;
  public extendedTimeOut: number = 1000;
  public onHidden: EventEmitter<any> = new EventEmitter();
  public onShown: EventEmitter<any> = new EventEmitter();
  public onTap: EventEmitter<any> = new EventEmitter();
  public progressBar: boolean = false;
  public timeOut: number = 5000;

  public toastClass: string = 'toast';
  public positionClass: string = 'toast-top-right';
  public titleClass: string = 'toast-title';
  public messageClass: string = 'toast-message';
  public tapToDismiss: boolean = true;
  public toastComponent = Toast;
  constructor(config: any = {}) {
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

@Injectable()
export class ToastrConfig extends ToastConfig {
  public maxOpened: number = 0;
  public autoDismiss: boolean = false;
  public iconClasses = {
    error: 'toast-error',
    info: 'toast-info',
    success: 'toast-success',
    warning: 'toast-warning',
  };
  public newestOnTop: boolean = true;
  public preventDuplicates: boolean = false;
  constructor(config: any = {}) {
    super(config);
    this.maxOpened = config.maxOpened || this.maxOpened;
    this.autoDismiss = config.autoDismiss || this.autoDismiss;
    if (config.iconClasses) {
      this.iconClasses.error = config.iconClasses.error || this.iconClasses.error;
      this.iconClasses.info = config.iconClasses.info || this.iconClasses.info;
      this.iconClasses.success = config.iconClasses.success || this.iconClasses.success;
      this.iconClasses.warning = config.iconClasses.warning || this.iconClasses.warning;
    }
    this.newestOnTop = config.newestOnTop || this.newestOnTop;
    this.preventDuplicates = config.preventDuplicates || this.preventDuplicates;
  }
}
