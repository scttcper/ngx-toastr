import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  styles: [`
  .header {
    text-align: center;
  }
  .header h1 {
    font-size: 46px;
  }
  `],
  template: `
  <header class="header">
    <h1>Angular Toastr</h1>
    <p>Easy Toasts for Angular.</p>
  </header>
  `,
})
export class HeaderComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
