import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  template: `
  <header class="header mt-5 text-center">
    <h1>Angular Toastr</h1>
    <p style="color: #777" class="mb-1">Easy Toasts for Angular</p>
    <mdo-github-button user="scttcper" repo="ngx-toastr" [count]="true"></mdo-github-button>
  </header>
  `,
})
export class HeaderComponent {}
