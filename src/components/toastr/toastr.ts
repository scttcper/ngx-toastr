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
import {
  OVERLAY_CONTAINER_TOKEN,
  OVERLAY_PROVIDERS,
  Overlay,
  OverlayRef,
  OverlayState,
  DomPortalHost,
  Portal,
  ComponentPortal,
} from '@angular2-material/core';

let nextUniqueId = 0;
let defaultState = new OverlayState();
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
      .then((ref: OverlayRef) => {
        ref.attach(component);
        console.log(ref);
        return ref;
      })
      .then((ref: OverlayRef) => {
        // ref.detach();
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
