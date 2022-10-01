import { CommonModule } from '@angular/common';
import { ModuleWithProviders } from '@angular/core';
import {
  ApplicationRef,
  Component,
  HostBinding,
  HostListener,
  NgModule,
  OnDestroy,
} from '@angular/core';

import { Subscription } from 'rxjs';

import {
  DefaultNoComponentGlobalConfig,
  GlobalConfig,
  IndividualConfig,
  ToastPackage,
  TOAST_CONFIG,
} from './toastr-config';
import { ToastrService } from './toastr.service';

@Component({
  selector: '[toast-component]',
  template: `
  <button *ngIf="options.closeButton" (click)="remove()" type="button" class="toast-close-button" aria-label="Close">
    <span aria-hidden="true">&times;</span>
  </button>
  <div *ngIf="title" [class]="options.titleClass" [attr.aria-label]="title">
    {{ title }} <ng-container *ngIf="duplicatesCount">[{{ duplicatesCount + 1 }}]</ng-container>
  </div>
  <div *ngIf="message && options.enableHtml" role="alert"
    [class]="options.messageClass" [innerHTML]="message">
  </div>
  <div *ngIf="message && !options.enableHtml" role="alert"
    [class]="options.messageClass" [attr.aria-label]="message">
    {{ message }}
  </div>
  <div *ngIf="options.progressBar">
    <div class="toast-progress" [style.width]="width + '%'"></div>
  </div>
  `,
})
export class ToastNoAnimation implements OnDestroy {
  message?: string | null;
  title?: string;
  options: IndividualConfig;
  duplicatesCount!: number;
  originalTimeout: number;
  /** width of progress bar */
  width = -1;
  /** a combination of toast type and options.toastClass */
  @HostBinding('class') toastClasses = '';

  /** hides component when waiting to be displayed */
  @HostBinding('style.display')
  get displayStyle() {
    if (this.state === 'inactive') {
      return 'none';
    }
  }

  /** controls animation */
  state = 'inactive';
  private timeout: any;
  private intervalId: any;
  private hideTime!: number;
  private sub: Subscription;
  private sub1: Subscription;
  private sub2: Subscription;
  private sub3: Subscription;

  constructor(
    protected toastrService: ToastrService,
    public toastPackage: ToastPackage,
    protected appRef: ApplicationRef,
  ) {
    this.message = toastPackage.message;
    this.title = toastPackage.title;
    this.options = toastPackage.config;
    this.originalTimeout = toastPackage.config.timeOut;
    this.toastClasses = `${toastPackage.toastType} ${
      toastPackage.config.toastClass
    }`;
    this.sub = toastPackage.toastRef.afterActivate().subscribe(() => {
      this.activateToast();
    });
    this.sub1 = toastPackage.toastRef.manualClosed().subscribe(() => {
      this.remove();
    });
    this.sub2 = toastPackage.toastRef.timeoutReset().subscribe(() => {
      this.resetTimeout();
    });
    this.sub3 = toastPackage.toastRef.countDuplicate().subscribe(count => {
      this.duplicatesCount = count;
    });
  }
  ngOnDestroy() {
    this.sub.unsubscribe();
    this.sub1.unsubscribe();
    this.sub2.unsubscribe();
    this.sub3.unsubscribe();
    clearInterval(this.intervalId);
    clearTimeout(this.timeout);
  }
  /**
   * activates toast and sets timeout
   */
  activateToast() {
    this.state = 'active';
    if (!(this.options.disableTimeOut === true || this.options.disableTimeOut === 'timeOut') && this.options.timeOut) {
      this.timeout = setTimeout(() => {
        this.remove();
      }, this.options.timeOut);
      this.hideTime = new Date().getTime() + this.options.timeOut;
      if (this.options.progressBar) {
        this.intervalId = setInterval(() => this.updateProgress(), 10);
      }
    }
    if (this.options.onActivateTick) {
      this.appRef.tick();
    }
  }
  /**
   * updates progress bar width
   */
  updateProgress() {
    if (this.width === 0 || this.width === 100 || !this.options.timeOut) {
      return;
    }
    const now = new Date().getTime();
    const remaining = this.hideTime - now;
    this.width = (remaining / this.options.timeOut) * 100;
    if (this.options.progressAnimation === 'increasing') {
      this.width = 100 - this.width;
    }
    if (this.width <= 0) {
      this.width = 0;
    }
    if (this.width >= 100) {
      this.width = 100;
    }
  }

  resetTimeout() {
    clearTimeout(this.timeout);
    clearInterval(this.intervalId);
    this.state = 'active';

    this.options.timeOut = this.originalTimeout;
    this.timeout = setTimeout(() => this.remove(), this.originalTimeout);
    this.hideTime = new Date().getTime() + (this.originalTimeout || 0);
    this.width = -1;
    if (this.options.progressBar) {
      this.intervalId = setInterval(() => this.updateProgress(), 10);
    }
  }

  /**
   * tells toastrService to remove this toast after animation time
   */
  remove() {
    if (this.state === 'removed') {
      return;
    }
    clearTimeout(this.timeout);
    this.state = 'removed';
    this.timeout = setTimeout(() =>
      this.toastrService.remove(this.toastPackage.toastId),
    );
  }
  @HostListener('click')
  tapToast() {
    if (this.state === 'removed') {
      return;
    }
    this.toastPackage.triggerTap();
    if (this.options.tapToDismiss) {
      this.remove();
    }
  }
  @HostListener('mouseenter')
  stickAround() {
    if (this.state === 'removed') {
      return;
    }
    clearTimeout(this.timeout);
    this.options.timeOut = 0;
    this.hideTime = 0;

    // disable progressBar
    clearInterval(this.intervalId);
    this.width = 0;
  }
  @HostListener('mouseleave')
  delayedHideToast() {
    if (
      (this.options.disableTimeOut === true || this.options.disableTimeOut === 'extendedTimeOut') ||
      this.options.extendedTimeOut === 0 ||
      this.state === 'removed'
    ) {
      return;
    }
    this.timeout = setTimeout(
      () => this.remove(),
      this.options.extendedTimeOut,
    );
    this.options.timeOut = this.options.extendedTimeOut;
    this.hideTime = new Date().getTime() + (this.options.timeOut || 0);
    this.width = -1;
    if (this.options.progressBar) {
      this.intervalId = setInterval(() => this.updateProgress(), 10);
    }
  }
}

export const DefaultNoAnimationsGlobalConfig: GlobalConfig = {
  ...DefaultNoComponentGlobalConfig,
  toastComponent: ToastNoAnimation,
};

@NgModule({
  imports: [CommonModule],
  declarations: [ToastNoAnimation],
  exports: [ToastNoAnimation],
})
export class ToastNoAnimationModule {
  static forRoot(config: Partial<GlobalConfig> = {}): ModuleWithProviders<ToastNoAnimationModule> {
    return {
      ngModule: ToastNoAnimationModule,
      providers: [
        {
          provide: TOAST_CONFIG,
          useValue: {
            default: DefaultNoAnimationsGlobalConfig,
            config,
          },
        },
      ],
    };
  }
}
