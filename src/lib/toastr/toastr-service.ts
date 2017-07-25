import { Injectable, Injector, ComponentRef, Inject, SecurityContext } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { Overlay } from '../overlay/overlay';
import { ComponentPortal } from '../portal/portal';
import { GlobalConfig, IndividualConfig, ToastPackage } from './toastr-config';
import { ToastInjector, ToastRef } from './toast-injector';
import { ToastContainerDirective } from './toast-directive';
import { TOAST_CONFIG } from './toast-token';
import { Toast } from './toast-component';
import { DomSanitizer } from '@angular/platform-browser';

export interface ActiveToast {
  toastId?: number;
  message?: string;
  portal?: ComponentRef<any>;
  toastRef?: ToastRef<any>;
  onShown?: Observable<any>;
  onHidden?: Observable<any>;
  onTap?: Observable<any>;
  onAction?: Observable<any>;
}

@Injectable()
export class ToastrService {
  private index = 0;
  private previousToastMessage = '';
  currentlyActive = 0;
  toasts: ActiveToast[] = [];
  overlayContainer: ToastContainerDirective;

  constructor(
    @Inject(TOAST_CONFIG) public toastrConfig: any,
    private overlay: Overlay,
    private _injector: Injector,
    private sanitizer: DomSanitizer,
  ) {
    function use<T>(source: T, defaultValue: T): T {
      return toastrConfig && source !== undefined ? source : defaultValue;
    }
    this.toastrConfig = this.applyConfig(toastrConfig);
    this.toastrConfig.maxOpened = use(this.toastrConfig.maxOpened, 0);
    this.toastrConfig.autoDismiss = use(this.toastrConfig.autoDismiss, false);
    this.toastrConfig.newestOnTop = use(this.toastrConfig.newestOnTop, true);
    this.toastrConfig.preventDuplicates = use(this.toastrConfig.preventDuplicates, false);
    if (!this.toastrConfig.iconClasses) {
      this.toastrConfig.iconClasses = {};
    }
    this.toastrConfig.iconClasses.error = this.toastrConfig.iconClasses.error || 'toast-error';
    this.toastrConfig.iconClasses.info = this.toastrConfig.iconClasses.info || 'toast-info';
    this.toastrConfig.iconClasses.success = this.toastrConfig.iconClasses.success || 'toast-success';
    this.toastrConfig.iconClasses.warning = this.toastrConfig.iconClasses.warning || 'toast-warning';
  }
  /** show successful toast */
  show(message: string, title?: string, override?: IndividualConfig, type = '') {
    return this._buildNotification(type, message, title, this.applyConfig(override));
  }
  /** show successful toast */
  success(message: string, title?: string, override?: IndividualConfig) {
    const type = this.toastrConfig.iconClasses.success;
    return this._buildNotification(type, message, title, this.applyConfig(override));
  }
  /** show error toast */
  error(message: string, title?: string, override?: IndividualConfig) {
    const type = this.toastrConfig.iconClasses.error;
    return this._buildNotification(type, message, title, this.applyConfig(override));
  }
  /** show info toast */
  info(message: string, title?: string, override?: IndividualConfig) {
    const type = this.toastrConfig.iconClasses.info;
    return this._buildNotification(type, message, title, this.applyConfig(override));
  }
  /** show warning toast */
  warning(message: string, title?: string, override?: IndividualConfig) {
    const type = this.toastrConfig.iconClasses.warning;
    return this._buildNotification(type, message, title, this.applyConfig(override));
  }
  /**
   * Remove all or a single toast by id
   */
  clear(toastId?: number) {
    // Call every toastRef manualClose function
    for (const toast of this.toasts) {
      if (toastId !== undefined) {
        if (toast.toastId === toastId) {
          toast.toastRef.manualClose();
          return;
        }
      } else {
        toast.toastRef.manualClose();
      }
    }
  }
  /**
   * Remove and destroy a single toast by id
   */
  remove(toastId: number) {
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
    if (this.currentlyActive <= +this.toastrConfig.maxOpened && this.toasts[this.currentlyActive]) {
      const p = this.toasts[this.currentlyActive].toastRef;
      if (!p.isInactive()) {
        this.currentlyActive = this.currentlyActive + 1;
        p.activate();
      }
    }
    return true;
  }

  /**
   * Determines if toast message is already shown
   */
  isDuplicate(message: string) {
    for (let i = 0; i < this.toasts.length; i++) {
      if (this.toasts[i].message === message) {
        return true;
      }
    }
    return false;
  }

  /** create a clone of global config and apply individual settings */
  private applyConfig(override: IndividualConfig = {}): GlobalConfig {
    function use<T>(source: T, defaultValue: T): T {
      return override && source !== undefined ? source : defaultValue;
    }
    const current = { ...this.toastrConfig };
    current.closeButton = use(override.closeButton, false);
    current.extendedTimeOut = use(override.extendedTimeOut, 1000);
    current.progressBar = use(override.progressBar, false);
    current.timeOut = use(override.timeOut, 5000);
    current.enableHtml = use(override.enableHtml, false);
    current.toastClass = use(override.toastClass, 'toast');
    current.positionClass = use(override.positionClass, 'toast-top-right');
    current.titleClass = use(override.titleClass, 'toast-title');
    current.messageClass = use(override.messageClass, 'toast-message');
    current.tapToDismiss = use(override.tapToDismiss, true);
    current.toastComponent = use(override.toastComponent, Toast);
    current.onActivateTick = use(override.onActivateTick, false);
    return current;
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
   * Creates and attaches toast data to component
   * returns null if toast is duplicate and preventDuplicates == True
   */
  private _buildNotification(
    toastType: string,
    message: string,
    title: string,
    config: GlobalConfig,
  ): ActiveToast | null {
    // max opened and auto dismiss = true
    if (this.toastrConfig.preventDuplicates && this.isDuplicate(message)) {
      return null;
    }
    this.previousToastMessage = message;
    let keepInactive = false;
    if (this.toastrConfig.maxOpened && this.currentlyActive >= this.toastrConfig.maxOpened) {
      keepInactive = true;
      if (this.toastrConfig.autoDismiss) {
        this.clear(this.toasts[this.toasts.length - 1].toastId);
      }
    }
    const overlayRef = this.overlay.create(config.positionClass, this.overlayContainer);
    this.index = this.index + 1;
    let sanitizedMessage = message;
    if (message && config.enableHtml) {
      sanitizedMessage = this.sanitizer.sanitize(SecurityContext.HTML, message);
    }
    const toastRef = new ToastRef(overlayRef);
    const toastPackage = new ToastPackage(
      this.index,
      config,
      sanitizedMessage,
      title,
      toastType,
      toastRef,
    );
    const ins: ActiveToast = {
      toastId: this.index,
      message,
      toastRef,
      onShown: toastRef.afterActivate(),
      onHidden: toastRef.afterActivate(),
      onTap: toastPackage.onTap(),
      onAction: toastPackage.onAction(),
    };
    const toastInjector = new ToastInjector(toastPackage, this._injector);
    const component = new ComponentPortal(config.toastComponent, toastInjector);
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
