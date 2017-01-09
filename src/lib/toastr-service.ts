import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { Overlay } from './overlay/overlay';
import { OverlayRef } from './overlay/overlay-ref';
import { ComponentPortal } from './portal/portal';
import { ToastConfig, ToastrConfig, ToastData } from './toastr-config';
import { ToastInjector, ToastRef } from './toast-injector';
import { ToastContainerDirective } from './overlay/overlay-directives';

export interface ActiveToast {
  toastId?: number;
  message?: string;
  portal?: any;
  toastRef?: ToastRef<any>;
  onShown?: Observable<any>;
  onHidden?: Observable<any>;
  onTap?: Observable<any>;
}

@Injectable()
export class ToastrService {
  private index: number = 0;
  private toasts: any[] = [];
  private previousToastMessage: string = '';
  private currentlyActive = 0;
  overlayContainer: ToastContainerDirective;

  constructor(
    public toastrConfig: ToastrConfig,
    private overlay: Overlay,
    private _injector: Injector
  ) { }

  public success(message: string, title?: string, optionsOverride?: ToastConfig): ActiveToast {
    const type = this.toastrConfig.iconClasses.success;
    return this._buildNotification(type, message, title, this.createToastConfig(optionsOverride));
  }
  public error(message: string, title?: string, optionsOverride?: ToastConfig): ActiveToast {
    const type = this.toastrConfig.iconClasses.error;
    return this._buildNotification(type, message, title, this.createToastConfig(optionsOverride));
  }
  public info(message: string, title?: string, optionsOverride?: ToastConfig): ActiveToast {
    const type = this.toastrConfig.iconClasses.info;
    return this._buildNotification(type, message, title, this.createToastConfig(optionsOverride));
  }
  public warning(message: string, title?: string, optionsOverride?: ToastConfig): ActiveToast {
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
  public remove(toastId: number): boolean {
    const { index, activeToast } = this._findToast(toastId);
    if (!activeToast) {
      return false;
    }
    activeToast.toastRef.close();
    this.toasts.splice(index, 1);
    this.currentlyActive = this.currentlyActive - 1;
    if (!this.toastrConfig.maxOpened || !this.toasts.length) {
      return;
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
  private _findToast(toastId: number): { index: number, activeToast: ActiveToast } {
    for (let i = 0; i < this.toasts.length; i++) {
      if (this.toasts[i].toastId === toastId) {
        return { index: i, activeToast: this.toasts[i] };
      }
    }
    return { index: null, activeToast: null };
  }
  private isDuplicate(message: string): boolean {
    for (let i = 0; i < this.toasts.length; i++) {
      if (this.toasts[i].message === message) {
        return true;
      }
    }
    return false;
  }

  private _buildNotification(
    toastType: string,
    message: string,
    title: string,
    optionsOverride: ToastConfig = Object.create(this.toastrConfig)
  ): ActiveToast {
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
