import {
  ComponentRef,
  Injector,
  ViewContainerRef
} from '@angular/core';

export interface ComponentType<T> {
  // tslint:disable-next-line:callable-types
  new (...args: any[]): T;
}


/**
 * A `ComponentPortal` is a portal that instantiates some Component upon attachment.
 */
export class ComponentPortal<T> {
  private _attachedHost?: BasePortalHost;
  /** The type of the component that will be instantiated for attachment. */
  component: ComponentType<T>;

  /**
   * [Optional] Where the attached component should live in Angular's *logical* component tree.
   * This is different from where the component *renders*, which is determined by the PortalHost.
   * The origin necessary when the host is outside of the Angular application context.
   */
  viewContainerRef!: ViewContainerRef;

  /** Injector used for the instantiation of the component. */
  injector: Injector;

  constructor(component: ComponentType<T>, injector: Injector) {
    this.component = component;
    this.injector = injector;
  }

  /** Attach this portal to a host. */
  attach(host: BasePortalHost, newestOnTop: boolean): ComponentRef<any> {
    this._attachedHost = host;
    return host.attach(this, newestOnTop);
  }

  /** Detach this portal from its host */
  detach() {
    const host = this._attachedHost;
    if (host) {
      this._attachedHost = undefined;
      return host.detach();
    }
  }

  /** Whether this portal is attached to a host. */
  get isAttached(): boolean {
    return this._attachedHost != null;
  }

  /**
   * Sets the PortalHost reference without performing `attach()`. This is used directly by
   * the PortalHost when it is performing an `attach()` or `detach()`.
   */
  setAttachedHost(host?: BasePortalHost) {
    this._attachedHost = host;
  }
}

/**
 * Partial implementation of PortalHost that only deals with attaching a
 * ComponentPortal
 */
export abstract class BasePortalHost {
  /** The portal currently attached to the host. */
  private _attachedPortal?: ComponentPortal<any>;

  /** A function that will permanently dispose this host. */
  private _disposeFn?: () => void;

  attach(portal: ComponentPortal<any>, newestOnTop: boolean) {
    this._attachedPortal = portal;
    return this.attachComponentPortal(portal, newestOnTop);
  }

  abstract attachComponentPortal<T>(portal: ComponentPortal<T>, newestOnTop: boolean): ComponentRef<T>;

  detach() {
    if (this._attachedPortal) {
      this._attachedPortal.setAttachedHost();
    }

    this._attachedPortal = undefined;
    if (this._disposeFn) {
      this._disposeFn();
      this._disposeFn = undefined;
    }
  }

  setDisposeFn(fn: () => void) {
    this._disposeFn = fn;
  }
}
