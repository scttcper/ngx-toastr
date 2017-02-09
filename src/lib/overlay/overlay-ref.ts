import {NgZone} from '@angular/core';
import {PortalHost, Portal} from '../portal/portal';

/**
 * Reference to an overlay that has been created with the Overlay service.
 * Used to manipulate or dispose of said overlay.
 */
export class OverlayRef implements PortalHost {
  constructor(
      private _portalHost: PortalHost,
      private _pane: HTMLElement,
      private _ngZone: NgZone) { }

  attach(portal: Portal<any>, newestOnTop: boolean): any {
    const attachResult = this._portalHost.attach(portal, newestOnTop);
    return attachResult;
  }

  detach(): Promise<any> {
    return this._portalHost.detach();
  }

  dispose(): void {
    this._portalHost.dispose();
  }

  hasAttached(): boolean {
    return this._portalHost.hasAttached();
  }
}
