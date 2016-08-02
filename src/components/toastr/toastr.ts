import {
  Component,
  Output,
  Injectable,
  ViewContainerRef,
  Inject,
  ReflectiveInjector,
  Optional,
  Provider,
} from '@angular/core';
import { Overlay, OVERLAY_PROVIDERS } from './overlay/overlay';
import { ComponentPortal } from './portal/portal';

@Injectable()
export class ToastrConfig {
  allowHtml: boolean = false;
  autoDismiss: boolean = false;
  closeButton: boolean = false;
  closeHtml: string = '<button>&times;</button>';
  containerId: string = 'toast-container';
  extendedTimeOut: number = 1000;
  iconClasses = {
    error: 'toast-error',
    info: 'toast-info',
    success: 'toast-success',
    warning: 'toast-warning',
  };
  maxOpened: number = 0;
  messageClass: string = 'toast-message';
  newestOnTop: boolean = true;
  // onHidden: null;
  // onShown: null;
  // onTap: null;
  positionClass: string = 'toast-top-right';
  preventDuplicates: boolean = false;
  preventOpenDuplicates: boolean = false;
  progressBar: boolean = false;
  tapToDismiss: boolean = true;
  target: string = 'body';
  // templates = {
  //   toast: 'directives/toast/toast.html',
  //   progressbar: 'directives/progressbar/progressbar.html',
  // };
  timeOut: number = 5000;
  titleClass: string = 'toast-title';
  toastClass: string = 'toast';
}

@Injectable()
export class OptionsOverride extends ToastrConfig {}

const toasts: any[] = [];

@Injectable()
export class ToastrService {
  // TODO: remove when we can access the global view ref from service
  public viewContainerRef: ViewContainerRef;
  public index: number = 0;
  // public toasts: any[] = [];



  constructor(
    private overlay: Overlay,
    @Optional() public toastrConfig: ToastrConfig
  ) {
    if (!this.toastrConfig) {
      this.toastrConfig = new ToastrConfig();
    }
  }

  public success(message: string, title?: string, optionsOverride?: OptionsOverride) {
    const type = this.toastrConfig.iconClasses.success;
    this._buildNotification(type, message, title, optionsOverride);
  }
  public error(message: string, title?: string, optionsOverride?: OptionsOverride) {
    const type = this.toastrConfig.iconClasses.error;
    this._buildNotification(type, message, title, optionsOverride);
  }
  public info(message: string, title?: string, optionsOverride?: OptionsOverride) {
    const type = this.toastrConfig.iconClasses.info;
    this._buildNotification(type, message, title, optionsOverride);
  }
  public warning(message: string, title?: string, optionsOverride?: OptionsOverride) {
    const type = this.toastrConfig.iconClasses.warning;
    this._buildNotification(type, message, title, optionsOverride);
  }
  public remove(toastId: number) {
    let ref = this.findToast(toastId);
    ref.OverlayRef.detach();
  }
  private findToast(toastId: number) {
    for (var i = 0; i < toasts.length; i++) {
      if (toasts[i].toastId === toastId) {
        return toasts[i];
      }
    }
  }

  private _buildNotification(
    type: string,
    message: string,
    title?: string,
    optionsOverride: ToastrConfig = this.toastrConfig
  ) {
    let component = new ComponentPortal(Toast, this.viewContainerRef);

    let inserted: any = {}
    this.overlay.create(this.toastrConfig.positionClass)
      .then((ref) => {
        let res = ref.attach(component);
        // TODO: possible use this ref to detach() later
        inserted.OverlayRef = ref;
        return res;
      })
      .then((attached) => {
        this.index = this.index + 1;
        attached._hostElement.component.toastId = this.index;
        attached._hostElement.component.message = message;
        attached._hostElement.component.title = title;
        attached._hostElement.component.toastType = type;
        attached._hostElement.component.options = optionsOverride;
        inserted.attached = attached;
        inserted.toastId = this.index;
        toasts.push(inserted);
      });
  }
}

export const TOASTR_PROVIDERS = [
  ...OVERLAY_PROVIDERS, ToastrService
];

@Component({
  selector: '[toast]',
  providers: [TOASTR_PROVIDERS],
  template: `
  <div class="{{options.toastClass}} {{toastType}}" (click)="tapToast()">
    <div *ngIf="title" class="{{options.titleClass}}" [attr.aria-label]="title">{{title}}</div>
    <div *ngIf="message" class="{{options.messageClass}}" [attr.aria-label]="message">{{message}}</div>
    <!-- TODO: allow html -->
    <!--
    <div ng-switch on="allowHtml">
      <div ng-switch-when="true" ng-if="title" class="{{titleClass}}" ng-bind-html="title"></div>
      <div ng-switch-when="true" class="{{messageClass}}" ng-bind-html="message"></div>
    </div>
    -->
    <progress-bar *ngIf="progressBar"></progress-bar>
  </div>
  `,
})
export class Toast {
  toastId: number;
  message: string;
  title: string;
  toastType: string;
  options: ToastrConfig;

  constructor(
    private toastrService: ToastrService
  ) {}

  tapToast() {
    console.log(this.toastId)
    console.log('clicked');
    this.toastrService.remove(this.toastId);
  }
}
