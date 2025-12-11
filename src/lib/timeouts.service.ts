import { inject, Injectable, NgZone } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TimeoutsService {
  protected ngZone? = inject(NgZone);

  public setInterval(func: () => any, timeout: number): number {
    if (this.ngZone) {
      return this.ngZone.runOutsideAngular(() =>
        window.setInterval(() => this.runInsideAngular(func), timeout),
      );
    } else {
      return window.setInterval(() => func(), timeout);
    }
  }

  public setTimeout(func: () => any, timeout?: number): number {
    if (this.ngZone) {
      return this.ngZone.runOutsideAngular(() =>
        window.setTimeout(() => this.runInsideAngular(func), timeout),
      );
    } else {
      return window.setTimeout(() => func(), timeout);
    }
  }

  protected runInsideAngular(func: () => any) {
    if (this.ngZone) {
      this.ngZone.run(() => func());
    } else {
      func();
    }
  }
}
