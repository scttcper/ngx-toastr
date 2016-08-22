import {
    TemplateRef,
    ViewContainerRef,
    ElementRef,
    ComponentRef,
    Injector
} from '@angular/core';
import {
    MdNullPortalHostError,
    MdPortalAlreadyAttachedError,
    MdNoPortalAttachedError,
    MdNullPortalError,
    MdPortalHostAlreadyDisposedError,
    MdUnknownPortalTypeError
} from './portal-errors';
import { ComponentType } from '../overlay/generic-component-type';



/**
 * A `Portal` is something that you want to render somewhere else.
 * It can be attach to / detached from a `PortalHost`.
 */
export abstract class Portal<T> {
  private _attachedHost: PortalHost;

  /** Attach this portal to a host. */
  attach(host: PortalHost, newestOnTop: boolean): T {
    if (host == null) {
      throw new MdNullPortalHostError();
    }

    if (host.hasAttached()) {
      throw new MdPortalAlreadyAttachedError();
    }

    this._attachedHost = host;
    return <T> host.attach(this, newestOnTop);
  }

  /** Detach this portal from its host */
  detach(): void {
    let host = this._attachedHost;
    if (host == null) {
      throw new MdNoPortalAttachedError();
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
   * the PortalHost when it is performing an `attach()` or `detatch()`.
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
 * A `TemplatePortal` is a portal that represents some embedded template (TemplateRef).
 */
export class TemplatePortal extends Portal<Map<string, any>> {
  /** The embedded template that will be used to instantiate an embedded View in the host. */
  templateRef: TemplateRef<any>;

  /** Reference to the ViewContainer into which the template will be stamped out. */
  viewContainerRef: ViewContainerRef;

  /**
   * Additional locals for the instantiated embedded view.
   * These locals can be seen as "exports" for the template, such as how ngFor has
   * index / event / odd.
   * See https://angular.io/docs/ts/latest/api/core/EmbeddedViewRef-class.html
   */
  locals: Map<string, any> = new Map<string, any>();

  constructor(template: TemplateRef<any>, viewContainerRef: ViewContainerRef) {
    super();
    this.templateRef = template;
    this.viewContainerRef = viewContainerRef;
  }

  get origin(): ElementRef {
    return this.templateRef.elementRef;
  }

  attach(host: PortalHost, newestOnTop: boolean, locals?: Map<string, any>): Map<string, any> {
    this.locals = locals == null ? new Map<string, any>() : locals;
    return super.attach(host, newestOnTop);
  }

  detach(): void {
    this.locals = new Map<string, any>();
    return super.detach();
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
  private _isDisposed: boolean = false;

  /** Whether this host has an attached portal. */
  hasAttached() {
    return this._attachedPortal != null;
  }

  attach(portal: Portal<any>, newestOnTop: boolean): any {
    if (portal == null) {
      throw new MdNullPortalError();
    }

    if (this.hasAttached()) {
      throw new MdPortalAlreadyAttachedError();
    }

    if (this._isDisposed) {
      throw new MdPortalHostAlreadyDisposedError();
    }

    if (portal instanceof ComponentPortal) {
      this._attachedPortal = portal;
      return this.attachComponentPortal(portal, newestOnTop);
    } else if (portal instanceof TemplatePortal) {
      this._attachedPortal = portal;
      return this.attachTemplatePortal(portal);
    }

    throw new MdUnknownPortalTypeError();
  }

  abstract attachComponentPortal<T>(portal: ComponentPortal<T>,
    newestOnTop: boolean): ComponentRef<T>;

  abstract attachTemplatePortal(portal: TemplatePortal): Map<string, any>;

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
