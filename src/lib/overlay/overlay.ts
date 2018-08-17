import { DOCUMENT } from '@angular/common';
import {
  ApplicationRef,
  ComponentFactoryResolver,
  Inject,
  Injectable,
} from '@angular/core';

import { DomPortalHost } from '../portal/dom-portal-host';
import { ToastContainerDirective } from '../toastr/toast.directive';
import { OverlayContainer } from './overlay-container';
import { OverlayRef } from './overlay-ref';

/**
 * Service to create Overlays. Overlays are dynamically added pieces of floating UI, meant to be
 * used as a low-level building building block for other components. Dialogs, tooltips, menus,
 * selects, etc. can all be built using overlays. The service should primarily be used by authors
 * of re-usable components rather than developers building end-user applications.
 *
 * An overlay *is* a PortalHost, so any kind of Portal can be loaded into one.
 */
@Injectable({ providedIn: 'root' })
export class Overlay {
  // Namespace panes by overlay container
  private _paneElements: Map<
    ToastContainerDirective,
    { string?: HTMLElement }
  > = new Map();

  constructor(
    private _overlayContainer: OverlayContainer,
    private _componentFactoryResolver: ComponentFactoryResolver,
    private _appRef: ApplicationRef,
    @Inject(DOCUMENT) private _document: any,
  ) {}
  /**
   * Creates an overlay.
   * @returns A reference to the created overlay.
   */
  create(
    positionClass?: string,
    overlayContainer?: ToastContainerDirective,
  ): OverlayRef {
    // get existing pane if possible
    return this._createOverlayRef(
      this.getPaneElement(positionClass, overlayContainer),
    );
  }

  getPaneElement(
    positionClass: string = '',
    overlayContainer?: ToastContainerDirective,
  ): HTMLElement {
    if (!this._paneElements.get(overlayContainer)) {
      this._paneElements.set(overlayContainer, {});
    }

    if (!this._paneElements.get(overlayContainer)[positionClass]) {
      this._paneElements.get(overlayContainer)[positionClass] = this._createPaneElement(positionClass, overlayContainer);
    }

    return this._paneElements.get(overlayContainer)[positionClass];
  }


  /**
   * Creates the DOM element for an overlay and appends it to the overlay container.
   * @returns Newly-created pane element
   */
  private _createPaneElement(
    positionClass: string,
    overlayContainer?: ToastContainerDirective,
  ): HTMLElement {
    const pane = this._document.createElement('div');

    pane.id = 'toast-container';
    pane.classList.add(positionClass);
    pane.classList.add('toast-container');

    if (!overlayContainer) {
      this._overlayContainer.getContainerElement().appendChild(pane);
    } else {
      overlayContainer.getContainerElement().appendChild(pane);
    }

    return pane;
  }

  /**
   * Create a DomPortalHost into which the overlay content can be loaded.
   * @param pane The DOM element to turn into a portal host.
   * @returns A portal host for the given DOM element.
   */
  private _createPortalHost(pane: HTMLElement): DomPortalHost {
    return new DomPortalHost(
      pane,
      this._componentFactoryResolver,
      this._appRef,
    );
  }

  /**
   * Creates an OverlayRef for an overlay in the given DOM element.
   * @param pane DOM element for the overlay
   */
  private _createOverlayRef(pane: HTMLElement): OverlayRef {
    return new OverlayRef(this._createPortalHost(pane));
  }
}
