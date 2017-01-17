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
      state('active', style({
        opacity: 1
      })),
      state('removed', style({
        opacity: 0
      })),
      transition('inactive <=> active', animate('300ms ease-in')),
      transition('active <=> removed', animate('300ms ease-in')),
    ]),
  ],
})
export class Toast implements OnDestroy {
  toastId: number;
  message: string | SafeHtml;
  title: string;
  toastType: string;
  options: ToastConfig;
  // used to control animation
  timeout: any;
  removalTimeout: any;
  // used to control width of progress bar
  width: number = 100;
  private intervalId: any;
  private hideTime: number;
  @HostBinding('class')
  toastClasses: string = '';
  @HostBinding('@flyInOut')
  state: string = 'inactive';
  private onTap: Subject<any>;
  private sub: Subscription;

  constructor(
    private toastrService: ToastrService,
    public data: ToastData,
    private toastRef: ToastRef<any>,
    private appRef: ApplicationRef,
    sanitizer: DomSanitizer
  ) {
    this.options = data.optionsOverride;
    this.toastId = data.toastId;
    this.message = data.message;
    if (this.message && this.options.enableHtml) {
      this.message = sanitizer.bypassSecurityTrustHtml(data.message);
    }
    this.title = data.title;
    this.toastType = data.toastType;
    this.onTap = data.onTap;
    this.sub = toastRef.afterActivate().subscribe((n) => {
      this.activateToast();
    });
  }
  ngOnDestroy() {
    this.sub.unsubscribe();
    clearInterval(this.intervalId);
    clearTimeout(this.timeout);
    clearTimeout(this.removalTimeout);
  }
  activateToast() {
    this.state = 'active';
    this.options.timeOut = +this.options.timeOut;
    this.toastClasses = `${this.toastType} ${this.options.toastClass}`;
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
  @HostListener('click')
  tapToast() {
    this.onTap.next();
    this.onTap.complete();
    if (this.options.tapToDismiss) {
      this.remove();
    }
  }
  remove() {
    if (this.state === 'removed') {
      return;
    }
    this.state = 'removed';
    this.removalTimeout = setTimeout(() => this.toastrService.remove(this.toastId), 300);
  }
  @HostListener('mouseleave')
  delayedHideToast() {
    if (+this.options.extendedTimeOut === 0) {
      return;
    }
    this.width = 100;
    this.timeout = setTimeout(() => this.remove(), this.options.extendedTimeOut);
    this.options.timeOut = +this.options.extendedTimeOut;
    this.hideTime = new Date().getTime() + this.options.timeOut;
  }
  @HostListener('mouseenter')
  stickAround() {
    clearTimeout(this.timeout);
    this.options.timeOut = 0;
    this.hideTime = 0;

    // disable progressBar
    clearInterval(this.intervalId);
    this.options.progressBar = false;
  }
}
