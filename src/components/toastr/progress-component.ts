import {
  Component,
  Input,
  OnInit,
  OnDestroy,
} from '@angular/core';

@Component({
  selector: 'toast-progress',
  template: `
  <div class="toast-progress" [style.width.%]="width">hello</div>
  `,
})
export class ToastProgress implements OnInit, OnDestroy {
  private _ttl: number;
  private hideTime: number;
  private intervalId: number;
  private width: number;

  @Input()
  get ttl() {
    return this._ttl;
  }
  set ttl(v: number) {
    this._ttl = +v;
  }

  ngOnInit() {
    this.hideTime = new Date().getTime() + this.ttl;
    this.intervalId = setInterval(() => this.updateProgress(), 10);
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
  }

  updateProgress() {
    let now = new Date().getTime();
    let remaining = this.hideTime - now;
    this.width = (remaining / this.ttl) * 100;
  }
}
