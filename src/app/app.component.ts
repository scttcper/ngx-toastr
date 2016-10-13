import { Component, ViewEncapsulation, ViewContainerRef } from '@angular/core';
import { ToastrConfig, ToastrService } from '../lib/toastr';
import { cloneDeep } from 'lodash/fp';


const quotes = [
  {
    title: 'Title',
    message: 'Message'
  },
  {
    title: '🍚',
    message: 'Rice bowls'
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
    title: null,
    message: 'No title here'
  },
  {
    title: 'Title only 👊',
    message: null,
  },
];
const types: string[] = ['success', 'error', 'info', 'warning'];

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent {
  options: ToastrConfig;

  title: string = '';
  type: string = types[0];
  message: string = '';
  lastInserted: number[] = [];

  constructor(
    private toastrService: ToastrService,
    private viewContainerRef: ViewContainerRef
  ) {
    // sync options to toastrservice
    this.options = this.toastrService.toastrConfig;
    // necessary until we can accesses viewContainerRef in service
    toastrService.viewContainerRef = this.viewContainerRef;
  }
  openToast() {
    // Clone current config so it doesn't change when ngModel updates
    let m = this.message;
    let t = this.title;
    if (!this.title.length && !this.message.length) {
      let randomMessage = quotes[getRandomInt(0, quotes.length - 1)];
      m = randomMessage.message;
      t = randomMessage.title;
    }
    let ins = this.toastrService[this.type](m, t, cloneDeep(this.options));
    if (ins) {
      this.lastInserted.push(ins.toastId);
    }
  }
  openRandomToast() {

  }
  clearToasts() {
    this.toastrService.clear();
  }
  clearLastToast() {
    this.toastrService.clear(this.lastInserted.pop());
  }
}
