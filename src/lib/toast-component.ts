import {
  Component,
  trigger,
  state,
  transition,
  animate,
  style,
  OnDestroy,
  HostBinding,
  HostListener,
  ApplicationRef,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';

import { ToastConfig, ToastData } from './toastr-config';
import { ToastrService } from './toastr-service';
import { ToastRef } from './toast-injector';

@Component({
  selector: '[toast-component]',
  template: `
  <button *ngIf="options.closeButton" (click)="remove()" class="toast-close-button">
    &times;
  </button>
  <div *ngIf="title" class="{{options.titleClass}}" [attr.aria-label]="title">
    {{title}}
  </div>
  <div *ngIf="message && options.enableHtml" class="{{options.messageClass}}" [innerHTML]="message">
  </div>
  <div *ngIf="message && !options.enableHtml" class="{{options.messageClass}}" [attr.aria-label]="message">
    {{message}}
  </div>
  <div *ngIf="options.progressBar">
    <div class="toast-progress" [style.width.%]="width"></div>
  </div>
  `,
  animations: [
    trigger('flyInOut', [
      state('inactive', style({
        display: 'none',
        opacity: 0
      })),
      state('active', style({ opacity: 1 })),
      state('removed', style({ opacity: 0 })),
      transition('inactive => active', animate('300ms ease-in')),
      transition('active => removed', animate('300ms ease-in')),
    ]),
  ],
})
export class Toast implements OnDestroy {
  toastId: number;
  message: string | SafeHtml;
  title: string;
  options: ToastConfig;
  /** width of progress bar */
  width = -1;
  /** a combination of toast type and options.toastClass */
  @HostBinding('class') toastClasses = '';
  /** controls animation */
  @HostBinding('@flyInOut') state = 'inactive';
  private timeout: any;
  private intervalId: any;
  private hideTime: number;
  private sub: Subscription;
  private sub1: Subscription;
  /** listens for click on toast */
  onTap: Subject<any>;
  /** listens for click on custom action */
  onAction: Subject<any>;

  constructor(
    protected toastrService: ToastrService,
    public data: ToastData,
    protected toastRef: ToastRef<any>,
    protected appRef: ApplicationRef,
    protected sanitizer: DomSanitizer
  ) {
    this.options = data.optionsOverride;
    this.toastId = data.toastId;
    this.message = data.message;
    if (this.message && this.options.enableHtml) {
      this.message = sanitizer.bypassSecurityTrustHtml(data.message);
    }
    this.title = data.title;
    this.onTap = data.onTap;
    this.onAction = data.onAction;
    this.toastClasses = `${data.toastType} ${this.options.toastClass}`;
    this.options.timeOut = +this.options.timeOut;
    this.sub = toastRef.afterActivate().subscribe(() => {
      this.activateToast();
    });
    this.sub1 = toastRef.manualClosed().subscribe(() => {
      this.remove();
    });
  }
  ngOnDestroy() {
    this.sub.unsubscribe();
    this.sub1.unsubscribe();
    clearInterval(this.intervalId);
    clearTimeout(this.timeout);
  }
  /**
   * activates toast and sets timeout
   */
  activateToast() {
    this.state = 'active';
    if (this.options.timeOut !== 0) {
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
    if (this.width === 0) {
      return;
    }
    const now = new Date().getTime();
    const remaining = this.hideTime - now;
    this.width = (remaining / this.options.timeOut) * 100;
    if (this.width <= 0) {
      this.width = 0;
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
    this.timeout = setTimeout(() => this.toastrService.remove(this.toastId), 300);
  }
  @HostListener('click')
  tapToast() {
    if (this.state === 'removed') {
      return;
    }
    this.onTap.next();
    this.onTap.complete();
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
    if (+this.options.extendedTimeOut === 0 || this.state === 'removed') {
      return;
    }
    this.timeout = setTimeout(() => this.remove(), this.options.extendedTimeOut);
    this.options.timeOut = +this.options.extendedTimeOut;
    this.hideTime = new Date().getTime() + this.options.timeOut;
    this.width = 100;
    if (this.options.progressBar) {
      this.intervalId = setInterval(() => this.updateProgress(), 10);
    }
  }
}
