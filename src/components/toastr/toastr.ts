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

@Injectable()
export class ToastrService {
  constructor(
    public overlay: Overlay,
    public viewContainerRef: ViewContainerRef
  ) {}

  public success(message: string, title: string, optionsOverride: any) {
    // var type = _getOptions().iconClasses.success;
    // return _buildNotification(type, message, title, optionsOverride);
    let component = new ComponentPortal(Toast, this.viewContainerRef);
    this.overlay.create().then((ref: OverlayRef) => {
      ref.attach(component).then((res: any) => {
        // wait for modal close
        res._hostElement.component.onClose.subscribe(() => {
          ref.dispose();
        });
      });
    });
  }
}

@Component({
  selector: '[toast]',
  template: `
  <div class="{{toastClass}}" (click)="tapToast()">
    Toast
    <div ng-switch on="allowHtml">
      <div ng-switch-default ng-if="title" class="{{titleClass}}" aria-label="{{title}}">{{title}}</div>
      <div ng-switch-default class="{{messageClass}}" aria-label="{{message}}">{{message}}</div>
      <div ng-switch-when="true" ng-if="title" class="{{titleClass}}" ng-bind-html="title"></div>
      <div ng-switch-when="true" class="{{messageClass}}" ng-bind-html="message"></div>
    </div>
    <progress-bar *ngIf="progressBar"></progress-bar>
  </div>
  `,
})
export class Toast {
  toastClass: string = '';

  constructor(
  ) {}

  tapToast() {
    console.log('clicked');
  }
}
