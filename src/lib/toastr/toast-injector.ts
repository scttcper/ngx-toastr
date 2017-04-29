import {Injector} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';

import {OverlayRef} from '../overlay/overlay-ref';
import {ToastData} from './toastr-config';

/**
 * Reference to a toast opened via the Toastr service.
 */
export class ToastRef<T> {
  /** The instance of component opened into the toast. */
  componentInstance: T;

  /** Subject for notifying the user that the toast has finished closing. */
  private _afterClosed: Subject<any> = new Subject();
  private _activate: Subject<any> = new Subject();
  private _manualClose: Subject<any> = new Subject();

  constructor(private _overlayRef: OverlayRef) { }

  manualClose() {
    this._manualClose.next();
    this._manualClose.complete();
  }

  manualClosed(): Observable<any> {
    return this._manualClose.asObservable();
  }

  /**
   * Close the toast.
   */
  close(): void {
    this._overlayRef.detach();
    this._afterClosed.next();
    this._afterClosed.complete();
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
}


/** Custom injector type specifically for instantiating components with a toast. */
export class ToastInjector implements Injector {
  constructor(
    private _dialogRef: ToastRef<any>,
    private _data: ToastData,
    private _parentInjector: Injector) { }

  get(token: any, notFoundValue?: any): any {
    if (token === ToastRef) {
      return this._dialogRef;
    }

    if (token === ToastData && this._data) {
      return this._data;
    }

    return this._parentInjector.get(token, notFoundValue);
  }
}
