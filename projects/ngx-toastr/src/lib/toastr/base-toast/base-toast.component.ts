import {
  ApplicationRef,
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  linkedSignal,
  signal,
  type OnDestroy,
} from '@angular/core';
import { ToastPackage, type IndividualConfig } from '../toastr-config';
import { ToastrService } from '../toastr.service';
import type { Subscription } from 'rxjs';
import { TimeoutsService } from '../../timeouts.service';

@Component({
  selector: '[toast-component]',
  templateUrl: './base-toast.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'toastClasses()',
    '[style.display]': 'displayStyle()',
    '(mouseenter)': 'stickAround()',
    '(mouseleave)': 'delayedHideToast()',
    '(click)': 'tapToast()',
  },
})
export class ToastBase<ConfigPayload = unknown> implements OnDestroy {
  public toastPackage = inject(ToastPackage);
  protected toastrService = inject(ToastrService);
  protected appRef = inject(ApplicationRef);
  protected timeoutsService = inject(TimeoutsService);

  duplicatesCount!: number;
  protected hideTime!: number;

  /** width of progress bar */
  readonly width = signal(-1);
  readonly state = signal<'inactive' | 'active' | 'removed'>('inactive');
  /** hides component when waiting to be displayed */
  readonly displayStyle = computed(() => (this.state() === 'inactive' ? 'none' : undefined));
  readonly message = computed(() => this.toastPackage.message);
  readonly title = computed(() => this.toastPackage.title);
  readonly options = linkedSignal<IndividualConfig<ConfigPayload>>(() => this.toastPackage.config);
  readonly originalTimeout = computed(() => this.toastPackage.config.timeOut);
  readonly toastClasses = computed(
    () => `${this.toastPackage.toastType} ${this.toastPackage.config.toastClass}`,
  );

  protected timeout: number | undefined;
  protected intervalId: number | undefined;

  protected afterActivateSubscription!: Subscription;
  protected manualClosedSubscription!: Subscription;
  protected timeoutResetSubscription!: Subscription;
  protected countDuplicateSubscription!: Subscription;

  constructor() {
    this.afterActivateSubscription = this.toastPackage.toastRef.afterActivate().subscribe(() => {
      this.activateToast();
    });
    this.manualClosedSubscription = this.toastPackage.toastRef.manualClosed().subscribe(() => {
      this.remove();
    });
    this.timeoutResetSubscription = this.toastPackage.toastRef.timeoutReset().subscribe(() => {
      this.resetTimeout();
    });
    this.countDuplicateSubscription = this.toastPackage.toastRef
      .countDuplicate()
      .subscribe(count => {
        this.duplicatesCount = count;
      });
  }

  public ngOnDestroy(): void {
    this.afterActivateSubscription.unsubscribe();
    this.manualClosedSubscription.unsubscribe();
    this.timeoutResetSubscription.unsubscribe();
    this.countDuplicateSubscription.unsubscribe();

    clearInterval(this.intervalId);
    clearTimeout(this.timeout);
  }

  /**
   * activates toast and sets timeout
   */
  activateToast() {
    const options = this.options();
    this.state.set('active');

    if (
      !(options.disableTimeOut === true || options.disableTimeOut === 'timeOut') &&
      options.timeOut
    ) {
      this.timeout = this.timeoutsService.setTimeout(() => this.remove(), options.timeOut);
      this.hideTime = new Date().getTime() + options.timeOut;
      if (options.progressBar) {
        this.intervalId = this.timeoutsService.setInterval(() => this.updateProgress(), 10);
      }
    }
  }

  /**
   * updates progress bar width
   */
  updateProgress() {
    const options = this.options();

    if (this.width() === 0 || this.width() === 100 || !options.timeOut) {
      return;
    }
    const now = new Date().getTime();
    const remaining = this.hideTime - now;
    this.width.set((remaining / options.timeOut) * 100);
    if (options.progressAnimation === 'increasing') {
      this.width.update(width => 100 - width);
    }
    if (this.width() <= 0) {
      this.width.set(0);
    }
    if (this.width() >= 100) {
      this.width.set(100);
    }
  }

  resetTimeout() {
    const options = this.options();
    clearTimeout(this.timeout);
    clearInterval(this.intervalId);
    this.state.set('active');

    this.options.update(options => ({ ...options, timeOut: this.originalTimeout() }));
    this.timeout = this.timeoutsService.setTimeout(() => this.remove(), this.originalTimeout());
    this.hideTime = new Date().getTime() + (this.originalTimeout() || 0);
    this.width.set(-1);
    if (options.progressBar)
      this.intervalId = this.timeoutsService.setInterval(() => this.updateProgress(), 10);
  }

  /**
   * tells toastrService to remove this toast after animation time
   */
  remove() {
    if (this.state() === 'removed') return;

    clearTimeout(this.timeout);
    this.state.set('removed');
    this.timeout = this.timeoutsService.setTimeout(() =>
      this.toastrService.remove(this.toastPackage.toastId),
    );
  }

  tapToast() {
    if (this.state() === 'removed') return;

    this.toastPackage.triggerTap();
    if (this.options().tapToDismiss) {
      this.remove();
    }
  }

  stickAround() {
    if (this.state() === 'removed') return;

    if (this.options().disableTimeOut !== 'extendedTimeOut') {
      clearTimeout(this.timeout);
      this.options.update(options => ({ ...options, timeOut: 0 }));
      this.hideTime = 0;

      // disable progressBar
      clearInterval(this.intervalId);
      this.width.set(0);
    }
  }

  delayedHideToast() {
    const options = this.options();
    if (
      options.disableTimeOut === true ||
      options.disableTimeOut === 'extendedTimeOut' ||
      options.extendedTimeOut === 0 ||
      this.state() === 'removed'
    ) {
      return;
    }
    this.timeout = this.timeoutsService.setTimeout(() => this.remove(), options.extendedTimeOut);
    this.options.update(options => ({ ...options, timeOut: options.extendedTimeOut }));
    this.hideTime = new Date().getTime() + (options.timeOut || 0);
    this.width.set(-1);
    if (options.progressBar) {
      this.intervalId = this.timeoutsService.setInterval(() => this.updateProgress(), 10);
    }
  }
}
