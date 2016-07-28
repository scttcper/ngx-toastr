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
} from '@angular/core';
import { ComponentPortal, OVERLAY_PROVIDERS, Overlay, OverlayRef } from '@angular2-material/core';
import { OVERLAY_CONTAINER_TOKEN } from '@angular2-material/core';

@Injectable()
export class ToastrService {
  constructor(
    public overlay: Overlay
  ) {}

  public success(viewContainerRef: ViewContainerRef, message?: string, title?: string, optionsOverride?: any) {
    let component = new ComponentPortal(Toast, viewContainerRef);
    this.overlay.create()
      .then((ref: OverlayRef) => {
        ref.attach(component)
        console.log(ref)
      })
  }
}

@Component({
  selector: '[toast]',
  template: `
  <div class="{{toastClass}}" (click)="tapToast()">
    Toast {{test}}
  </div>
  `,
})
export class Toast {
  toastClass: string = 'toast';
  test: string = 'swag';

  constructor(
  ) {}

  tapToast() {
    console.log('clicked');
  }
}
