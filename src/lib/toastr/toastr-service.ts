import { ComponentRef, Inject, Injectable, Injector, SecurityContext } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';

import { Overlay } from '../overlay/overlay';
import { ComponentPortal } from '../portal/portal';
import { DefaultGlobalConfig } from './default-config';
import { ToastContainerDirective } from './toast-directive';
import { ToastRef, ToastInjector } from './toast-injector';
import { TOAST_CONFIG } from './toast-token';
import { GlobalConfig, IndividualConfig, ToastrIconClasses, ToastPackage } from './toastr-config';

export interface ActiveToast {
  toastId?: number;
  message?: string;
  portal?: ComponentRef<any>;
  toastRef: ToastRef<any>;
  onShown?: Observable<any>;
  onHidden?: Observable<any>;
  onTap?: Observable<any>;
  onAction?: Observable<any>;
}

@Injectable()
export class ToastrService {
  toastrConfig: GlobalConfig = new DefaultGlobalConfig();
  private index = 0;
  private previousToastMessage?: string;
  currentlyActive = 0;
  toasts: ActiveToast[] = [];
  overlayContainer: ToastContainerDirective;

  constructor(
    @Inject(TOAST_CONFIG) toastrConfig: GlobalConfig,
    private overlay: Overlay,
    private _injector: Injector,
    private sanitizer: DomSanitizer,
  ) {
    this.toastrConfig = this.applyConfig(toastrConfig);
  }
  /** show toast */
  show(message?: string, title?: string, override?: IndividualConfig, type = '') {
    return this._buildNotification(type, message, title, this.applyConfig(override));
  }
  /** show successful toast */
  success(message?: string, title?: string, override?: IndividualConfig) {
    const type = this.toastrConfig.iconClasses!.success || '';
    return this._buildNotification(type, message, title, this.applyConfig(override));
  }
  /** show error toast */
  error(message?: string, title?: string, override?: IndividualConfig) {
    const type = this.toastrConfig.iconClasses!.error || '';
    return this._buildNotification(type, message, title, this.applyConfig(override));
  }
  /** show info toast */
  info(message?: string, title?: string, override?: IndividualConfig) {
    const type = this.toastrConfig.iconClasses!.info || '';
    return this._buildNotification(type, message, title, this.applyConfig(override));
  }
  /** show warning toast */
  warning(message?: string, title?: string, override?: IndividualConfig) {
    const type = this.toastrConfig.iconClasses!.warning || '';
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
    const found = this._findToast(toastId);
    if (!found) {
      return false;
    }
    found.activeToast.toastRef.close();
    this.toasts.splice(found.index, 1);
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
  private applyConfig(override: GlobalConfig | IndividualConfig = {}): GlobalConfig {
    function use<T>(source: T, defaultValue: T): T {
      return override && source !== undefined ? source : defaultValue;
    }

    const current: GlobalConfig = { ...this.toastrConfig };

    for (const property of Object.keys(current)) {
      override[property] = use(override[property], current[property]);
    }

    const asGlobalConfig = override as GlobalConfig;
    if (asGlobalConfig.iconClasses) {
      const currentIconClasses = <ToastrIconClasses>current.iconClasses;
      for (const property of Object.keys(currentIconClasses)) {
        asGlobalConfig.iconClasses[property] = use(asGlobalConfig.iconClasses[property], currentIconClasses[property]);
      }
    }

    return override;
  }

  /**
   * Find toast object by id
   */
  private _findToast(toastId: number): { index: number, activeToast: ActiveToast } | null {
    for (let i = 0; i < this.toasts.length; i++) {
      if (this.toasts[i].toastId === toastId) {
        return { index: i, activeToast: this.toasts[i] };
      }
    }
    return null;
  }

  /**
   * Creates and attaches toast data to component
   * returns null if toast is duplicate and preventDuplicates == True
   */
  private _buildNotification(
    toastType: string,
    message: string | undefined,
    title: string | undefined,
    config: GlobalConfig,
  ): ActiveToast | null {
    if (!config.toastComponent) {
      throw new Error('toastComponent required');
    }
    // max opened and auto dismiss = true
    if (message && this.toastrConfig.preventDuplicates && this.isDuplicate(message)) {
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
    let sanitizedMessage: string | SafeHtml | undefined | null = message;
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
      onHidden: toastRef.afterClosed(),
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
