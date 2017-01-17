import { Component, VERSION } from '@angular/core';
import { cloneDeep, random } from 'lodash';

import { PinkToast } from './pink.toast';
import { ToastrConfig, ToastrService } from '../lib/toastr';

const quotes = [
  {
    title: 'Title',
    message: 'Message'
  },
  {
    title: '😃',
    message: 'Supports Emoji'
  },
  {
    title: null,
    message: 'My name is Inigo Montoya. You killed my father. Prepare to die!',
  },
  {
    title: null,
    message: 'Titles are not always needed'
  },
  {
    title: 'Title only 👊',
    message: null,
  },
  {
    title: '',
    message: `Supports Angular ${VERSION.full}`,
  },
];
const types = ['success', 'error', 'info', 'warning'];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  options: ToastrConfig;
  title = '';
  type = types[0];
  message = '';
  version = VERSION;
  private lastInserted: number[] = [];

  constructor(public toastrService: ToastrService) {
    // sync options to toastrservice
    // this sets the options in the demo
    this.options = this.toastrService.toastrConfig;
  }
  openToast() {
    // Clone current config so it doesn't change when ngModel updates
    let m = this.message;
    let t = this.title;
    if (!this.title.length && !this.message.length) {
      const randomMessage = quotes[random(0, quotes.length - 1)];
      m = randomMessage.message;
      t = randomMessage.title;
    }
    const opt = cloneDeep(this.options);
    const inserted = this.toastrService[this.type](m, t, opt);
    if (inserted) {
      this.lastInserted.push(inserted.toastId);
    }
    return inserted;
  }
  openPinkToast() {
    const opt = cloneDeep(this.options);
    opt.toastComponent = PinkToast;
    opt.toastClass = 'toast toast-pink';
    let m = this.message;
    let t = this.title;
    if (!this.title.length && !this.message.length) {
      const randomMessage = quotes[random(0, quotes.length - 1)];
      m = randomMessage.message;
      t = randomMessage.title;
    }
    const inserted = this.toastrService.success(m, t, opt);
    if (inserted) {
      this.lastInserted.push(inserted.toastId);
    }
  }
  clearToasts() {
    this.toastrService.clear();
  }
  clearLastToast() {
    this.toastrService.clear(this.lastInserted.pop());
  }
}
