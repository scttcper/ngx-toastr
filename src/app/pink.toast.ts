import {
  Component,
  trigger,
  transition,
  animate,
  style,
  keyframes,
} from '@angular/core';

import { Toast } from 'ngx-toastr';

/* tslint:disable */
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
      transition('inactive <=> active', animate('400ms ease-out', keyframes([
        style({
          transform: 'translate3d(100%, 0, 0) skewX(-30deg)',
          opacity: 0,
        }),
        style({
          transform: 'skewX(20deg)',
          opacity: 0.8,
        }),
        style({
          transform: 'skewX(-5deg)',
          opacity: 0.8,
        }),
        style({
          transform: 'none',
          opacity: 0.8,
        }),
      ]))),
      transition('active <=> removed', animate('400ms ease-out', keyframes([
        style({
          opacity: 0.8,
        }),
        style({
          transform: 'translate3d(100%, 0, 0) skewX(30deg)',
          opacity: 0,
        }),
      ]))),
    ]),
  ],
})
export class PinkToast extends Toast {
  // used for demo purposes
  undoString = 'undo';
  action(event: Event) {
    event.stopPropagation();
    this.undoString = 'undid';
    this.onAction.next(this.undoString);
    this.onAction.complete();
    return false;
  }
}
/* tslint:enable */
