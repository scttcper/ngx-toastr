import { inject, Injectable, NgZone } from '@angular/core';

type IntervalHandle = ReturnType<typeof setInterval>;
type TimeoutHandle = ReturnType<typeof setTimeout>;

@Injectable({ providedIn: 'root' })
export class TimeoutsService {
  protected ngZone? = inject(NgZone);

  public setInterval(func: () => unknown, timeout: number): IntervalHandle {
    if (this.ngZone) {
      return this.ngZone.runOutsideAngular(() =>
        setInterval(() => this.runInsideAngular(func), timeout),
      );
    } else {
      return setInterval(() => func(), timeout);
    }
  }

  public setTimeout(func: () => unknown, timeout?: number): TimeoutHandle {
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
