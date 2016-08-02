import {Component, ViewEncapsulation, OnInit, ViewContainerRef} from '@angular/core';
import { ToastrService } from '../components/toastr/toastr';

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
    title: 'Angular 2',
    message: 'Is gonna rock the world'
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
  {
    title: 'Ionic is <em>cool</em>',
    message: 'Best mobile framework ever',
    options: {
      allowHtml: true
    }
  }
]


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
  constructor(
    private toastrService: ToastrService,
    private viewContainerRef: ViewContainerRef
  ) {
    toastrService.viewContainerRef = this.viewContainerRef;
    this.toastMe();
  }
  toastMe() {
    this.toastrService.success('My name is Inigo Montoya. You killed my father. Prepare to die!', 'Title');
  }
}
