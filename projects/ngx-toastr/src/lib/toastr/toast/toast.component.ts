import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ToastBase } from '../base-toast/base-toast.component';

@Component({
  selector: '[toast-component]',
  templateUrl: '../base-toast/base-toast.component.html',
  styleUrl: './toast.component.scss',
  host: {
    '[style.--animation-easing]': 'params().easing',
    '[style.--animation-duration]': 'params().easeTime + "ms"',
    'animate.enter': 'toast-in',
    'animate.leave': 'toast-out',
  },
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Toast<ConfigPayload = unknown> extends ToastBase<ConfigPayload> {
  readonly params = signal({ easeTime: this.toastPackage.config.easeTime, easing: 'ease-in' });
}
