import {Component, ViewEncapsulation, OnInit, ViewContainerRef} from '@angular/core';
import { TOASTR_PROVIDERS, ToastrService } from '../components/toastr/toastr';


@Component({
  selector: 'demo-app',
  providers: [TOASTR_PROVIDERS],
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
    this.toastrService.success('My name is Inigo Montoya. You killed my father. Prepare to die!');
  }
}
