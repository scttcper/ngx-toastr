import {Component, ViewEncapsulation, OnInit, ViewContainerRef} from '@angular/core';
import { ToastrService } from '../components/toastr/toastr';
import { OVERLAY_PROVIDERS } from '@angular2-material/core';

@Component({
  selector: 'demo-app',
  providers: [ToastrService, OVERLAY_PROVIDERS],
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
  ) { }
  toastMe() {
    console.log('hi')
    this.toastrService.success(this.viewContainerRef, 'hello')
  }
}
