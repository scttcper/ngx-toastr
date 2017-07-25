/* tslint:disable:no-inferrable-types */
import { SafeHtml } from '@angular/platform-browser';

import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

import { ComponentType } from '../portal/portal';
import { Toast } from './toast-component';
import { ToastRef } from './toast-injector';

/**
 * Configuration for an individual toast.
 */
 export interface IndividualConfig {
  /** show close button */
  closeButton?: boolean;
  /** time to close after a user hovers over toast */
  extendedTimeOut?: number;
  /** show progress bar */
  progressBar?: boolean;
  /** time to live */
  timeOut?: number;
  /** allow html in message */
  enableHtml?: boolean;
  /** class applied to toast component */
  toastClass?: string;
  positionClass?: string;
  titleClass?: string;
  messageClass?: string;
  /** clicking on toast dismisses it */
  tapToDismiss?: boolean;
  /** the Angular component to be shown */
  toastComponent?: ComponentType<any>;
  /** Helps show toast from a websocket or from event outside Angular */
  onActivateTick?: boolean;
}

export interface ToastrIconClasses {
  error?: string;
  info?: string;
  success?: string;
  warning?: string;
}

/**
 * Global Toast configuration
 */
export interface GlobalConfig extends IndividualConfig {
  /** max toasts opened. Toasts will be queued */
  maxOpened?: number;
  /** dismiss current toast when max is reached */
  autoDismiss?: boolean;
  iconClasses?: ToastrIconClasses;
  /** new toast placement */
  newestOnTop?: boolean;
  /** block duplicate messages */
  preventDuplicates?: boolean;
}

/**
 * Everything a toast needs to launch
 */
export class ToastPackage {
  private _onTap: Subject<any> = new Subject();
  private _onAction: Subject<any> = new Subject();

  constructor(
    public toastId: number,
    public config: IndividualConfig,
    public message: string | SafeHtml,
    public title: string,
    public toastType: string,
    public toastRef: ToastRef<any>,
  ) { }

  /** Fired on click */
  triggerTap() {
    this._onTap.next();
    this._onTap.complete();
  }

  onTap(): Observable<any> {
    return this._onTap.asObservable();
  }

  /** available for use in custom toast */
  triggerAction(action?: any) {
    this._onAction.next(action);
    this._onAction.complete();
  }

  onAction(): Observable<any> {
    return this._onAction.asObservable();
  }

}
