import {
  animate,
  keyframes,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component } from '@angular/core';
import { Toast, ToastrService, ToastPackage } from '../lib/public_api';

@Component({
  selector: 'notyf-toast-component',
  styles: [],
  template: `
    <div class="notyf__toast notyf__toast--success notyf__toast">
      <div class="notyf__wrapper">
        <div class="notyf__icon">
          <i class="notyf__icon--success" style="color: rgb(61, 199, 99);"></i>
        </div>
        <div class="notyf__message">{{ title }} {{ message }}</div>
      </div>
      <div
        class="notyf__ripple"
        style="background-color: rgb(61, 199, 99);"
      ></div>
    </div>
  `,
  animations: [
    trigger('flyInOut', [
      state('inactive', style({ opacity: 0 })),
      transition(
        'inactive => active',
        animate(
          '300ms ease-out',
          keyframes([
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
          ]),
        ),
      ),
      state(
        'active',
        style({
          bottom: '0',
          'max-height': '200px',
          'margin-top': '12px',
          'max-width': '400px',
        }),
      ),
      transition(
        'active => removed',
        animate(
          '300ms ease-out',
          keyframes([
            style({
              opacity: 1,
              transform: 'translateY(0)'
            }),
            style({
              opacity: 0,
              transform: 'translateY(25%)'
            }),
          ]),
        ),
      ),
    ]),
  ],
})
export class NotyfToast extends Toast {
  // constructor is only necessary when not using AoT
  constructor(
    protected toastrService: ToastrService,
    public toastPackage: ToastPackage,
  ) {
    super(toastrService, toastPackage);
  }
}
