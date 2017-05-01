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
import { Toast, ToastData, ToastrService, ToastRef } from '../lib';

@Component({
  selector: '[notyf-toast-component]',
  styles: [],
  template: `
  <div class="notyf-wrapper">
    <div class="notyf-icon">
      <i class="notyf-confirm-icon"></i>
    </div>
    <div class="notyf-message">Hey there!</div>
  </div>
  `,
  animations: [
    trigger('flyInOut', [
      state('inactive', style({
        display: 'none',
        opacity: 0
      })),
      transition('inactive => active', animate('300ms ease-out', keyframes([
        style({
          opacity: 0,
          bottom: '-15px',
          'max-height': 0,
          'max-width': 0,
          'margin-top': 0,
        }),
        style({
          opacity: 0.8,
          bottom: '-3px',
        }),
        style({
          opacity: 1,
          bottom: '0',
          'max-height': '200px',
          'margin-top': '12px',
          'max-width': '400px',
        }),
      ]))),
      state('active', style({
        bottom: '0',
        'max-height': '200px',
        'margin-top': '12px',
        'max-width': '400px',
      })),
      transition('active => removed', animate('300ms ease-out', keyframes([
        style({
          opacity: 0.6,
          bottom: 0,
        }),
        style({
          opacity: 0.1,
          bottom: '-3px',
        }),
        style({
          opacity: 0,
          bottom: '-15px',
        }),
      ]))),
    ]),
  ],
})
export class NotyfToast extends Toast {

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
}
