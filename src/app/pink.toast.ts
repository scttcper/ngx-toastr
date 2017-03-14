import {
  Component,
  trigger,
  state,
  transition,
  animate,
  style,
  ApplicationRef,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Toast, ToastData, ToastrService, ToastRef } from 'ngx-toastr';

@Component({
  selector: '[pink-toast-component]',
  styles: [`
    :host {
      background-color: #fa39c3;
    }
  `],
  template: `
  <button *ngIf="options.closeButton" (click)="remove()" class="toast-close-button">
    &times;
  </button>
  <div *ngIf="title" class="{{options.titleClass}}" [attr.aria-label]="title">
    {{title}}
  </div>
  <div *ngIf="message && options.enableHtml" class="{{options.messageClass}}" [innerHTML]="message"></div>
  <div *ngIf="message && !options.enableHtml" class="{{options.messageClass}}" [attr.aria-label]="message">
    {{message}}
  </div>
  <a class="btn btn-pink btn-sm" (click)="action($event)">{{undoString}}</a>
  <div *ngIf="options.progressBar">
    <div class="toast-progress" [style.width.%]="width"></div>
  </div>
  `,
  animations: [
    trigger('flyInOut', [
      state('inactive', style({
        display: 'none',
        transform: 'translateX(200%)'
      })),
      state('active', style({
        transform: 'translateX(0%)'
      })),
      state('removed', style({
        transform: 'translateX(200%)'
      })),
      transition('inactive <=> active', animate('150ms linear')),
      transition('active <=> removed', animate('150ms linear')),
    ]),
  ],
})
export class PinkToast extends Toast {
  // used for demo purposes
  undoString = 'undo';

  // constructor is only necessary when not using AoT
  constructor(
    protected toastrService: ToastrService,
    public data: ToastData,
    protected toastRef: ToastRef<any>,
    protected appRef: ApplicationRef,
    protected sanitizer: DomSanitizer
  ) {
    super(toastrService, data, toastRef, appRef, sanitizer);
  }

  action(event: Event) {
    event.stopPropagation();
    this.undoString = 'undid';
    this.onAction.next(this.undoString);
    this.onAction.complete();
    return false;
  }
}
