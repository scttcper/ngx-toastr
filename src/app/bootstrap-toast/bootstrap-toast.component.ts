import { Component } from '@angular/core';
import { Toast } from 'ngx-toastr';

@Component({
  selector: '[bootstrap-toast-component]',
  templateUrl: './bootstrap-toast.component.html',
})
export class BootstrapToast extends Toast {
  // used for demo purposes
  undoString = 'undo';

  // Demo click handler
  handleClick(event: Event) {
    event.stopPropagation();
    this.undoString = 'undid';
    this.toastPackage.triggerAction();
    return false;
  }
}
