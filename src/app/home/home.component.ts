import { Component, QueryList, Renderer2, VERSION, ViewChildren } from '@angular/core';
import { Howl } from 'howler';
import { cloneDeep, random } from 'lodash-es';


import {
    GlobalConfig, ToastContainerDirective,
    ToastNoAnimation, ToastrService
} from '../../lib/public_api';

import { BootstrapToast } from '../bootstrap.toast';
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
  
  soundToastTypeMap: Map<string,Howl> = new Map([
    ['success', new Howl({
        src: ['assets/notification-sound/success.mp3'],
    })],
    ['error', new Howl({
        src: ['assets/notification-sound/error.mp3'],
    })],
    ['info', new Howl({
        src: ['assets/notification-sound/info.mp3']
    })],
    ['warning', new Howl({
        src: ['assets/notification-sound/warning.mp3']
    })],
  ]);
  
  @ViewChildren(ToastContainerDirective) inlineContainers!: QueryList<ToastContainerDirective>;


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
    this.soundToastTypeMap.get(this.type)?.play();
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
  openBootstrapToast() {
    const opt = cloneDeep(this.options);
    opt.toastComponent = BootstrapToast;
    opt.toastClass = 'toast';
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
    // opt.positionClass = 'notyf__wrapper';
    // this.options.newestOnTop = false;
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
  fixNumber(field: keyof GlobalConfig): void {
    (this.options as any)[field] = Number(this.options[field]) as any;
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
