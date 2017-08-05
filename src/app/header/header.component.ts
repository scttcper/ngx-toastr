import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  styles: [`
  .header {
    text-align: center;
  }
  .header h1 {
    font-size: 46px;
    font-family: Helvetica Neue,Helvetica,Arial,sans-serif;
    font-weight: bold;
  }
  `],
  template: `
  <header class="header mt-5">
    <h1>Angular Toastr</h1>
    <p>Easy Toasts for Angular.</p>
    <github-link></github-link>
  </header>
  `,
})
export class HeaderComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
