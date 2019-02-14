import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, OnDestroy } from '@angular/core';

/** Container inside which all toasts will render. */
@Injectable({ providedIn: 'root' })
export class OverlayContainer implements OnDestroy {
  protected _containerElement: HTMLElement;

  constructor(@Inject(DOCUMENT) protected _document: any) {}

  ngOnDestroy() {
    if (this._containerElement && this._containerElement.parentNode) {
      this._containerElement.parentNode.removeChild(this._containerElement);
    }
  }

  /**
   * This method returns the overlay container element. It will lazily
   * create the element the first time  it is called to facilitate using
   * the container in non-browser environments.
   * @returns the container element
   */
  getContainerElement(): HTMLElement {
    if (!this._containerElement) {
      this._createContainer();
    }
    return this._containerElement;
  }

  /**
   * Create the overlay container element, which is simply a div
   * with the 'cdk-overlay-container' class on the document body.
   */
  protected _createContainer(): void {
    const container = this._document.createElement('div');
    container.classList.add('overlay-container');
    this._document.body.appendChild(container);
    this._containerElement = container;
  }
}
