import {NgZone} from '@angular/core';
import {BasePortalHost, ComponentPortal} from '../portal/portal';

/**
 * Reference to an overlay that has been created with the Overlay service.
 * Used to manipulate or dispose of said overlay.
 */
export class OverlayRef {
  constructor(
      private _portalHost: BasePortalHost,
      private _pane: HTMLElement,
      private _ngZone: NgZone) { }

  attach(portal: ComponentPortal<any>, newestOnTop: boolean): any {
    return this._portalHost.attach(portal, newestOnTop);
  }

  detach() {
    return this._portalHost.detach();
  }
}
