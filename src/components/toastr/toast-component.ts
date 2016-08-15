import {
  Component,
  trigger,
  state,
  transition,
  animate,
  style,
  OnDestroy,
} from '@angular/core';

import { ToastConfig } from './toastr-config';
import { ToastrService } from './toastr-service';

@Component({
  selector: '[toast]',
  template: `
  <div [@flyInOut]="state" class="{{options.toastClass}} {{toastType}}" (click)="tapToast()">
    <!-- button html -->
    <button *ngIf="options.closeButton" (click)="remove()" class="toast-close-button">
      &times;
    </button>
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
    <div *ngIf="options.progressBar">
      <div class="toast-progress" [style.width.%]="width">hello</div>
    </div>
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
  timeout: number;
  message: string;
  title: string;
  toastType: string;
  options: ToastConfig;
  // used to control animation
  state: string = 'inactive';
  // progressBar
  private hideTime: number;
  private intervalId: number;
  private width: number;

  constructor(private toastrService: ToastrService) {}
  ngOnDestroy() {
    clearInterval(this.intervalId);
  }
  activateToast() {
    this.state = 'active';
    if (+this.options.timeOut !== 0) {
      this.timeout = setTimeout(() => {
        this.remove();
      }, +this.options.timeOut);
      this.hideTime = new Date().getTime() + this.options.timeOut;
      this.intervalId = setInterval(() => this.updateProgress(), 10);
    }
  }
  updateProgress() {
    let now = new Date().getTime();
    let remaining = this.hideTime - now;
    this.width = (remaining / this.options.timeOut) * 100;
  }
  tapToast() {
    if (this.options.tapToDismiss) {
      this.remove();
    }
  }
  remove() {
    if (this.state === 'removed') {
      return;
    }
    this.state = 'removed';
    setTimeout(() => this.toastrService.remove(this.toastId), 300);
  }
}
