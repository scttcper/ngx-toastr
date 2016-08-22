import { ComponentFactoryResolver, Injectable } from '@angular/core';
import { DomPortalHost } from '../portal/dom-portal-host';
import { OverlayRef } from './overlay-ref';

import { OverlayContainer } from './overlay-container';


/**
 * Service to create Overlays. Overlays are dynamically added pieces of floating UI, meant to be
 * used as a low-level building building block for other components. Dialogs, tooltips, menus,
 * selects, etc. can all be built using overlays. The service should primarily be used by authors
 * of re-usable components rather than developers building end-user applications.
 *
 * An overlay *is* a PortalHost, so any kind of Portal can be loaded into one.
 */
 @Injectable()
export class Overlay {
  private _paneElement: HTMLElement;
  constructor(private _overlayContainer: OverlayContainer,
              private _componentFactoryResolver: ComponentFactoryResolver) {}
  /**
   * Creates an overlay.
   * @param state State to apply to the overlay.
   * @returns A reference to the created overlay.
   */
  create(positionClass: string): OverlayRef {
    return this._createOverlayRef(this.getPaneElement(positionClass));
  }

  getPaneElement(positionClass: string): HTMLElement {
    if (!this._paneElement) {
      this._createPaneElement(positionClass);
    }
    return this._paneElement;
  }

  dispose() {
    this._paneElement = null;
  }

  /**
   * Creates the DOM element for an overlay and appends it to the overlay container.
   * @returns Promise resolving to the created element.
   */
  private _createPaneElement(positionClass: string): HTMLElement {
    const pane = document.createElement('div');
    pane.id = 'toast-container';
    pane.classList.add(positionClass);
    this._overlayContainer.getContainerElement().appendChild(pane);
    this._paneElement = pane;
    return pane;
  }

  /**
   * Create a DomPortalHost into which the overlay content can be loaded.
   * @param pane The DOM element to turn into a portal host.
   * @returns A portal host for the given DOM element.
   */
  private _createPortalHost(pane: HTMLElement): DomPortalHost {
    return new DomPortalHost(pane, this._componentFactoryResolver);
  }

  /**
   * Creates an OverlayRef for an overlay in the given DOM element.
   * @param pane DOM element for the overlay
   * @param state
   * @returns {OverlayRef}
   */
  private _createOverlayRef(pane: HTMLElement): OverlayRef {
    return new OverlayRef(this._createPortalHost(pane), pane);
  }
}


/** Providers for Overlay and its related injectables. */
export const OVERLAY_PROVIDERS = [
  Overlay,
  OverlayContainer,
];
