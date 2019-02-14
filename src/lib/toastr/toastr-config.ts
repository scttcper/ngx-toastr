import { InjectionToken } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';

import { Observable, Subject } from 'rxjs';

import { ComponentType } from '../portal/portal';
import { ToastRef } from './toast-injector';

export type ProgressAnimationType = 'increasing' | 'decreasing';

/**
 * Configuration for an individual toast.
 */
export interface IndividualConfig {
  /**
   * disable both timeOut and extendedTimeOut
   * default: false
   */
  disableTimeOut: boolean;
  /**
   * toast time to live in milliseconds
   * default: 5000
   */
  timeOut: number;
  /**
   * toast show close button
   * default: false
   */
  closeButton: boolean;
  /**
   * time to close after a user hovers over toast
   * default: 1000
   */
  extendedTimeOut: number;
  /**
   * show toast progress bar
   * default: false
   */
  progressBar: boolean;

  /**
   * changes toast progress bar animation
   * default: decreasing
   */
  progressAnimation: ProgressAnimationType;

  /**
   * render html in toast message (possibly unsafe)
   * default: false
   */
  enableHtml: boolean;
  /**
   * css class on toast component
   * default: toast
   */
  toastClass: string;
  /**
   * css class on toast container
   * default: toast-top-right
   */
  positionClass: string;
  /**
   * css class on toast title
   * default: toast-title
   */
  titleClass: string;
  /**
   * css class on toast message
   * default: toast-message
   */
  messageClass: string;
  /**
   * animation easing on toast
   * default: ease-in
   */
  easing: string;
  /**
   * animation ease time on toast
   * default: 300
   */
  easeTime: string | number;
  /**
   * clicking on toast dismisses it
   * default: true
   */
  tapToDismiss: boolean;
  /**
   * Angular toast component to be shown
   * default: Toast
   */
  toastComponent?: ComponentType<any>;
  /**
   * Helps show toast from a websocket or from event outside Angular
   * default: false
   */
  onActivateTick: boolean;
}

export interface ToastrIconClasses {
  error: string;
  info: string;
  success: string;
  warning: string;
}

/**
 * Global Toast configuration
 * Includes all IndividualConfig
 */
export interface GlobalConfig extends IndividualConfig {
  /**
   * max toasts opened. Toasts will be queued
   * Zero is unlimited
   * default: 0
   */
  maxOpened: number;
  /**
   * dismiss current toast when max is reached
   * default: false
   */
  autoDismiss: boolean;
  iconClasses: Partial<ToastrIconClasses>;
  /**
   * New toast placement
   * default: true
   */
  newestOnTop: boolean;
  /**
   * block duplicate messages
   * default: false
   */
  preventDuplicates: boolean;

  /**
   * Reset toast timeout when there's a duplicate (preventDuplicates needs to be set to true)
   * default: false
   */
  resetTimeoutOnDuplicate: boolean;
}

/**
 * Everything a toast needs to launch
 */
export class ToastPackage {
  private _onTap = new Subject<any>();
  private _onAction = new Subject<any>();

  constructor(
    public toastId: number,
    public config: IndividualConfig,
    public message: string | SafeHtml | null | undefined,
    public title: string | undefined,
    public toastType: string,
    public toastRef: ToastRef<any>,
  ) {
    this.toastRef.afterClosed().subscribe(() => {
      this._onAction.complete();
      this._onTap.complete();
    });
  }

  /** Fired on click */
  triggerTap() {
    this._onTap.next();
    if (this.config.tapToDismiss) {
      this._onTap.complete();
    }
  }

  onTap(): Observable<any> {
    return this._onTap.asObservable();
  }

  /** available for use in custom toast */
  triggerAction(action?: any) {
    this._onAction.next(action);
  }

  onAction(): Observable<any> {
    return this._onAction.asObservable();
  }
}

/* tslint:disable:no-empty-interface */
/** @deprecated use GlobalConfig */
export interface GlobalToastrConfig extends GlobalConfig {}
/** @deprecated use IndividualConfig */
export interface IndividualToastrConfig extends IndividualConfig {}
/** @deprecated use IndividualConfig */
export interface ToastrConfig extends IndividualConfig {}

export const DefaultNoComponentGlobalConfig: GlobalConfig = {
  maxOpened: 0,
  autoDismiss: false,
  newestOnTop: true,
  preventDuplicates: false,
  resetTimeoutOnDuplicate: false,
  iconClasses: {
    error: 'toast-error',
    info: 'toast-info',
    success: 'toast-success',
    warning: 'toast-warning',
  },

  // Individual
  closeButton: false,
  disableTimeOut: false,
  timeOut: 5000,
  extendedTimeOut: 1000,
  enableHtml: false,
  progressBar: false,
  toastClass: 'toast',
  positionClass: 'toast-top-right',
  titleClass: 'toast-title',
  messageClass: 'toast-message',
  easing: 'ease-in',
  easeTime: 300,
  tapToDismiss: true,
  onActivateTick: false,
  progressAnimation: 'decreasing',
};

export interface ToastToken {
  default: GlobalConfig;
  config: Partial<GlobalConfig>;
}

export const TOAST_CONFIG = new InjectionToken<ToastToken>('ToastConfig');
