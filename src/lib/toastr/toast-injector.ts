import { Injector, InjectFlags } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { OverlayRef } from '../overlay/overlay-ref';
import { ToastPackage } from './toastr-config';

/**
 * Reference to a toast opened via the Toastr service.
 */
export class ToastRef<T> {
  /** The instance of component opened into the toast. */
  componentInstance: T;

  /** Subject for notifying the user that the toast has finished closing. */
  private _afterClosed = new Subject<any>();
  /** triggered when toast is activated */
  private _activate = new Subject<any>();
  /** notifies the toast that it should close before the timeout */
  private _manualClose = new Subject<any>();
  /** notifies the toast that it should reset the timeouts */
  private _resetTimeout = new Subject<any>();

  constructor(private _overlayRef: OverlayRef) {}

  manualClose() {
    this._manualClose.next();
    this._manualClose.complete();
  }

  manualClosed(): Observable<any> {
    return this._manualClose.asObservable();
  }

  timeoutReset(): Observable<any> {
    return this._resetTimeout.asObservable();
  }

  /**
   * Close the toast.
   */
  close(): void {
    this._overlayRef.detach();
    this._afterClosed.next();
    this._manualClose.next();
    this._afterClosed.complete();
    this._manualClose.complete();
    this._activate.complete();
    this._resetTimeout.complete();
  }

  /** Gets an observable that is notified when the toast is finished closing. */
  afterClosed(): Observable<any> {
    return this._afterClosed.asObservable();
  }

  isInactive() {
    return this._activate.isStopped;
  }

  activate() {
    this._activate.next();
    this._activate.complete();
  }

  /** Gets an observable that is notified when the toast has started opening. */
  afterActivate(): Observable<any> {
    return this._activate.asObservable();
  }

  /** Reset the toast timouts */
  resetTimeout() {
    this._resetTimeout.next();
  }
}

/** Custom injector type specifically for instantiating components with a toast. */
export class ToastInjector implements Injector {
  constructor(
    private _toastPackage: ToastPackage,
    private _parentInjector: Injector
  ) {}

  get<T>(token: any, notFoundValue?: T, flags?: InjectFlags): T | ToastPackage {
    if (token === ToastPackage) {
      return this._toastPackage;
    }
    return this._parentInjector.get<T>(token, notFoundValue, flags);
  }
}
