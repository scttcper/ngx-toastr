import { Component, VERSION } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { cloneDeep, random } from 'lodash';

import { GlobalConfig, ToastrService } from '../lib';
import json from '../lib/package.json';

import { PinkToast } from './pink.toast';
import { NotyfToast } from './notyf.toast';

interface Quote {
  title?: string;
  message?: string;
}

const quotes: Quote[] = [
  {
    title: 'Title',
    message: 'Message'
  },
  {
    title: '😃',
    message: 'Supports Emoji'
  },
  {
    message: 'My name is Inigo Montoya. You killed my father. Prepare to die!',
  },
  {
    message: 'Titles are not always needed'
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
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  options: GlobalConfig;
  title = '';
  message = '';
  type = types[0];
  version = VERSION;
  private lastInserted: number[] = [];

  constructor(
    public toastr: ToastrService,
    private t: Title
  ) {
    // sync options to toastrservice
    // this sets the options in the demo
    this.options = this.toastr.toastrConfig;
    const current = t.getTitle();
    // fix for tests
    if (json) {
      t.setTitle(`${current} ${json.version}`);
    }
  }
  openToast() {
    // Clone current config so it doesn't change when ngModel updates
    let m: string | undefined = this.message;
    let t: string | undefined = this.title;
    if (!this.title.length && !this.message.length) {
      const randomMessage = quotes[random(0, quotes.length - 1)];
      m = randomMessage.message;
      t = randomMessage.title;
    }
    const opt = cloneDeep(this.options);
    const inserted = this.toastr[this.type](m, t, opt);
    if (inserted) {
      this.lastInserted.push(inserted.toastId);
    }
    return inserted;
  }
  openPinkToast() {
    const opt = cloneDeep(this.options);
    opt.toastComponent = PinkToast;
    opt.toastClass = 'pinktoast';
    let m: string | undefined = this.message;
    let t: string | undefined = this.title;
    if (!this.title.length && !this.message.length) {
      const randomMessage = quotes[random(0, quotes.length - 1)];
      m = randomMessage.message || '';
      t = randomMessage.title;
    }
    const inserted = this.toastr.show(m, t, opt);
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
    let m: string | undefined = this.message;
    let t: string | undefined = this.title;
    if (!this.title.length && !this.message.length) {
      const randomMessage = quotes[random(0, quotes.length - 1)];
      m = randomMessage.message;
      t = randomMessage.title;
    }
    m = m || 'Success';
    const inserted = this.toastr.show(m, t, opt);
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
}
