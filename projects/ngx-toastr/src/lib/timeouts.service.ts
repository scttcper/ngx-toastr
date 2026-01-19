import { inject, Injectable, NgZone } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TimeoutsService {
  protected ngZone? = inject(NgZone);

  public setInterval(func: () => unknown, timeout: number): number {
    if (this.ngZone) {
      return this.ngZone.runOutsideAngular(() =>
        setInterval(() => this.runInsideAngular(func), timeout),
      );
    } else {
      return setInterval(() => func(), timeout);
    }
  }

  public setTimeout(func: () => unknown, timeout?: number): number {
    if (this.ngZone) {
      return this.ngZone.runOutsideAngular(() =>
        setTimeout(() => this.runInsideAngular(func), timeout),
      );
    } else {
      return setTimeout(() => func(), timeout);
    }
  }

  protected runInsideAngular(func: () => unknown) {
    if (this.ngZone) {
      this.ngZone.run(() => func());
    } else {
      func();
    }
  }
}
