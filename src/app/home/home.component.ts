import { Component, QueryList, Renderer2, ViewChildren, VERSION } from '@angular/core';
import { cloneDeep, random } from 'lodash-es';

import {
  GlobalConfig,
  ToastrService,
  ToastContainerDirective,
  ToastNoAnimation,
} from '../../lib/public_api';

import { NotyfToast } from '../notyf.toast';
import { PinkToast } from '../pink.toast';

interface Quote {
  title?: string;
  message?: string;
}

const quotes: Quote[] = [
  {
    title: 'Title',
    message: 'Message',
  },
  {
    title: '😃',
    message: 'Supports Emoji',
  },
  {
    message: 'My name is Inigo Montoya. You killed my father. Prepare to die!',
  },
  {
    message: 'Titles are not always needed',
  },
  {
    title: 'Title only 👊',
  },
  {
    title: '',
    message: `Supports Angular ${VERSION.full}`,
  },
];
const types = ['success', 'error', 'info', 'warning'];

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent {
  options: GlobalConfig;
  title = '';
  message = '';
  type = types[0];
  version = VERSION;
  enableBootstrap = false;
  private lastInserted: number[] = [];
  inline = false;
  inlinePositionIndex = 0;
  @ViewChildren(ToastContainerDirective) inlineContainers: QueryList<ToastContainerDirective>;


  constructor(public toastr: ToastrService, private renderer: Renderer2) {
    this.options = this.toastr.toastrConfig;
  }
  getMessage() {
    let m: string | undefined = this.message;
    let t: string | undefined = this.title;
    if (!this.title.length && !this.message.length) {
      const randomMessage = quotes[random(0, quotes.length - 1)];
      m = randomMessage.message;
      t = randomMessage.title;
    }
    return {
      message: m,
      title: t,
    };
  }
  openToast() {
    const { message, title } = this.getMessage();
    // Clone current config so it doesn't change when ngModel updates
    const opt = cloneDeep(this.options);
    const inserted = this.toastr.show(
      message,
      title,
      opt,
      this.options.iconClasses[this.type],
    );
    if (inserted) {
      this.lastInserted.push(inserted.toastId);
    }
    return inserted;
  }
  openToastNoAnimation() {
    const { message, title } = this.getMessage();
    const opt = cloneDeep(this.options);
    opt.toastComponent = ToastNoAnimation;
    const inserted = this.toastr.show(
      message,
      title,
      opt,
      this.options.iconClasses[this.type],
    );
    if (inserted) {
      this.lastInserted.push(inserted.toastId);
    }
    return inserted;
  }
  openPinkToast() {
    const opt = cloneDeep(this.options);
    opt.toastComponent = PinkToast;
    opt.toastClass = 'pinktoast';
    const { message, title } = this.getMessage();
    const inserted = this.toastr.show(message, title, opt);
    if (inserted && inserted.toastId) {
      this.lastInserted.push(inserted.toastId);
    }
    return inserted;
  }
  openNotyf() {
    const opt = cloneDeep(this.options);
    opt.toastComponent = NotyfToast;
    opt.toastClass = 'notyf confirm';
    opt.positionClass = 'notyf-container';
    this.options.newestOnTop = false;
    const { message, title } = this.getMessage();
    const inserted = this.toastr.show(message || 'Success', title, opt);
    if (inserted && inserted.toastId) {
      this.lastInserted.push(inserted.toastId);
    }
    return inserted;
  }
  clearToasts() {
    this.toastr.clear();
  }
  clearLastToast() {
    this.toastr.clear(this.lastInserted.pop());
  }
  fixNumber(field: string) {
    this.options[field] = Number(this.options[field]);
  }
  setInlineClass(enableInline: boolean) {
    if (enableInline) {
      this.toastr.overlayContainer = this.inlineContainers.toArray()[this.inlinePositionIndex];
      this.options.positionClass = 'inline';
    } else {
      this.toastr.overlayContainer = undefined;
      this.options.positionClass = 'toast-top-right';
    }
  }
  setInlinePosition(index: number) {
    this.toastr.overlayContainer = this.inlineContainers.toArray()[index];
  }
  setClass(enableBootstrap: boolean) {
    const add = enableBootstrap ? 'bootstrap' : 'normal';
    const remove = enableBootstrap ? 'normal' : 'bootstrap';
    this.renderer.addClass(document.body, add);
    this.renderer.removeClass(document.body, remove);
  }

}
