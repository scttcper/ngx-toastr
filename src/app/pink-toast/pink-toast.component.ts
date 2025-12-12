import { Component } from '@angular/core';

import { Toast } from 'ngx-toastr';

@Component({
  selector: '[pink-toast-component]',
  templateUrl: './pink-toast.component.html',
  styleUrl: './pink-toast.component.scss',
  host: {
    'animate.enter': 'animate-pink-in',
    'animate.leave': 'animate-pink-out',
  },
})
export class PinkToast extends Toast {
  // used for demo purposes
  undoString = 'undo';

  action(event: Event) {
    event.stopPropagation();
    this.undoString = 'undid';
    this.toastPackage.triggerAction();
    return false;
  }
}
