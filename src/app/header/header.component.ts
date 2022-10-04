import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  template: `
    <header class="header text-center">
      <div style="background-color: #1162D8;color:white;padding-bottom:2px;">
      <h1 >Angular Toastr</h1>
      </div>
      <p style="color: #777" class="mb-1 mt-5">Easy Toasts for Angular</p>
      <gh-button user="scttcper" repo="ngx-toastr" [count]="true"></gh-button>
    </header>
  `,
})
export class HeaderComponent {}
