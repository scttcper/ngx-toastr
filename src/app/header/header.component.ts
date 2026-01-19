import { Component } from '@angular/core';
import { GhButtonModule } from '@ctrl/ngx-github-buttons';

@Component({
  selector: 'app-header',
  template: `
    <header class="header mt-5 text-center">
      <h1>Angular Toastr</h1>
      <p style="color: #777" class="mb-1">Easy Toasts for Angular</p>
      <gh-button user="scttcper" repo="ngx-toastr" [count]="true"></gh-button>
    </header>
  `,
  imports: [GhButtonModule],
})
export class HeaderComponent {}
