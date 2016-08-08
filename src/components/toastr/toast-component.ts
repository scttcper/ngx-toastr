import {
  Component,
  trigger,
  state,
  transition,
  animate,
  style,
} from '@angular/core';

import { ToastProgress } from './progress-component';
import { ToastConfig } from './toastr-config';
import { ToastrService } from './toastr-service';

@Component({
  selector: '[toast]',
  directives: [ToastProgress],
  providers: [],
  template: `
  <div @flyInOut="state" class="{{options.toastClass}} {{toastType}}" (click)="tapToast()">
    <button *ngIf="options.closeButton" class="toast-close-button" (click)="remove()">×</button>
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
      <toast-progress [ttl]="options.timeOut"></toast-progress>
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
export class Toast {
  toastId: number;
  timeout: number;
  message: string;
  title: string;
  toastType: string;
  options: ToastConfig;
  // used to control animation
  state: string = 'inactive';

  constructor(
    private toastrService: ToastrService
  ) {}
  activateToast() {
    this.state = 'active';
    if (+this.options.timeOut !== 0) {
      this.timeout = setTimeout(() => {
        this.remove();
      }, +this.options.timeOut);
    }
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
