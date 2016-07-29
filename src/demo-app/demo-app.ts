import {Component, ViewEncapsulation, OnInit, ViewContainerRef} from '@angular/core';
import { ToastrService } from '../components/toastr/toastr';
import { OVERLAY_PROVIDERS } from '@angular2-material/core';


@Component({
  selector: 'demo-app',
  providers: [OVERLAY_PROVIDERS, ToastrService],
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
  }
  toastMe() {
    this.toastrService.success('hello')
  }
}
