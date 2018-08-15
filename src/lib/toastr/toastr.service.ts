import {
  ComponentRef,
  Inject,
  Injectable,
  Injector,
  NgZone,
  SecurityContext
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { Observable } from 'rxjs';

import { Overlay } from '../overlay/overlay';
import { ComponentPortal } from '../portal/portal';
import { ToastInjector, ToastRef } from './toast-injector';
import { ToastContainerDirective } from './toast.directive';
import { GlobalConfig, IndividualConfig, ToastPackage, ToastToken, TOAST_CONFIG } from './toastr-config';

export interface ActiveToast<C> {
  /** Your Toast ID. Use this to close it individually */
  toastId: number;
  /** the message of your toast. Stored to prevent duplicates */
  message: string;
  /** a reference to the component see portal.ts */
  portal: ComponentRef<C>;
  /** a reference to your toast */
  toastRef: ToastRef<C>;
  /** triggered when toast is active */
  onShown: Observable<any>;
  /** triggered when toast is destroyed */
  onHidden: Observable<any>;
  /** triggered on toast click */
  onTap: Observable<any>;
  /** available for your use in custom toast */
  onAction: Observable<any>;
}

@Injectable({ providedIn: 'root' })
export class ToastrService {
  toastrConfig: GlobalConfig;
  currentlyActive = 0;
  toasts: ActiveToast<any>[] = [];
  overlayContainer: ToastContainerDirective;
  previousToastMessage: string | undefined;
  private index = 0;

  constructor(
    @Inject(TOAST_CONFIG) token: ToastToken,
    private overlay: Overlay,
    private _injector: Injector,
    private sanitizer: DomSanitizer,
    private ngZone: NgZone
  ) {
    this.toastrConfig = {
      ...token.default,
      ...token.config,
    };
    if (token.config.iconClasses) {
      this.toastrConfig.iconClasses = {
        ...token.default.iconClasses,
        ...token.config.iconClasses,
      };
    }
  }
  /** show toast */
  show(
    message?: string,
    title?: string,
    override: Partial<IndividualConfig> = {},
    type = ''
  ) {
    return this._preBuildNotification(
      type,
      message,
      title,
      this.applyConfig(override)
    );
  }
  /** show successful toast */
  success(
    message?: string,
    title?: string,
    override: Partial<IndividualConfig> = {}
  ) {
    const type = this.toastrConfig.iconClasses.success || '';
    return this._preBuildNotification(
      type,
      message,
      title,
      this.applyConfig(override)
    );
  }
  /** show error toast */
  error(
    message?: string,
    title?: string,
    override: Partial<IndividualConfig> = {}
  ) {
    const type = this.toastrConfig.iconClasses.error || '';
    return this._preBuildNotification(
      type,
      message,
      title,
      this.applyConfig(override)
    );
  }
  /** show info toast */
  info(
    message?: string,
    title?: string,
    override: Partial<IndividualConfig> = {}
  ) {
    const type = this.toastrConfig.iconClasses.info || '';
    return this._preBuildNotification(
      type,
      message,
      title,
      this.applyConfig(override)
    );
  }
  /** show warning toast */
  warning(
    message?: string,
    title?: string,
    override: Partial<IndividualConfig> = {}
  ) {
    const type = this.toastrConfig.iconClasses.warning || '';
    return this._preBuildNotification(
      type,
      message,
      title,
      this.applyConfig(override)
    );
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
    if (
      this.currentlyActive < this.toastrConfig.maxOpened &&
      this.toasts[this.currentlyActive]
    ) {
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
  isDuplicate(message: string, resetOnDuplicate: boolean) {
    for (let i = 0; i < this.toasts.length; i++) {
      if (this.toasts[i].message === message) {
        if (
          resetOnDuplicate &&
          this.toasts[i].toastRef.componentInstance.resetTimeout
        ) {
          this.toasts[i].toastRef.resetTimeout();
        }
        return true;
      }
    }
    return false;
  }

  /** create a clone of global config and apply individual settings */
  private applyConfig(override: Partial<IndividualConfig> = {}): GlobalConfig {
    return { ...this.toastrConfig, ...override };
  }

  /**
   * Find toast object by id
   */
  private _findToast(
    toastId: number
  ): { index: number; activeToast: ActiveToast<any> } | null {
    for (let i = 0; i < this.toasts.length; i++) {
      if (this.toasts[i].toastId === toastId) {
        return { index: i, activeToast: this.toasts[i] };
      }
    }
    return null;
  }

  /**
   * Determines the need to run inside angular's zone then builds the toast
   */
  private _preBuildNotification(
    toastType: string,
    message: string | undefined,
    title: string | undefined,
    config: GlobalConfig
  ): ActiveToast<any> | null {
    if (config.onActivateTick) {
      return this.ngZone.run(() =>
        this._buildNotification(toastType, message, title, config)
      );
    }
    return this._buildNotification(toastType, message, title, config);
  }

  /**
   * Creates and attaches toast data to component
   * returns null if toast is duplicate and preventDuplicates == True
   */
  private _buildNotification(
    toastType: string,
    message: string | undefined,
    title: string | undefined,
    config: GlobalConfig
  ): ActiveToast<any> | null {
    if (!config.toastComponent) {
      throw new Error('toastComponent required');
    }
    // max opened and auto dismiss = true
    if (
      message &&
      this.toastrConfig.preventDuplicates &&
      this.isDuplicate(message, this.toastrConfig.resetTimeoutOnDuplicate)
    ) {
      return null;
    }
    this.previousToastMessage = message;
    let keepInactive = false;
    if (
      this.toastrConfig.maxOpened &&
      this.currentlyActive >= this.toastrConfig.maxOpened
    ) {
      keepInactive = true;
      if (this.toastrConfig.autoDismiss) {
        this.clear(this.toasts[0].toastId);
      }
    }
    const overlayRef = this.overlay.create(
      config.positionClass,
      this.overlayContainer
    );
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
      toastRef
    );
    const toastInjector = new ToastInjector(toastPackage, this._injector);
    const component = new ComponentPortal(config.toastComponent, toastInjector);
    const portal = overlayRef.attach(component, this.toastrConfig.newestOnTop);
    toastRef.componentInstance = (<any>portal)._component;
    const ins: ActiveToast<any> = {
      toastId: this.index,
      message: message || '',
      toastRef,
      onShown: toastRef.afterActivate(),
      onHidden: toastRef.afterClosed(),
      onTap: toastPackage.onTap(),
      onAction: toastPackage.onAction(),
      portal
    };

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
