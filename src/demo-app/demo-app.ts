import { Component, ViewEncapsulation, OnInit, ViewContainerRef } from '@angular/core';
import { ToastrService, ToastrConfig, ActiveToast } from '../components/toastr/toastr';

const quotes = [
  {
    title: 'Come to Freenode',
    message: 'We rock at <em>#angularjs</em>',
    options: {
      allowHtml: true
    }
  },
  {
    title: 'Looking for bootstrap?',
    message: 'Try ui-bootstrap out!'
  },
  {
    title: 'Wants a better router?',
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
    title: 'What about nice html?',
    message: '<strong>Sure you <em>can!</em></strong>',
    options: {
      allowHtml: true
    }
  },
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
  providers: [],
  templateUrl: 'demo-app/demo-app.html',
  styleUrls: ['demo-app/demo-app.css'],
  directives: [],
  encapsulation: ViewEncapsulation.None,
  pipes: [],
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
    // necessary until we can accesses viewContainerRef in service
    toastrService.viewContainerRef = this.viewContainerRef;

    // setup
    this.options = new ToastrConfig();
  }
  openToast() {
    let inserted = this.toastrService[this.type](this.message, this.title, this.options);
    inserted.then((activeToast: ActiveToast) => {
      this.lastInserted.push(activeToast.toastId);
    });
  }
  openRandomToast() {

  }
  clearToasts() {
    this.toastrService.clear();
  }
  clearLastToast() {
    this.toastrService.remove(this.lastInserted.pop());
  }
}
