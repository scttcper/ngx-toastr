import {Component, ViewEncapsulation, OnInit} from '@angular/core';
import { ToastrService } from '../components/toastr/toastr';

@Component({
  selector: 'demo-app',
  providers: [ToastrService],
  templateUrl: 'demo-app/demo-app.html',
  styleUrls: ['demo-app/demo-app.css'],
  directives: [],
  encapsulation: ViewEncapsulation.None,
  pipes: [],
})
export class DemoApp {
  constructor() { }
  toastMe() {
    console.log('hi')
  }
}
