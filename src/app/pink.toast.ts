/* tslint:disable:no-access-missing-member */
import {
  Component,
  trigger,
  transition,
  animate,
  style,
  keyframes,
  ApplicationRef,
  state,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Toast, ToastPackage, ToastrService, ToastRef } from '../lib';

@Component({
  selector: '[pink-toast-component]',
  styles: [`
    :host {
      background-color: #FF69B4;
      position: relative;
      overflow: hidden;
      margin: 0 0 6px;
      padding: 10px 10px 10px 10px;
      width: 300px;
      border-radius: 3px 3px 3px 3px;
      color: #FFFFFF;
      pointer-events: all;
      cursor: pointer;
    }
    .btn-pink {
      -webkit-backface-visibility: hidden;
      -webkit-transform: translateZ(0);
    }
  `],
  template: `
  <div class="row">
    <div class="col-9">
      <div *ngIf="title" class="{{options.titleClass}}" [attr.aria-label]="title">
        {{title}}
      </div>
      <div *ngIf="message && options.enableHtml" class="{{options.messageClass}}" [innerHTML]="message"></div>
      <div *ngIf="message && !options.enableHtml" class="{{options.messageClass}}" [attr.aria-label]="message">
        {{message}}
      </div>
    </div>
    <div class="col-3 text-right">
      <a *ngIf="!options.closeButton" class="btn btn-pink btn-sm" (click)="action($event)">
        {{undoString}}
      </a>
      <a *ngIf="options.closeButton" (click)="remove()" class="btn btn-pink btn-sm">
        close
      </a>
    </div>
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
      transition('inactive => active', animate('400ms ease-out', keyframes([
        style({
          transform: 'translate3d(100%, 0, 0) skewX(-30deg)',
          opacity: 0,
        }),
        style({
          transform: 'skewX(20deg)',
          opacity: 1,
        }),
        style({
          transform: 'skewX(-5deg)',
          opacity: 1,
        }),
        style({
          transform: 'none',
          opacity: 1,
        }),
      ]))),
      transition('active => removed', animate('400ms ease-out', keyframes([
        style({
          opacity: 1,
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

  // constructor is only necessary when not using AoT
  constructor(
    protected toastrService: ToastrService,
    public toastPackage: ToastPackage,
    protected appRef: ApplicationRef,
  ) {
    super(toastrService, toastPackage, appRef);
  }

  action(event: Event) {
    event.stopPropagation();
    this.undoString = 'undid';
    this.toastPackage.triggerAction();
    return false;
  }
}
