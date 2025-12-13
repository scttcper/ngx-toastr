import { inject, Injectable } from '@angular/core';
import { random } from 'lodash-es';
import {
  ToastNoAnimation,
  ToastrService,
  type ActiveToast,
  type GlobalConfig,
  type IndividualConfig,
} from 'ngx-toastr';
import { BootstrapToast } from './bootstrap-toast/bootstrap-toast.component';
import { NotyfToast } from './notyf-toast/notyf-toast.component';
import { PinkToast } from './pink-toast/pink-toast.component';
import { quotes, type Quote } from './quotes';

@Injectable({ providedIn: 'root' })
export class ToastManagerService {
  private toastr = inject(ToastrService);
  private lastInserted: number[] = [];

  public openToastAnimation(options?: GlobalConfig, type?: string, quote?: Quote) {
    const _options = { ...(options ?? this.toastr.toastrConfig) };

    return this.openToast<PinkToast>(_options, quote, _options.iconClasses[type ?? 'success']);
  }

  public openToastNoAnimation(options?: GlobalConfig, type?: string, quote?: Quote) {
    const _options = { ...(options ?? this.toastr.toastrConfig) };

    return this.openToast<PinkToast>(
      {
        ..._options,
        toastComponent: ToastNoAnimation,
      },
      quote,
      _options.iconClasses[type ?? 'success'],
    );
  }

  public openPinkToast(options?: IndividualConfig, quote?: Quote) {
    return this.openToast<PinkToast>(
      {
        ...(options ?? this.toastr.toastrConfig),

        toastClass: 'pinktoast',
        toastComponent: PinkToast,
      },
      quote,
    );
  }

  public openBootstrapToast(options?: IndividualConfig, quote?: Quote) {
    return this.openToast<BootstrapToast>(
      {
        ...(options ?? this.toastr.toastrConfig),

        toastClass: 'toast',
        toastComponent: BootstrapToast,
      },
      quote,
    );
  }

  public openNotyf(options?: IndividualConfig, quote?: Quote) {
    return this.openToast<NotyfToast>(
      {
        ...(options ?? this.toastr.toastrConfig),
        toastClass: 'notyf confirm',
        toastComponent: NotyfToast,
      },
      quote,
    );
  }

  public clearToasts() {
    this.toastr.clear();
  }

  public clearLastToast() {
    this.toastr.clear(this.lastInserted.pop());
  }

  private openToast<C extends ToastNoAnimation>(
    options?: IndividualConfig,
    quote?: Quote,
    type?: string,
  ): ActiveToast<C> | undefined {
    const { message, title } = this.getMessage(quote);
    const inserted = this.toastr.show<C>(
      message || 'Success',
      title,
      options ?? this.toastr.toastrConfig,
      type,
    );

    if (!inserted) throw new Error('Failed to create toast');
    this.lastInserted.push(inserted.toastId);
    return inserted;
  }

  private getMessage(quote?: Partial<Quote>): Quote {
    if (!quote?.title && !quote?.message) {
      return quotes[random(0, quotes.length - 1)];
    }

    return quote;
  }
}
