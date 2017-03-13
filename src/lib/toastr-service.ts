import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { Overlay } from './overlay/overlay';
import { ComponentPortal } from './portal/portal';
import { ToastConfig, ToastrConfig, ToastData } from './toastr-config';
import { ToastInjector, ToastRef } from './toast-injector';
import { ToastContainerDirective } from './toast-directive';

export interface ActiveToast {
  toastId?: number;
  message?: string;
  portal?: any;
  toastRef?: ToastRef<any>;
  onShown?: Observable<any>;
  onHidden?: Observable<any>;
  onTap?: Observable<any>;
  onAction?: Observable<any>;
}

@Injectable()
export class ToastrService {
  private index = 0;
  private toasts: any[] = [];
  private previousToastMessage = '';
  private currentlyActive = 0;
  overlayContainer: ToastContainerDirective;

  constructor(
    public toastrConfig: ToastrConfig,
    private overlay: Overlay,
    private _injector: Injector
  ) { }
  /** show successful toast */
  public show(message: string, title?: string, optionsOverride?: ToastConfig, type = '') {
    return this._buildNotification(type, message, title, this.createToastConfig(optionsOverride));
  }
  /** show successful toast */
  public success(message: string, title?: string, optionsOverride?: ToastConfig) {
    const type = this.toastrConfig.iconClasses.success;
    return this._buildNotification(type, message, title, this.createToastConfig(optionsOverride));
  }
  /** show error toast */
  public error(message: string, title?: string, optionsOverride?: ToastConfig) {
    const type = this.toastrConfig.iconClasses.error;
    return this._buildNotification(type, message, title, this.createToastConfig(optionsOverride));
  }
  /** show info toast */
  public info(message: string, title?: string, optionsOverride?: ToastConfig) {
    const type = this.toastrConfig.iconClasses.info;
    return this._buildNotification(type, message, title, this.createToastConfig(optionsOverride));
  }
  /** show warning toast */
  public warning(message: string, title?: string, optionsOverride?: ToastConfig) {
    const type = this.toastrConfig.iconClasses.warning;
    return this._buildNotification(type, message, title, this.createToastConfig(optionsOverride));
  }
  createToastConfig(optionsOverride: ToastConfig): ToastConfig {
    if (!optionsOverride) {
      return Object.create(this.toastrConfig);
    }
    if (optionsOverride instanceof ToastConfig) {
      return optionsOverride;
    }
    return new ToastConfig(optionsOverride);
  }
  /**
   * Remove all toasts
   */
  public clear(toastId?: number) {
    // Call every toast's remove function
    for (const toast of this.toasts) {
      if (toastId !== undefined) {
        if (toast.toastId === toastId) {
          toast.portal._component.remove();
          return;
        }
      } else {
        toast.portal._component.remove();
      }
    }
  }
  /**
   * Remove and destroy a single toast by id
   */
  public remove(toastId: number) {
    const { index, activeToast } = this._findToast(toastId);
    if (!activeToast) {
      return false;
    }
    activeToast.toastRef.close();
    this.toasts.splice(index, 1);
    this.currentlyActive = this.currentlyActive - 1;
    if (!this.toastrConfig.maxOpened || !this.toasts.length) {
      return false;
    }
    if (this.currentlyActive <= this.toastrConfig.maxOpened && this.toasts[this.currentlyActive]) {
      const p = this.toasts[this.currentlyActive].portal;
      if (p._component.state === 'inactive') {
        this.currentlyActive = this.currentlyActive + 1;
        this.toasts[this.currentlyActive].toastRef.activate();
      }
    }
    return true;
  }

  /**
   * Find toast object by id
   */
  private _findToast(toastId: number): { index: number | null, activeToast: ActiveToast | null } {
    for (let i = 0; i < this.toasts.length; i++) {
      if (this.toasts[i].toastId === toastId) {
        return { index: i, activeToast: this.toasts[i] };
      }
    }
    return { index: null, activeToast: null };
  }
  /**
   * Determines if toast message is already shown
   */
  private isDuplicate(message: string) {
    for (let i = 0; i < this.toasts.length; i++) {
      if (this.toasts[i].message === message) {
        return true;
      }
    }
    return false;
  }

  /**
   * Creates and attaches toast data to component
   */
  private _buildNotification(
    toastType: string,
    message: string,
    title: string,
    optionsOverride: ToastConfig = Object.create(this.toastrConfig)
  ) {
    // max opened and auto dismiss = true
    if (this.toastrConfig.preventDuplicates && this.isDuplicate(message)) {
      return;
    }
    this.previousToastMessage = message;
    let keepInactive = false;
    if (this.toastrConfig.maxOpened && this.currentlyActive >= this.toastrConfig.maxOpened) {
      keepInactive = true;
      if (this.toastrConfig.autoDismiss) {
        this.clear(this.toasts[this.toasts.length - 1].toastId);
      }
    }
    const overlayRef = this.overlay.create(optionsOverride.positionClass, this.overlayContainer);
    const ins: ActiveToast = {
      toastId: this.index++,
      message,
      toastRef: new ToastRef(overlayRef),
    };
    ins.onShown = ins.toastRef.afterActivate();
    ins.onHidden = ins.toastRef.afterClosed();
    const data = new ToastData();
    data.toastId = ins.toastId;
    data.optionsOverride = optionsOverride;
    data.message = message;
    data.title = title;
    data.toastType = toastType;
    data.onTap = new Subject();
    ins.onTap = data.onTap.asObservable();
    data.onAction = new Subject();
    ins.onAction = data.onAction.asObservable();
    const toastInjector = new ToastInjector(ins.toastRef, data, this._injector);
    const component = new ComponentPortal(optionsOverride.toastComponent, null, toastInjector);
    ins.portal = overlayRef.attach(component, this.toastrConfig.newestOnTop);
    if (!keepInactive) {
      setTimeout(() => {
        ins.toastRef.activate();
        this.currentlyActive = this.currentlyActive + 1;
      });
    }
    this.toasts.push(ins);
    return ins;
  }
}
