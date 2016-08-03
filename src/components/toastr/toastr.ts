import {
  Component,
  Injectable,
  ViewContainerRef,
  ReflectiveInjector,
  provide,
  OnInit,
  Injector,
  Provider,
  trigger,
  state,
  transition,
  animate,
  style,
} from '@angular/core';
import { Overlay } from './overlay/overlay';
import { OverlayRef } from './overlay/overlay-ref';
import { ComponentPortal, PortalHost } from './portal/portal';
import { OverlayContainer } from './overlay/overlay-container';

@Injectable()
export class ToastrConfig {
  allowHtml: boolean = false;
  autoDismiss: boolean = false;
  closeButton: boolean = false;
  closeHtml: string = '<button>&times;</button>';
  containerId: string = 'toast-container';
  extendedTimeOut: number = 1000;
  iconClasses: any = {
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
  toastComponent = Toast;
}

export interface ActiveToast {
  toastId?: number;
  portal?: PortalHost;
  overlayRef?: OverlayRef;
}

@Injectable()
export class ToastrService {
  // TODO: remove when we can access the global view ref from service
  public viewContainerRef: ViewContainerRef;
  public index: number = 0;
  public toasts: any[] = [];
  public container: OverlayRef;

  constructor(
    public toastrConfig: ToastrConfig,
    private overlay: Overlay,
    private injector: Injector
  ) {}

  public success(message: string, title?: string, optionsOverride?: ToastrConfig): Promise<any> {
    const type = this.toastrConfig.iconClasses.success;
    return this._buildNotification(type, message, title, optionsOverride);
  }
  public error(message: string, title?: string, optionsOverride?: ToastrConfig): Promise<any> {
    const type = this.toastrConfig.iconClasses.error;
    return this._buildNotification(type, message, title, optionsOverride);
  }
  public info(message: string, title?: string, optionsOverride?: ToastrConfig): Promise<any> {
    const type = this.toastrConfig.iconClasses.info;
    return this._buildNotification(type, message, title, optionsOverride);
  }
  public warning(message: string, title?: string, optionsOverride?: ToastrConfig): Promise<any> {
    const type = this.toastrConfig.iconClasses.warning;
    return this._buildNotification(type, message, title, optionsOverride);
  }
  public remove(toastId: number): boolean {
    let { index, activeToast } = this._findToast(toastId);
    if (!activeToast) {
      return false;
    }
    activeToast.overlayRef.detach();
    this.toasts.splice(index, 1);
    if (!this.toasts.length) {
      this.overlay.dispose();
      activeToast.overlayRef.dispose();
    }
    return true;
  }
  public clear() {
    // Call every toast's remove function
    for (let i = 0; i < this.toasts.length; i++) {
      this.toasts[i].portal._hostElement.component.remove();
    }
  }
  private _findToast(toastId: number): {index: number, activeToast: ActiveToast} {
    for (let i = 0; i < this.toasts.length; i++) {
      if (this.toasts[i].toastId === toastId) {
        return {index: i, activeToast: this.toasts[i]};
      }
    }
    return {index: null, activeToast: null};
  }

  private _buildNotification(
    type: string,
    message: string,
    title?: string,
    optionsOverride: ToastrConfig = this.toastrConfig
  ): Promise<ActiveToast> {
    // pass current view to toast
    // this keeps the ToastrService as a singleton
    let resolvedProviders = ReflectiveInjector.resolve([
      new Provider('view', { useValue: this.viewContainerRef }),
      new Provider('ToastrService', {useValue: this}),
    ]);
    let child = ReflectiveInjector.fromResolvedProviders(resolvedProviders, this.injector);
    let component = new ComponentPortal(
      optionsOverride.toastComponent,
      this.viewContainerRef,
      child
    );
    let inserted: ActiveToast = { toastId: this.index++ };
    return this.overlay.create(optionsOverride.positionClass)
      .then((ref) => {
        let res = ref.attach(component);
        // TODO: possible use this ref to detach() later
        inserted.overlayRef = ref;
        return res;
      })
      .then((portal) => {
        // TODO: explore injecting these values
        portal._hostElement.component.toastId = inserted.toastId;
        portal._hostElement.component.message = message;
        portal._hostElement.component.title = title;
        portal._hostElement.component.toastType = type;
        portal._hostElement.component.options = optionsOverride;
        inserted.portal = portal;
        this.toasts.push(inserted);
        return inserted;
      });
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

@Component({
  selector: '[toast]',
  providers: [],
  template: `
  <div @flyInOut="state" class="{{options.toastClass}} {{toastType}}" (click)="tapToast()">
    <div *ngIf="title" class="{{options.titleClass}}" [attr.aria-label]="title">{{title}}</div>
    <div *ngIf="message" class="{{options.messageClass}}" [attr.aria-label]="message">
      {{message}}
    </div>
    <!--TODO: allow html
    <div ng-switch on="allowHtml">
      <div ng-switch-when="true" ng-if="title" class="{{titleClass}}" ng-bind-html="title"></div>
      <div ng-switch-when="true" class="{{messageClass}}" ng-bind-html="message"></div>
    </div>
    -->
    <!-- TODO: progressbar
    <progress-bar *ngIf="progressBar"></progress-bar>
    -->
  </div>
  `,
  animations: [
    trigger('flyInOut', [
      state('inactive', style({
        opacity: 0
      })),
      state('active', style({
        opacity: 1
      })),
      transition('inactive <=> active', animate('300ms ease-in')),
    ]),
  ],
})
export class Toast implements OnInit {
  toastId: number;
  timeout: number;
  message: string;
  title: string;
  toastType: string;
  options: ToastrConfig;
  // used to control animation
  state: string = 'inactive';

  constructor(
    private toastrService: ToastrService
  ) {}

  ngOnInit() {
    this.timeout = setTimeout(() => {
      this.remove();
    }, this.options.timeOut);
    setTimeout(() => this.state = 'active');
  }

  tapToast() {
    this.remove();
  }

  remove() {
    if (this.state === 'inactive') {
      return;
    }
    this.state = 'inactive';
    setTimeout(() => this.toastrService.remove(this.toastId), 300);
  }
}
