import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import {
  Component,
  HostBinding,
  HostListener,
  OnDestroy,
} from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';

import { Subscription } from 'rxjs/Subscription';

import { IndividualConfig, ToastPackage } from './toastr-config';
import { ToastrService } from './toastr.service';

@Component({
  selector: '[toast-component]',
  template: `
  <button *ngIf="options.closeButton" (click)="remove()" class="toast-close-button">
    &times;
  </button>
  <div *ngIf="title" [class]="options.titleClass" [attr.aria-label]="title">
    {{ title }}
  </div>
  <div *ngIf="message && options.enableHtml" role="alert" aria-live="polite"
    [class]="options.messageClass" [innerHTML]="message">
  </div>
  <div *ngIf="message && !options.enableHtml" role="alert" aria-live="polite"
    [class]="options.messageClass" [attr.aria-label]="message">
    {{ message }}
  </div>
  <div *ngIf="options.progressBar">
    <div class="toast-progress" [style.width]="width + '%'"></div>
  </div>
  `,
  animations: [
    trigger('flyInOut', [
      state('inactive', style({
        display: 'none',
        opacity: 0,
      })),
      state('active', style({ opacity: 1 })),
      state('removed', style({ opacity: 0 })),
      transition('inactive => active',
        animate('{{ easeTime }}ms {{ easing }}')
      ),
      transition('active => removed',
        animate('{{ easeTime }}ms {{ easing }}'),
      ),
    ]),
  ],
  preserveWhitespaces: false,
})
export class Toast implements OnDestroy {
  message?: string | SafeHtml | null;
  title?: string;
  options: IndividualConfig;
  /** width of progress bar */
  width = -1;
  /** a combination of toast type and options.toastClass */
  @HostBinding('class') toastClasses = '';
  /** controls animation */
  @HostBinding('@flyInOut') state = {
    value: 'inactive',
    params: {
      easeTime: this.toastPackage.config.easeTime,
      easing: 'ease-in',
    },
  };
  private timeout: any;
  private intervalId: any;
  private hideTime: number;
  private sub: Subscription;
  private sub1: Subscription;

  constructor(
    protected toastrService: ToastrService,
    public toastPackage: ToastPackage,
  ) {
    this.message = toastPackage.message;
    this.title = toastPackage.title;
    this.options = toastPackage.config;
    this.toastClasses = `${toastPackage.toastType} ${toastPackage.config.toastClass}`;
    this.sub = toastPackage.toastRef.afterActivate().subscribe(() => {
      this.activateToast();
    });
    this.sub1 = toastPackage.toastRef.manualClosed().subscribe(() => {
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
    this.state = { ...this.state, value: 'active' };
    if (!this.options.disableTimeOut && this.options.timeOut) {
      this.timeout = setTimeout(() => {
        this.remove();
      }, this.options.timeOut);
      this.hideTime = new Date().getTime() + this.options.timeOut;
      if (this.options.progressBar) {
        this.intervalId = setInterval(() => this.updateProgress(), 10);
      }
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

  /**
   * tells toastrService to remove this toast after animation time
   */
  remove() {
    if (this.state.value === 'removed') {
      return;
    }
    clearTimeout(this.timeout);
    this.state = {...this.state, value: 'removed'};
    this.timeout = setTimeout(() =>
      this.toastrService.remove(this.toastPackage.toastId),
      this.toastPackage.config.easeTime,
    );
  }
  @HostListener('click')
  tapToast() {
    if (this.state.value === 'removed') {
      return;
    }
    this.toastPackage.triggerTap();
    if (this.options.tapToDismiss) {
      this.remove();
    }
  }
  @HostListener('mouseenter')
  stickAround() {
    if (this.state.value === 'removed') {
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
    if (this.options.disableTimeOut
      || this.options.extendedTimeOut === 0
      || this.state.value === 'removed') {
      return;
    }
    this.timeout = setTimeout(() => this.remove(), this.options.extendedTimeOut);
    this.options.timeOut = this.options.extendedTimeOut;
    this.hideTime = new Date().getTime() + (this.options.timeOut || 0);
    this.width = -1;
    if (this.options.progressBar) {
      this.intervalId = setInterval(() => this.updateProgress(), 10);
    }
  }
}
