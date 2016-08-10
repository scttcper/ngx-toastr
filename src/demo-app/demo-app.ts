import { Component, ViewEncapsulation, ViewContainerRef } from '@angular/core';
import { ToastrConfig, ToastrService } from '../components/toastr/toastr';
import * as _ from 'lodash';


const quotes = [
  // {
  //   title: 'Come to Freenode',
  //   message: 'We rock at <em>#angularjs</em>',
  //   options: {
  //     allowHtml: true
  //   }
  // },
  {
    title: 'Looking for bootstrap?',
    message: 'Try ui-bootstrap out!'
  },
  {
    title: 'Want a better router?',
    message: 'We have you covered with ui-router'
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
    message: 'Toastr rock!'
  },
  {
    title: 'Title only',
    message: null,
  },
  // {
  //   title: 'What about nice html?',
  //   message: '<strong>Sure you <em>can!</em></strong>',
  //   options: {
  //     allowHtml: true
  //   }
  // },
  // {
  //   title: 'Ionic is <em>cool</em>',
  //   message: 'Best mobile framework ever',
  //   options: {
  //     allowHtml: true
  //   }
  // }
];
const types: string[] = ['success', 'error', 'info', 'warning'];


@Component({
  selector: 'demo-app',
  templateUrl: 'demo-app/demo-app.html',
  styleUrls: ['demo-app/demo-app.css'],
  encapsulation: ViewEncapsulation.None,
})
export class DemoApp {
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
    let newConfig = _.cloneDeep(this.options);
    let m = this.message;
    let t = this.title;
    if (!this.title.length && !this.message.length) {
      let randomMessage = quotes[_.random(0, quotes.length - 1)];
      m = randomMessage.message;
      t = randomMessage.title;
    }
    let ins = this.toastrService[this.type](m, t, newConfig);
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
