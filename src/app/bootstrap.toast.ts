import { Component } from '@angular/core';

import { Toast, ToastrService, ToastPackage } from '../lib/public_api';

@Component({
  selector: '[bootstrap-toast-component]',
  template: `
    <div class="toast" role="alert" [style.display]="state.value === 'inactive' ? 'none' : ''">
      <div class="toast-header">
        <strong class="me-auto">{{ title || 'default header' }}</strong>
        <button
          type="button"
          class="btn-close"
          aria-label="Close"
          *ngIf="options.closeButton"
          (click)="remove()"
        ></button>
      </div>
      <div class="toast-body">
        <div
          role="alert"
          aria-live="polite"
          [attr.aria-label]="message"
        >
          {{ message || 'default message' }}
        </div>
        <div class="mt-2 pt-2 border-top">
          <button type="button" class="btn btn-secondary btn-sm" (click)="handleClick($event)">
            {{ undoString }}
          </button>
        </div>
      </div>
    </div>
  `,
  preserveWhitespaces: false,
})
export class BootstrapToast extends Toast {
  // used for demo purposes
  undoString = 'undo';

  // constructor is only necessary when not using AoT
  constructor(protected toastrService: ToastrService, public toastPackage: ToastPackage) {
    super(toastrService, toastPackage);
  }

  // Demo click handler
  handleClick(event: Event) {
    event.stopPropagation();
    this.undoString = 'undid';
    this.toastPackage.triggerAction();
    return false;
  }
}
