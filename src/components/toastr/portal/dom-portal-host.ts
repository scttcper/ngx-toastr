import { ComponentFactoryResolver, ComponentRef, EmbeddedViewRef } from '@angular/core';
import { BasePortalHost, ComponentPortal, TemplatePortal } from './portal';
import { MdComponentPortalAttachedToDomWithoutOriginError } from './portal-errors';


/**
 * A PortalHost for attaching portals to an arbitrary DOM element outside of the Angular
 * application context.
 *
 * This is the only part of the portal core that directly touches the DOM.
 */
export class DomPortalHost extends BasePortalHost {
  constructor(
      private _hostDomElement: Element,
      private _componentFactoryResolver: ComponentFactoryResolver) {
    super();
  }

  /** Attach the given ComponentPortal to DOM element using the ComponentResolver. */
  attachComponentPortal<T>(portal: ComponentPortal<T>,
                          newestOnTop: boolean): Promise<ComponentRef<T>> {
    if (portal.viewContainerRef == null) {
      throw new MdComponentPortalAttachedToDomWithoutOriginError();
    }

    let componentFactory = this._componentFactoryResolver.resolveComponentFactory(portal.component);
    let ref = portal.viewContainerRef.createComponent(
        componentFactory,
        portal.viewContainerRef.length,
        portal.injector || portal.viewContainerRef.parentInjector);

    let hostView = <EmbeddedViewRef<any>> ref.hostView;
    if (newestOnTop) {
      this._hostDomElement.insertBefore(hostView.rootNodes[0], this._hostDomElement.firstChild);
    } else {
      this._hostDomElement.appendChild(hostView.rootNodes[0]);
    }
    this.setDisposeFn(() => ref.destroy());
    return Promise.resolve(ref);
  }

  attachTemplatePortal(portal: TemplatePortal): Promise<Map<string, any>> {
    let viewContainer = portal.viewContainerRef;
    let viewRef = viewContainer.createEmbeddedView(portal.templateRef);

    viewRef.rootNodes.forEach(rootNode => this._hostDomElement.appendChild(rootNode));

    this.setDisposeFn((() => {
      let index = viewContainer.indexOf(viewRef);
      if (index !== -1) {
        viewContainer.remove(index);
      }
    }));

    return Promise.resolve(new Map<string, any>());
  }

  dispose(): void {
    super.dispose();
    if (this._hostDomElement.parentNode != null) {
      this._hostDomElement.parentNode.removeChild(this._hostDomElement);
    }
  }
}
