import { ChangeDetectionStrategy, Component, NgZone, signal, inject } from '@angular/core';
import { ToastBase } from '../toast.abstract';

@Component({
  selector: '[toast-component]',
  templateUrl: './toast.component.html',
  host: {
    '[class]': 'toastClasses()',
    '[style.display]': 'displayStyle()',
    '(mouseenter)': 'stickAround()',
    '(mouseleave)': 'delayedHideToast()',
    '(click)': 'tapToast()',
    '[style.--animation-easing]': 'params().easing',
    '[style.--animation-duration]': 'params().easeTime + "ms"',
    'animate.enter': 'toast-in',
    'animate.leave': 'toast-out',
  },
  preserveWhitespaces: false,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Toast<ConfigPayload = unknown> extends ToastBase<ConfigPayload> {
  protected ngZone? = inject(NgZone);
  readonly params = signal({ easeTime: this.toastPackage.config.easeTime, easing: 'ease-in' });
}
