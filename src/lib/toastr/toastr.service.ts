import {
  ComponentRef,
  Inject,
  Injectable,
  Injector,
  SecurityContext,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { Observable } from 'rxjs/Observable';

import { Overlay } from '../overlay/overlay';
import { ComponentPortal } from '../portal/portal';
import { ToastContainerDirective } from './toast.directive';
import { ToastRef, ToastInjector } from './toast-injector';
import { TOAST_CONFIG, ToastToken } from './toast-token';
import {
  GlobalConfig,
  IndividualConfig,
  ToastrIconClasses,
  ToastPackage,
} from './toastr-config';


export interface ActiveToast {
  /** Your Toast ID. Use this to close it individually */
  toastId: number;
  /** the message of your toast. Stored to prevent duplicates */
  message: string;
  /** a reference to the component see portal.ts */
  portal: ComponentRef<any>;
  /** a reference to your toast */
  toastRef: ToastRef<any>;
  /** triggered when toast is active */
  onShown: Observable<any>;
  /** triggered when toast is destroyed */
  onHidden: Observable<any>;
  /** triggered on toast click */
  onTap: Observable<any>;
  /** available for your use in custom toast */
  onAction: Observable<any>;
}

@Injectable()
export class ToastrService {
  toastrConfig: GlobalConfig;
  private index = 0;
  private previousToastMessage?: string;
  currentlyActive = 0;
  toasts: ActiveToast[] = [];
  overlayContainer: ToastContainerDirective;

  constructor(
    @Inject(TOAST_CONFIG) token: ToastToken,
    private overlay: Overlay,
    private _injector: Injector,
    private sanitizer: DomSanitizer,
  ) {
    const defaultConfig = new token.defaults;
    this.toastrConfig = { ...defaultConfig, ...token.config };
    this.toastrConfig.iconClasses = {
      ...defaultConfig.iconClasses,
      ...token.config.iconClasses,
    };
  }
  /** show toast */
  show(message?: string, title?: string, override: Partial<IndividualConfig> = {}, type = '') {
    return this._buildNotification(type, message, title, this.applyConfig(override));
  }
  /** show successful toast */
  success(message?: string, title?: string, override: Partial<IndividualConfig> = {}) {
    const type = this.toastrConfig.iconClasses.success || '';
    return this._buildNotification(type, message, title, this.applyConfig(override));
  }
  /** show error toast */
  error(message?: string, title?: string, override: Partial<IndividualConfig> = {}) {
    const type = this.toastrConfig.iconClasses.error || '';
    return this._buildNotification(type, message, title, this.applyConfig(override));
  }
  /** show info toast */
  info(message?: string, title?: string, override: Partial<IndividualConfig> = {}) {
    const type = this.toastrConfig.iconClasses.info || '';
    return this._buildNotification(type, message, title, this.applyConfig(override));
  }
  /** show warning toast */
  warning(message?: string, title?: string, override: Partial<IndividualConfig> = {}) {
    const type = this.toastrConfig.iconClasses.warning || '';
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
  private applyConfig(override: Partial<IndividualConfig> = {}): GlobalConfig {
    return { ...this.toastrConfig, ...override };
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
    const toastInjector = new ToastInjector(toastPackage, this._injector);
    const component = new ComponentPortal(config.toastComponent, toastInjector);
    const ins: ActiveToast = {
      toastId: this.index,
      message: message || '',
      toastRef,
      onShown: toastRef.afterActivate(),
      onHidden: toastRef.afterClosed(),
      onTap: toastPackage.onTap(),
      onAction: toastPackage.onAction(),
      portal: overlayRef.attach(component, this.toastrConfig.newestOnTop),
    };

    if (!keepInactive) {
      // Trigger change detection if onActivateTick is set to true
      if (config.onActivateTick && ins.onShown) {
        ins.onShown.subscribe(() => {
          ins.portal.changeDetectorRef.detectChanges();
        });
      }
      setTimeout(() => {
        ins.toastRef.activate();
        this.currentlyActive = this.currentlyActive + 1;
      });
    }

    this.toasts.push(ins);
    return ins;
  }
}
