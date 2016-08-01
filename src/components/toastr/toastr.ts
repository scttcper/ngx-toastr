import {
  Directive,
  Component,
  HostBinding,
  EventEmitter,
  Host,
  Attribute,
  Output,
  ContentChildren,
  QueryList,
  Injectable,
  ElementRef,
  ViewContainerRef,
  Renderer,
  ComponentResolver,
  Inject,
  ComponentRef,
  Injector,
} from '@angular/core';
import { Overlay } from './overlay/overlay';
import { OverlayRef } from './overlay/overlay-ref';
import { ComponentPortal } from './portal/portal';

@Injectable()
export class ToastrService {
  public viewContainerRef: ViewContainerRef;

  constructor(
    private _componentResolver: ComponentResolver,
    private overlay: Overlay
  ) {
  }

  public success(message?: string, title?: string, optionsOverride?: any) {
    let component = new ComponentPortal(Toast, this.viewContainerRef);
    this.overlay.create()
      .then((ref) => {
        ref.attach(component);
        console.log(ref);
        return ref;
      });
  }
}

@Component({
  selector: '[toast]',
  styleUrls: ['components/toastr/toastr.scss'],
  template: `
  <div class="toast toast-success" style="display: block;">
    <div class="toast-message">My name is Inigo Montoya. You killed my father. Prepare to die!</div>
  </div>
  `,
})
export class Toast {
  toastClass: string = 'toast';
  test: string = 'swag';

  constructor() {}

  tapToast() {
    console.log('clicked');
  }
}
