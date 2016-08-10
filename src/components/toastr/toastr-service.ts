import {
  Injectable,
  ViewContainerRef,
  ReflectiveInjector,
  provide,
  Injector,
  Provider,
  NgModule,
} from '@angular/core';

import { Overlay } from './overlay/overlay';
import { OverlayRef } from './overlay/overlay-ref';
import { ComponentPortal, PortalHost } from './portal/portal';
import { OverlayContainer } from './overlay/overlay-container';
import { ToastConfig, ToastrConfig } from './toastr-config';

export interface ActiveToast {
  toastId: number;
  message: string;
  portal?: Promise<PortalHost>;
  overlayRef?: Promise<OverlayRef>;
}

@Injectable()
export class ToastrService {
  // TODO: remove when we can access the global view ref from service
  viewContainerRef: ViewContainerRef;
  private index: number = 0;
  private toasts: any[] = [];
  private previousToastMessage: string = '';

  constructor(
    public toastrConfig: ToastrConfig,
    private overlay: Overlay,
    private injector: Injector
  ) {}

  public success(message: string, title?: string, optionsOverride?: ToastConfig): ActiveToast {
    const type = this.toastrConfig.iconClasses.success;
    return this._buildNotification(type, message, title, optionsOverride);
  }
  public error(message: string, title?: string, optionsOverride?: ToastConfig): ActiveToast {
    const type = this.toastrConfig.iconClasses.error;
    return this._buildNotification(type, message, title, optionsOverride);
  }
  public info(message: string, title?: string, optionsOverride?: ToastConfig): ActiveToast {
    const type = this.toastrConfig.iconClasses.info;
    return this._buildNotification(type, message, title, optionsOverride);
  }
  public warning(message: string, title?: string, optionsOverride?: ToastConfig): ActiveToast {
    const type = this.toastrConfig.iconClasses.warning;
    return this._buildNotification(type, message, title, optionsOverride);
  }
  public clear(toastId?: number) {
    // Call every toast's remove function
    for (let i = 0; i < this.toasts.length; i++) {
      if (toastId !== undefined) {
        if (this.toasts[i].toastId === toastId) {
          this.toasts[i].portal.then(portal => portal._hostElement.component.remove());
          return;
        }
      } else {
        this.toasts[i].portal.then(portal => portal._hostElement.component.remove());
      }
    }
  }
  public remove(toastId: number): boolean {
    let { index, activeToast } = this._findToast(toastId);
    if (!activeToast) {
      return false;
    }
    activeToast.overlayRef.then(ref => ref.detach());
    this.toasts.splice(index, 1);
    if (this.toastrConfig.maxOpened &&
      this.toasts.length && this.toasts.length >= this.toastrConfig.maxOpened) {
      this.toasts[+this.toastrConfig.maxOpened - 1].portal.then((portal) => {
        if (portal._hostElement.component.state === 'inactive') {
          portal._hostElement.component.activateToast();
        }
      });
    }
    if (!this.toasts.length) {
      this.overlay.dispose();
      activeToast.overlayRef.then((ref) => ref.dispose());
    }
    return true;
  }
  private _findToast(toastId: number): {index: number, activeToast: ActiveToast} {
    for (let i = 0; i < this.toasts.length; i++) {
      if (this.toasts[i].toastId === toastId) {
        return {index: i, activeToast: this.toasts[i]};
      }
    }
    return {index: null, activeToast: null};
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
    type: string,
    message: string,
    title?: string,
    optionsOverride: ToastConfig = this.toastrConfig
  ): ActiveToast {
    // max opened and auto dismiss = true
    if (this.toastrConfig.preventDuplicates && this.isDuplicate(message)) {
      return;
    }
    this.previousToastMessage = message;
    let keepInactive = false;
    if (+this.toastrConfig.maxOpened && this.toasts.length >= +this.toastrConfig.maxOpened) {
      keepInactive = true;
      if (this.toastrConfig.autoDismiss) {
        this.clear(this.toasts[this.toasts.length - 1].toastId);
      }
    }

    // pass current view to toast
    // this keeps the ToastrService as a singleton
    let resolvedProviders = ReflectiveInjector.resolve([
      new Provider('view', { useValue: this.viewContainerRef }),
      new Provider('ToastrService', {useValue: this}),
    ]);
    let toastInjector = ReflectiveInjector.fromResolvedProviders(resolvedProviders, this.injector);
    let component = new ComponentPortal(
      optionsOverride.toastComponent,
      this.viewContainerRef,
      toastInjector
    );
    let inserted: ActiveToast = {
      toastId: this.index++,
      message,
    };
    let overlayRef = this.overlay.create(optionsOverride.positionClass);
    inserted.overlayRef = overlayRef;
    overlayRef.then((ref) => {
      let p = ref.attach(component, this.toastrConfig.newestOnTop);
      inserted.portal = p;
      p.then((portal) => {
        // TODO: explore injecting these values
        portal._hostElement.component.toastId = inserted.toastId;
        portal._hostElement.component.message = message;
        portal._hostElement.component.title = title;
        portal._hostElement.component.toastType = type;
        portal._hostElement.component.options = optionsOverride;
        if (!keepInactive) {
          setTimeout(() => portal._hostElement.component.activateToast());
        }
        return portal;
      });
    });
    this.toasts.push(inserted);
    return inserted;
  }
}

export const TOASTR_PROVIDERS: any = [
  OverlayContainer,
  Overlay,
  provide(ToastrService, {
    useFactory: (overlay: Overlay, injector: Injector) => {
      return new ToastrService(new ToastrConfig(), overlay, injector);
    },
    deps: [Overlay, Injector]
  })
];

@NgModule({
  imports: [],
  exports: [],
  declarations: [],
  entryComponents: [],
  providers: [ToastrConfig, ToastConfig, OverlayContainer, Overlay, ToastrService],
})
export class ToastrModule { }
