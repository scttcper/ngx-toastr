/* tslint:disable:no-access-missing-member */
import { Component, ApplicationRef } from '@angular/core';
import {
  trigger,
  state,
  transition,
  animate,
  style,
  keyframes
} from '@angular/animations';
import { Toast, ToastPackage, ToastrService, ToastRef } from '../lib/public_api';

@Component({
  selector: '[notyf-toast-component]',
  styles: [],
  template: `
  <div class="notyf-wrapper">
    <div class="notyf-icon">
      <i class="notyf-confirm-icon"></i>
    </div>
    <div class="notyf-message">{{message}}</div>
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
    public toastPackage: ToastPackage,
    protected appRef: ApplicationRef,
  ) {
    super(toastrService, toastPackage, appRef);
  }
}
