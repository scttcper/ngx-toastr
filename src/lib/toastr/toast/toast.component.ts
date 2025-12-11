import { animate, state, style, transition, trigger } from '@angular/animations';
import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  NgZone,
  signal,
  inject,
} from '@angular/core';
import { ToastBase } from '../toast.abstract';

@Component({
  selector: '[toast-component]',
  templateUrl: './toast.component.html',
  animations: [
    trigger('flyInOut', [
      state('inactive', style({ opacity: 0 })),
      state('active', style({ opacity: 1 })),
      state('removed', style({ opacity: 0 })),
      transition('inactive => active', animate('{{ easeTime }}ms {{ easing }}')),
      transition('active => removed', animate('{{ easeTime }}ms {{ easing }}')),
    ]),
  ],
  host: {
    '[class]': 'toastClasses()',
    '[style.display]': 'displayStyle()',
    '(mouseenter)': 'stickAround()',
    '(mouseleave)': 'delayedHideToast()',
    '(click)': 'tapToast()',
  },
  preserveWhitespaces: false,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Toast<ConfigPayload = any> extends ToastBase<ConfigPayload> {
  protected ngZone? = inject(NgZone);
  readonly params = signal({ easeTime: this.toastPackage.config.easeTime, easing: 'ease-in' });

  /** controls animation */
  @HostBinding('@flyInOut') get _state() {
    return { value: this.state(), params: this.params() };
  }

  override remove() {
    super.remove();

    this.timeout = this.timeoutsService.setTimeout(
      () => this.toastrService.remove(this.toastPackage.toastId),
      +this.toastPackage.config.easeTime,
    );
  }
}
