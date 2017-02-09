import {
  ViewContainerRef,
  ComponentRef,
  Injector
} from '@angular/core';
import {
  NullPortalHostError,
  PortalAlreadyAttachedError,
  NoPortalAttachedError,
  NullPortalError,
  PortalHostAlreadyDisposedError,
} from './portal-errors';

export interface ComponentType<T> {
  new (...args: any[]): T;
}

/**
 * A `Portal` is something that you want to render somewhere else.
 * It can be attach to / detached from a `PortalHost`.
 */
export abstract class Portal<T> {
  private _attachedHost: PortalHost;

  /** Attach this portal to a host. */
  attach(host: PortalHost, newestOnTop: boolean): T {
    if (host == null) {
      throw new NullPortalHostError();
    }

    if (host.hasAttached()) {
      throw new PortalAlreadyAttachedError();
    }

    this._attachedHost = host;
    return <T> host.attach(this, newestOnTop);
  }

  /** Detach this portal from its host */
  detach(): void {
    const host = this._attachedHost;
    if (host == null) {
      throw new NoPortalAttachedError();
    }

    this._attachedHost = null;
    return host.detach();
  }

  /** Whether this portal is attached to a host. */
  get isAttached(): boolean {
    return this._attachedHost != null;
  }

  /**
   * Sets the PortalHost reference without performing `attach()`. This is used directly by
   * the PortalHost when it is performing an `attach()` or `detach()`.
   */
  setAttachedHost(host: PortalHost) {
    this._attachedHost = host;
  }
}


/**
 * A `ComponentPortal` is a portal that instantiates some Component upon attachment.
 */
export class ComponentPortal<T> extends Portal<ComponentRef<T>> {
  /** The type of the component that will be instantiated for attachment. */
  component: ComponentType<T>;

  /**
   * [Optional] Where the attached component should live in Angular's *logical* component tree.
   * This is different from where the component *renders*, which is determined by the PortalHost.
   * The origin necessary when the host is outside of the Angular application context.
   */
  viewContainerRef: ViewContainerRef;

  /** [Optional] Injector used for the instantiation of the component. */
  injector: Injector;

  constructor(
      component: ComponentType<T>,
      viewContainerRef: ViewContainerRef = null,
      injector: Injector = null) {
    super();
    this.component = component;
    this.viewContainerRef = viewContainerRef;
    this.injector = injector;
  }
}


/**
 * A `PortalHost` is an space that can contain a single `Portal`.
 */
export interface PortalHost {
  attach(portal: Portal<any>, newestOnTop: boolean): any;

  detach(): any;

  dispose(): void;

  hasAttached(): boolean;
}


/**
 * Partial implementation of PortalHost that only deals with attaching either a
 * ComponentPortal or a TemplatePortal.
 */
export abstract class BasePortalHost implements PortalHost {
  /** The portal currently attached to the host. */
  private _attachedPortal: Portal<any>;

  /** A function that will permanently dispose this host. */
  private _disposeFn: () => void;

  /** Whether this host has already been permanently disposed. */
  private _isDisposed = false;

  /** Whether this host has an attached portal. */
  hasAttached() {
    return this._attachedPortal != null;
  }

  attach(portal: ComponentPortal<any>, newestOnTop: boolean): any {
    if (portal == null) {
      throw new NullPortalError();
    }

    if (this.hasAttached()) {
      throw new PortalAlreadyAttachedError();
    }

    if (this._isDisposed) {
      throw new PortalHostAlreadyDisposedError();
    }
    this._attachedPortal = portal;
    return this.attachComponentPortal(portal, newestOnTop);
  }

  abstract attachComponentPortal<T>(portal: ComponentPortal<T>, newestOnTop: boolean): ComponentRef<T>;

  detach(): void {
    if (this._attachedPortal) { this._attachedPortal.setAttachedHost(null); }

    this._attachedPortal = null;
    if (this._disposeFn != null) {
      this._disposeFn();
      this._disposeFn = null;
    }
  }

  dispose() {
    if (this.hasAttached()) {
      this.detach();
    }

    this._isDisposed = true;
  }

  setDisposeFn(fn: () => void) {
    this._disposeFn = fn;
  }
}
